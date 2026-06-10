export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type AuditModule = 'campaign' | 'keywords' | 'ads' | 'bidding' | 'tracking' | 'audiences' | 'landing'

export interface AuditIssue {
  id: string
  module: AuditModule
  severity: Severity
  title: string
  description: string
  fix: string
  estimatedSaving?: number
  estimatedCvrLift?: number
  affectedCount?: number
}

export interface ModuleScore {
  module: AuditModule
  label: string
  score: number
  issueCount: number
  passCount: number
}

export interface AuditResult {
  accountId: string
  accountName: string
  runAt: string
  overallScore: number
  wastedSpend: number
  issuesFound: number
  issues: AuditIssue[]
  modules: ModuleScore[]
  scoreHistory: { date: string; score: number }[]
}

export const MOCK_AUDIT: AuditResult = {
  accountId: 'mock-001',
  accountName: 'Print247 — Google Ads',
  runAt: new Date().toISOString(),
  overallScore: 62,
  wastedSpend: 1840,
  issuesFound: 23,
  scoreHistory: [
    { date: '2026-01', score: 44 },
    { date: '2026-02', score: 51 },
    { date: '2026-03', score: 55 },
    { date: '2026-04', score: 58 },
    { date: '2026-05', score: 60 },
    { date: '2026-06', score: 62 },
  ],
  modules: [
    { module: 'campaign',  label: 'Campaign health', score: 55, issueCount: 4, passCount: 6 },
    { module: 'keywords',  label: 'Keywords',         score: 48, issueCount: 6, passCount: 4 },
    { module: 'ads',       label: 'Ad copy & assets', score: 60, issueCount: 4, passCount: 5 },
    { module: 'bidding',   label: 'Bidding & budget', score: 65, issueCount: 3, passCount: 5 },
    { module: 'tracking',  label: 'Tracking',         score: 50, issueCount: 3, passCount: 3 },
    { module: 'audiences', label: 'Audiences',        score: 72, issueCount: 2, passCount: 6 },
    { module: 'landing',   label: 'Landing pages',    score: 80, issueCount: 1, passCount: 7 },
  ],
  issues: [
    {
      id: 'trk-001', module: 'tracking', severity: 'critical',
      title: 'Conversion tag fires on every page load',
      description: 'Your Google Ads conversion tag is placed in the global site header and fires on every page — not just thank-you pages. This is inflating conversion data by an estimated 6x.',
      fix: 'Move the conversion tag to the order confirmation / thank-you page only. Use Google Tag Manager and trigger it on the URL path /thank-you or when a specific dataLayer event fires.',
      affectedCount: 1,
    },
    {
      id: 'kw-001', module: 'keywords', severity: 'high',
      title: '52 irrelevant search terms burning $920/month',
      description: 'In the last 30 days, 52 search terms triggered your ads that have zero conversions and a combined spend of $920.',
      fix: 'Add these 52 terms as exact or phrase negative keywords. In Google Ads, go to Keywords → Search Terms → select all zero-conversion terms with spend > $5 → Add as negative keywords.',
      estimatedSaving: 920, affectedCount: 52,
    },
    {
      id: 'kw-002', module: 'keywords', severity: 'high',
      title: '14 duplicate keywords across ad groups',
      description: '14 keywords appear in multiple ad groups, causing your own ads to compete against each other in the auction. This drives up CPCs and reduces Quality Score.',
      fix: 'Identify duplicates via the keyword report filtered by keyword text. Keep the keyword in the most relevant ad group and pause or remove from others.',
      affectedCount: 14,
    },
    {
      id: 'kw-003', module: 'keywords', severity: 'high',
      title: 'Broad match keywords consuming 68% of budget',
      description: 'Broad match keywords are capturing highly irrelevant queries and account for 68% of total spend.',
      fix: 'Shift primary keywords to phrase or exact match. If using broad match intentionally with Smart Bidding, ensure you have a comprehensive negative keyword list.',
      estimatedSaving: 640,
    },
    {
      id: 'kw-004', module: 'keywords', severity: 'medium',
      title: '8 keywords with Quality Score <= 3',
      description: 'Low Quality Score increases your CPC and reduces ad rank. 8 keywords have QS of 3 or below.',
      fix: 'For each low-QS keyword: ensure the ad copy contains the keyword and the landing page copy matches.',
      affectedCount: 8,
    },
    {
      id: 'kw-005', module: 'keywords', severity: 'medium',
      title: 'No negative keyword lists shared across campaigns',
      description: 'You have no shared negative keyword lists applied. Common exclusions must be manually added to every campaign.',
      fix: 'Create a shared negative keyword list in Tools → Shared Library → Negative Keyword Lists.',
    },
    {
      id: 'kw-006', module: 'keywords', severity: 'low',
      title: '23 keywords with zero impressions in 60 days',
      description: 'These keywords are not triggering ads — possibly due to low search volume, narrow match type, or budget constraints.',
      fix: 'Review each zero-impression keyword. If they represent real intent, broaden the match type or check that bid is above the first-page CPC estimate.',
      affectedCount: 23,
    },
    {
      id: 'camp-001', module: 'campaign', severity: 'high',
      title: '3 campaigns with zero conversions in 45 days',
      description: 'Three campaigns have been running for 45+ days with significant spend ($1,200 combined) and zero recorded conversions.',
      fix: 'Audit each zero-conversion campaign: check conversion tracking is firing, review search term reports for relevance, check landing page load times.',
      estimatedSaving: 1200, affectedCount: 3,
    },
    {
      id: 'camp-002', module: 'campaign', severity: 'medium',
      title: 'No ad scheduling — ads running 24/7',
      description: 'All campaigns serve ads at all hours. 82% of conversions happen between 8am–8pm. You are paying for impressions during low-intent overnight hours.',
      fix: 'Enable ad scheduling: Settings → Ad Schedule. Set full bids for 8am–8pm, reduce bids by 60–80% for overnight hours.',
    },
    {
      id: 'camp-003', module: 'campaign', severity: 'medium',
      title: '2 campaigns missing location targeting refinement',
      description: 'Two campaigns are targeting "United States" broadly with no city or radius targeting.',
      fix: 'Go to Campaign Settings → Locations and add your target cities, regions, or a radius around your business location.',
      affectedCount: 2,
    },
    {
      id: 'camp-004', module: 'campaign', severity: 'low',
      title: 'Campaign names are inconsistent',
      description: 'Campaign names do not follow a consistent naming convention, making it hard to filter, sort, or automate reporting.',
      fix: 'Adopt a naming convention: [Product] | [Network] | [Match Type] | [Location].',
    },
    {
      id: 'ads-001', module: 'ads', severity: 'high',
      title: '9 ad groups have only 1 active ad',
      description: 'With only one ad per ad group, Google has no variation to test and cannot optimise for the best-performing copy.',
      fix: 'Add at least 2–3 RSA ads per ad group with different value propositions.',
      affectedCount: 9, estimatedCvrLift: 15,
    },
    {
      id: 'ads-002', module: 'ads', severity: 'medium',
      title: 'RSA asset strength rated Poor or Average on 6 ads',
      description: 'Google rates Responsive Search Ads on asset strength. 6 of your ads are rated Poor or Average.',
      fix: 'For each RSA, add 15 unique headlines and 4 descriptions. Include: brand name, primary keyword, USP, and a call to action.',
      affectedCount: 6,
    },
    {
      id: 'ads-003', module: 'ads', severity: 'medium',
      title: 'Missing ad extensions on 5 campaigns',
      description: 'Five campaigns are missing sitelinks, callouts, and structured snippets. Extensions improve CTR by 10–15%.',
      fix: 'Add: Sitelinks (4–6 links), Callouts (3–6 benefits like "Free Samples"), Structured Snippets.',
      affectedCount: 5, estimatedCvrLift: 12,
    },
    {
      id: 'ads-004', module: 'ads', severity: 'low',
      title: 'No call extensions on campaigns targeting mobile',
      description: 'Your campaigns receive significant mobile traffic but have no call extensions.',
      fix: 'Add a call extension with your business phone number set to show during business hours.',
    },
    {
      id: 'bid-001', module: 'bidding', severity: 'high',
      title: 'Target CPA set with insufficient conversion data',
      description: '3 campaigns are using Target CPA smart bidding but have fewer than 30 conversions in the past 30 days. Smart bidding requires 50+ conversions/month to work effectively.',
      fix: 'Switch these campaigns to Maximise Conversions until they accumulate 50+ monthly conversions. Then set a Target CPA based on your actual average CPA.',
      affectedCount: 3,
    },
    {
      id: 'bid-002', module: 'bidding', severity: 'medium',
      title: '2 campaigns limited by budget',
      description: 'Two campaigns show "Limited by budget" status, losing impression share. Combined estimated missed clicks: ~240/day.',
      fix: 'Increase the budget for these campaigns, or shift budget from lower-performing campaigns.',
      affectedCount: 2,
    },
    {
      id: 'bid-003', module: 'bidding', severity: 'low',
      title: 'No ROAS targets set on product campaigns',
      description: 'Product-focused campaigns have no Target ROAS set. Without a revenue target, the algorithm optimises for conversions only.',
      fix: 'Calculate your target ROAS: (Revenue Goal / Ad Spend Goal) x 100. Set in Campaign Settings → Bidding → Target ROAS.',
    },
    {
      id: 'trk-002', module: 'tracking', severity: 'high',
      title: 'GA4 not linked to Google Ads',
      description: 'Your Google Analytics 4 property is not linked to this Google Ads account. You are missing audience data, cross-channel attribution.',
      fix: 'In Google Ads: Tools → Linked Accounts → Google Analytics → Link.',
    },
    {
      id: 'trk-003', module: 'tracking', severity: 'medium',
      title: 'No value assigned to lead conversions',
      description: 'Lead form submissions are tracked as conversions but have no conversion value assigned. This prevents value-based bidding.',
      fix: 'Assign a value to each lead based on your average lead-to-sale rate and average order value.',
    },
    {
      id: 'aud-001', module: 'audiences', severity: 'medium',
      title: 'No remarketing audiences applied to Search campaigns',
      description: 'You have no RLSA applied to your Search campaigns. Website visitors convert at 2–5x the rate of cold traffic.',
      fix: 'Create audience lists for: all visitors (30 days), product page visitors (14 days), cart abandoners (7 days). Apply as Observation with bid adjustments.',
      estimatedCvrLift: 30,
    },
    {
      id: 'aud-002', module: 'audiences', severity: 'low',
      title: 'Customer Match audience not uploaded',
      description: 'You have not uploaded a Customer Match list. It lets you target or exclude existing customers.',
      fix: 'Export your customer email list (min 1,000 emails). In Google Ads: Tools → Audience Manager → Customer Match → Upload.',
    },
    {
      id: 'lp-001', module: 'landing', severity: 'medium',
      title: 'Average landing page load time: 6.8 seconds',
      description: 'Your landing pages average 6.8s load time on mobile. Each additional second reduces conversions by ~7%. Industry benchmark is under 3s.',
      fix: 'Run pages through pagespeed.web.dev. Top fixes: compress images (WebP), remove unused JS, enable browser caching, use a CDN.',
      estimatedCvrLift: 20,
    },
  ],
}

export function getIssuesByModule(result: AuditResult, module: AuditModule): AuditIssue[] {
  return result.issues.filter(i => i.module === module)
}

export function getIssuesBySeverity(result: AuditResult, severity: Severity): AuditIssue[] {
  return result.issues.filter(i => i.severity === severity)
}

export function getTotalWastedSpend(result: AuditResult): number {
  return result.issues.reduce((sum, i) => sum + (i.estimatedSaving || 0), 0)
}
