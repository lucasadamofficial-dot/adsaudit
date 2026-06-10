import { MOCK_AUDIT } from '@/lib/mock-data'
import { scoreColor, formatUSD } from '@/lib/audit-engine'
import AuditTabs from '@/components/AuditTabs'
import ScoreHistory from '@/components/ScoreHistory'
import Navbar from '@/components/Navbar'
import { AlertTriangle, Download, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const result = MOCK_AUDIT
  const criticalCount = result.issues.filter(i => i.severity === 'critical').length
  const highCount = result.issues.filter(i => i.severity === 'high').length
  const totalSaving = result.issues.reduce((s, i) => s + (i.estimatedSaving || 0), 0)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{result.accountName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Last audit: {new Date(result.runAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              <span className="ml-2 bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded-full border border-yellow-100 font-medium">Demo</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-700"><RefreshCw size={14} /> Re-run audit</button>
            <button className="flex items-center gap-2 text-sm bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700"><Download size={14} /> Export PDF</button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Audit score</p>
            <p className={`text-3xl font-bold ${scoreColor(result.overallScore)}`}>{result.overallScore}<span className="text-base font-normal text-gray-400">/100</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Wasted spend</p>
            <p className="text-3xl font-bold text-red-600">{formatUSD(totalSaving)}</p>
            <p className="text-xs text-gray-400 mt-0.5">est. monthly</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Issues found</p>
            <p className="text-3xl font-bold text-gray-900">{result.issuesFound}</p>
            <p className="text-xs text-red-500 mt-0.5">{criticalCount} critical · {highCount} high</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Avg QS</p>
            <p className="text-3xl font-bold text-orange-500">5.8<span className="text-base font-normal text-gray-400">/10</span></p>
            <p className="text-xs text-gray-400 mt-0.5">industry avg: 7.0</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Audit score over time</h2>
            <ScoreHistory data={result.scoreHistory} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Module scores</h2>
            <div className="flex flex-col gap-3">
              {result.modules.map(m => (
                <div key={m.module}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{m.label}</span>
                    <span className={`text-xs font-semibold ${scoreColor(m.score)}`}>{m.score}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${m.score}%`, background: m.score >= 80 ? '#16a34a' : m.score >= 60 ? '#d97706' : '#dc2626' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {criticalCount > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-red-600" />
              <h2 className="text-sm font-semibold text-red-800">Critical issues — fix these first</h2>
            </div>
            <div className="flex flex-col gap-2">
              {result.issues.filter(i => i.severity === 'critical').map(i => (
                <div key={i.id} className="flex items-start gap-2 text-sm text-red-700"><span className="mt-0.5 shrink-0">→</span><span>{i.title}</span></div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Detailed audit — all modules</h2>
          <AuditTabs result={result} />
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-blue-900 text-sm">Save this audit to Google Sheets</h3>
            <p className="text-sm text-blue-700 mt-0.5">All issues, scores, and fixes written to your spreadsheet automatically.</p>
          </div>
          <button className="shrink-0 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Connect Google Sheets</button>
        </div>
      </div>
    </div>
  )
}
