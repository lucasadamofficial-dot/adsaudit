import type { AuditResult, AuditIssue, Severity } from './mock-data'

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 20, high: 10, medium: 5, low: 2,
}

export function computeOverallScore(issues: AuditIssue[]): number {
  const penalty = issues.reduce((sum, i) => sum + SEVERITY_WEIGHT[i.severity], 0)
  return Math.max(0, Math.min(100, 100 - Math.min(penalty, 100)))
}

export function severityLabel(s: Severity): string {
  return { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' }[s]
}

export function severityColor(s: Severity): string {
  return {
    critical: 'bg-red-50 text-red-700 border border-red-200',
    high:     'bg-orange-50 text-orange-700 border border-orange-200',
    medium:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
    low:      'bg-green-50 text-green-700 border border-green-200',
  }[s]
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Good'
  if (score >= 60) return 'Needs work'
  return 'Poor'
}

export function formatUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(cents)
                              }
