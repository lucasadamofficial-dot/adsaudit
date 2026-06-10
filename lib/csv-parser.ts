import type { AuditResult, AuditIssue, ModuleScore, AuditModule, Severity } from './mock-data'

// ─── Low-level CSV helpers ────────────────────────────────────────────────────

type CSVRow = Record<string, string>

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === ',' && !inQuotes) { result.push(current.replace(/^"|"$/g, '').trim()); current = '' }
    else { current += ch }
  }
  result.push(current.replace(/^"|"$/g, '').trim())
  return result
}

function parseCSVRows(text: string): { headers: string[]; rows: CSVRow[] } {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  let headerIdx = 0
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase()
    if (
      l.startsWith('"google') || l.startsWith('google') ||
      l.startsWith('"report') || l.startsWith('"date') ||
      l.startsWith('"account') || l.startsWith('"currency') ||
      l.startsWith('"time zone')
    ) continue
    headerIdx = i
    break
  }
  const headers = parseCSVLine(lines[headerIdx])
  const rows: CSVRow[] = []
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i])
    if (vals.length < 2) continue
    const first = vals[0].toLowerCase()
    if (first === '' || first.includes('total') || first.includes('--')) continue
    const row: CSVRow = {}
    headers.forEach((h, idx) => { row[h.trim()] = (vals[idx] ?? '').trim() })
    rows.push(row)
  }
  return { headers, rows }
}

function cleanNum(val: string): number {
  if (!val) return 0
  return parseFloat(val.replace(/[$,%]/g, '').replace(/,/g, '')) || 0
}

function col(row: CSVRow, ...terms: string[]): string {
  for (const term of terms) {
    const key = Object.keys(row).find(k => k.toLowerCase().includes(term.toLowerCase()))
    if (key !== undefined) return row[key] ?? ''
  }
  return ''
}

export type ReportType = 'campaign' | 'keyword' | 'search_term' | 'ad' | 'unknown'

function detectReportType(headers: string[]): ReportType {
  const h = headers.map(h => h.toLowerCase()).join(' ')
  if (h.includes('search term') || h.includes('search query')) return 'search_term'
  if (h.includes('match type') || h.includes('keyword')) return 'keyword'
  if (h.includes('headline') || h.includes('description') || (h.includes('ad') && !h.includes('campaign'))) return 'ad'
  if (h.includes('campaign') || h.includes('budget')) return 'campaign'
  return 'unknown'
}

export interface ParseResult {
  result: Partial<AuditResult>
  reportType: ReportType
  rowCount: number
  accountName: string
}

export function parseGoogleAdsCSV(csvText: string): ParseResult {
  const { headers, rows } = parseCSVRows(csvText)
  const reportType = detectReportType(headers)

  const accountLine = csvText.split('\n').find(l =>
    l.toLowerCase().includes('account name') || l.toLowerCase().includes('account:')
  )
  const accountName = accountLine
    ? accountLine.replace(/["]/g, '').split(':').pop()?.trim() ?? 'Your Account'
    : 'Your Account'

  const issues: AuditIssue[] = []
  const moduleScores: ModuleScore[] = []

  if (reportType === 'campaign')         analyzeCampaigns(rows, issues, moduleScores)
  else if (reportType === 'keyword')     analyzeKeywords(rows, issues, moduleScores)
  else if (reportType === 'search_term') analyzeSearchTerms(rows, issues, moduleScores)
  else                                   analyzeGeneric(rows, issues, moduleScores)

  const critical = issues.filter(i => i.severity === 'critical').length
  const high     = issues.filter(i => i.severity === 'high').length
  const medium   = issues.filter(i => i.severity === 'medium').length
  const overallScore = Math.max(10, Math.min(100, 100 - critical * 15 - high * 8 - medium * 3))

  const today    = new Date()
  const monthAgo = new Date(today.getTime() - 30 * 24 * 3600_000)

  const result: Partial<AuditResult> = {
    accountName,
    overallScore,
    issues,
    modules: moduleScores,
    runAt: today.toISOString(),
    scoreHistory: [
      { date: monthAgo.toISOString().slice(0, 10), score: Math.min(overallScore + 12, 100) },
      { date: today.toISOString().slice(0, 10),    score: overallScore },
    ],
  }

  return { result, reportType, rowCount: rows.length, accountName }
}

// ─── Analysers ────────────────────────────────────────────────────────────────

function analyzeCampaigns(rows: CSVRow[], issues: AuditIssue[], moduleScores: ModuleScore[]) {
  let score = 85
  let id = 1

  const zeroCv = rows.filter(r => cleanNum(col(r, 'conv')) === 0 && cleanNum(col(r, 'cost', 'spend')) > 100)
  if (zeroCv.length > 0) {
    const wasted = zeroCv.reduce((s, r) => s + cleanNum(col(r, 'cost', 'spend')), 0)
    const names  = zeroCv.slice(0, 3).map(r => col(r, 'Campaign')).filter(Boolean).join(', ')
    issues.push({
      id: `csv-c${id++}`, module: 'campaign' as AuditModule, severity: 'high' as Severity,
      title: `${zeroCv.length} campaign(s) spending with zero conversions`,
      description: `Campaigns with no conversions are wasting budget${names ? ': ' + names : ''}. Estimated monthly waste: $${Math.round(wasted)}.`,
      fix: 'Pause or add a conversion goal to each zero-conversion campaign. Check if conversion tracking is properly configured.',
      estimatedSaving: Math.round(wasted * 100),
      affectedCount: zeroCv.length,
    })
    score -= 12
  }

  const budgetLtd = rows.filter(r => {
    const s = col(r, 'budget status', 'why limited', 'budget type').toLowerCase()
    return s.includes('budget') || s.includes('limited')
  })
  if (budgetLtd.length > 0) {
    issues.push({
      id: `csv-c${id++}`, module: 'campaign' as AuditModule, severity: 'medium' as Severity,
      title: `${budgetLtd.length} campaign(s) limited by budget`,
      description: "These campaigns are hitting their daily cap — you're losing impressions and clicks.",
      fix: 'Raise daily budget or improve QS to reduce CPCs so budget goes further.',
      affectedCount: budgetLtd.length,
    })
    score -= 6
  }

  const lowCTR = rows.filter(r => cleanNum(col(r, 'ctr')) < 2 && cleanNum(col(r, 'impr')) > 500)
  if (lowCTR.length > 0) {
    issues.push({
      id: `csv-c${id++}`, module: 'ads' as AuditModule, severity: 'medium' as Severity,
      title: `${lowCTR.length} campaign(s) with CTR below 2%`,
      description: 'Low CTR signals poor ad relevance or weak copy for the targeted searches.',
      fix: 'Rewrite ad headlines to match search intent. Add sitelinks, callouts and structured snippets.',
      estimatedCvrLift: 18,
      affectedCount: lowCTR.length,
    })
    score -= 5
  }

  moduleScores.push({ module: 'campaign' as AuditModule, score: Math.max(30, score), label: 'Campaign health', issueCount: issues.length, passCount: 3 - issues.length })
}

function analyzeKeywords(rows: CSVRow[], issues: AuditIssue[], moduleScores: ModuleScore[]) {
  let score = 82
  let id = 100

  const lowQS = rows.filter(r => { const qs = cleanNum(col(r, 'quality score', 'qual. score', 'qual score')); return qs > 0 && qs <= 4 })
  if (lowQS.length > 0) {
    issues.push({
      id: `csv-k${id++}`, module: 'keywords' as AuditModule, severity: (lowQS.length > 10 ? 'high' : 'medium') as Severity,
      title: `${lowQS.length} keyword(s) with Quality Score ≤ 4`,
      description: 'Low QS keywords cost 25–400% more per click and get lower ad positions.',
      fix: 'Improve landing page relevance and ad copy for these keywords, or pause them to protect overall account QS.',
      estimatedSaving: lowQS.length * 3500,
      affectedCount: lowQS.length,
    })
    score -= Math.min(20, lowQS.length * 1.5)
  }

  const totalWithMatch = rows.filter(r => col(r, 'match type').trim() !== '')
  const broad = totalWithMatch.filter(r => col(r, 'match type').toLowerCase().trim() === 'broad')
  if (broad.length > 0 && broad.length > totalWithMatch.length * 0.3) {
    issues.push({
      id: `csv-k${id++}`, module: 'keywords' as AuditModule, severity: 'high' as Severity,
      title: `${broad.length} broad match keywords (${Math.round(broad.length / totalWithMatch.length * 100)}% of total)`,
      description: 'High broad match ratio without Smart Bidding wastes significant budget on irrelevant queries.',
      fix: 'Switch to phrase or exact match for most keywords. Only use broad match with Target CPA/ROAS.',
      affectedCount: broad.length,
    })
    score -= 15
  }

  const zeroImpr = rows.filter(r => cleanNum(col(r, 'impr', 'impression')) === 0)
  if (zeroImpr.length > 5) {
    issues.push({
      id: `csv-k${id++}`, module: 'keywords' as AuditModule, severity: 'low' as Severity,
      title: `${zeroImpr.length} keyword(s) with zero impressions`,
      description: "These keywords aren't triggering ads. They may have bids below first page or be disapproved.",
      fix: 'Review each: increase bids, broaden match type, or remove keywords that are never relevant.',
      affectedCount: zeroImpr.length,
    })
    score -= 4
  }

  const expensiveNoConv = rows.filter(r => cleanNum(col(r, 'avg. cpc', 'avg cpc')) > 5 && cleanNum(col(r, 'conv')) === 0 && cleanNum(col(r, 'clicks')) > 20)
  if (expensiveNoConv.length > 0) {
    const wasted = expensiveNoConv.reduce((s, r) => s + cleanNum(col(r, 'cost', 'spend')), 0)
    issues.push({
      id: `csv-k${id++}`, module: 'keywords' as AuditModule, severity: 'high' as Severity,
      title: `${expensiveNoConv.length} expensive keyword(s) with no conversions`,
      description: `High-CPC keywords (avg CPC > $5) generating no conversions — ~$${Math.round(wasted)} in potentially wasted spend.`,
      fix: 'Lower bids, tighten match type, or pause keywords that consistently spend without converting.',
      estimatedSaving: Math.round(wasted * 100),
      affectedCount: expensiveNoConv.length,
    })
    score -= 10
  }

  moduleScores.push({ module: 'keywords' as AuditModule, score: Math.max(20, score), label: 'Keywords', issueCount: issues.length, passCount: 4 - issues.length })
}

function analyzeSearchTerms(rows: CSVRow[], issues: AuditIssue[], moduleScores: ModuleScore[]) {
  let score = 75
  let id = 200

  const irrelevant = rows.filter(r => cleanNum(col(r, 'conv')) === 0 && cleanNum(col(r, 'cost', 'spend')) > 10 && col(r, 'match type').toLowerCase() !== 'exact')
  if (irrelevant.length > 0) {
    const wasted = irrelevant.reduce((s, r) => s + cleanNum(col(r, 'cost', 'spend')), 0)
    issues.push({
      id: `csv-s${id++}`, module: 'keywords' as AuditModule, severity: 'critical' as Severity,
      title: `${irrelevant.length} search terms spending budget without converting`,
      description: `These triggered-but-non-converting search terms represent ~$${Math.round(wasted)} in wasted spend.`,
      fix: 'Add the worst offenders as negative keywords immediately. Review weekly to catch new ones.',
      estimatedSaving: Math.round(wasted * 100),
      affectedCount: irrelevant.length,
    })
    score -= 25
  }

  const lowCTR = rows.filter(r => cleanNum(col(r, 'ctr')) < 1 && cleanNum(col(r, 'impr')) > 200)
  if (lowCTR.length > 0) {
    issues.push({
      id: `csv-s${id++}`, module: 'ads' as AuditModule, severity: 'medium' as Severity,
      title: `${lowCTR.length} search term(s) with CTR below 1%`,
      description: "Very low CTR means your ads aren't relevant to what users are searching for.",
      fix: 'Create dedicated ad groups and tailored ad copy for your highest-volume search terms.',
      estimatedCvrLift: 22,
      affectedCount: lowCTR.length,
    })
    score -= 8
  }

  moduleScores.push({ module: 'keywords' as AuditModule, score: Math.max(20, score), label: 'Keywords', issueCount: issues.length, passCount: 2 - issues.length })
}

function analyzeGeneric(rows: CSVRow[], issues: AuditIssue[], moduleScores: ModuleScore[]) {
  issues.push({
    id: 'csv-generic-1', module: 'campaign' as AuditModule, severity: 'low' as Severity,
    title: 'CSV uploaded — upload a specific report for deeper analysis',
    description: `Parsed ${rows.length} rows. For richer results, upload a Campaigns, Keywords, or Search Terms report.`,
    fix: 'In Google Ads: Reports → Predefined Reports → select Campaigns, Keywords, or Search Terms → Download as CSV.',
    affectedCount: rows.length,
  })
  moduleScores.push({ module: 'campaign' as AuditModule, score: 70, label: 'Campaign health', issueCount: 1, passCount: 0 })
}
