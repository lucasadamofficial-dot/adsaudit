'use client'
import { useState } from 'react'
import type { AuditResult, AuditModule } from '@/lib/mock-data'
import IssueCard from './IssueCard'
import { scoreColor } from '@/lib/audit-engine'
import { CheckCircle2 } from 'lucide-react'

const TABS: { id: AuditModule; label: string; emoji: string }[] = [
  { id: 'campaign',  label: 'Campaign health', emoji: '🎯' },
  { id: 'keywords',  label: 'Keywords',         emoji: '🔍' },
  { id: 'ads',       label: 'Ad copy',          emoji: '📝' },
  { id: 'bidding',   label: 'Bidding',          emoji: '📈' },
  { id: 'tracking',  label: 'Tracking',         emoji: '📡' },
  { id: 'audiences', label: 'Audiences',        emoji: '👥' },
  { id: 'landing',   label: 'Landing pages',    emoji: '🌐' },
]

interface Props { result: AuditResult }

export default function AuditTabs({ result }: Props) {
  const [active, setActive] = useState<AuditModule>('campaign')
  const activeModule = result.modules.find(m => m.module === active)!
  const activeIssues = result.issues.filter(i => i.module === active)
  return (
    <div>
      <div className="flex overflow-x-auto gap-1 pb-1 mb-4">
        {TABS.map(t => {
          const mod = result.modules.find(m => m.module === t.id)!
          return (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${active === t.id ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <span>{t.emoji}</span><span>{t.label}</span>
              <span className={`text-xs font-semibold ml-1 ${active === t.id ? 'text-blue-100' : scoreColor(mod.score)}`}>{mod.score}</span>
            </button>
          )
        })}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{activeModule.label}</h3>
          <p className="text-sm text-gray-500">{activeModule.issueCount} issue{activeModule.issueCount !== 1 ? 's' : ''} found · {activeModule.passCount} checks passed</p>
        </div>
        <div className={`text-2xl font-bold ${scoreColor(activeModule.score)}`}>
          {activeModule.score}<span className="text-sm font-normal text-gray-400">/100</span>
        </div>
      </div>
      {activeIssues.length > 0 ? (
        <div className="flex flex-col gap-2">
          {activeIssues.sort((a, b) => ({ critical:0, high:1, medium:2, low:3 }[a.severity] - { critical:0, high:1, medium:2, low:3 }[b.severity])).map(issue => <IssueCard key={issue.id} issue={issue} />)}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600 text-sm py-4">
          <CheckCircle2 size={18} />No issues found — all checks passed!
        </div>
      )}
      {activeModule.passCount > 0 && (
        <div className="mt-4 border border-green-100 bg-green-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1"><CheckCircle2 size={12} /> {activeModule.passCount} checks passed</p>
          <div className="flex flex-col gap-1">
            {getPassingChecks(active, activeModule.passCount).map((check, i) => (<p key={i} className="text-xs text-green-700">✓ {check}</p>))}
          </div>
        </div>
      )}
    </div>
  )
}

function getPassingChecks(module: AuditModule, count: number): string[] {
  const checks: Record<AuditModule, string[]> = {
    campaign:  ['Budget pacing on track','All campaigns have enabled ad groups','Geo-targeting set','Campaign end dates OK','Device bid adjustments configured','No campaigns paused unexpectedly'],
    keywords:  ['No bids exceeding budget','All ad groups have 3+ keywords','Long-tail keywords present','Match type mix includes exact'],
    ads:       ['All ads approved','Headlines contain keywords','Display URLs customised','Descriptions include CTA','No disapproved ads'],
    bidding:   ['Automated bidding on top campaigns','No $0 bids','Bid adjustments applied','No extreme overbidding','Portfolio strategies reviewed'],
    tracking:  ['Primary conversion verified','Conversion tag on key pages','Enhanced conversions enabled'],
    audiences: ['In-market audiences on display','Similar audiences created','Audience exclusions set','Demographics reviewed','Life events tested','Custom intent audiences configured'],
    landing:   ['All URLs 200 status','HTTPS on all URLs','Mobile-responsive','Contact info above fold','Page titles match ads','Privacy policy linked','Fast FCP on desktop'],
  }
  return (checks[module] || []).slice(0, count)
}
