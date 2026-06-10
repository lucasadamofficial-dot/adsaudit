'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import AuditTabs from '@/components/AuditTabs'
import ScoreHistory from '@/components/ScoreHistory'
import CSVUpload from '@/components/CSVUpload'
import { MOCK_AUDIT } from '@/lib/mock-data'
import { scoreColor, scoreLabel, formatUSD } from '@/lib/audit-engine'
import type { AuditResult } from '@/lib/mock-data'
import type { ParseResult } from '@/lib/csv-parser'
import { Upload, RefreshCw, FileText, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  const [audit, setAudit]           = useState<Partial<AuditResult>>(MOCK_AUDIT)
  const [isDemo, setIsDemo]         = useState(true)
  const [showUpload, setShowUpload] = useState(false)

  function handleParsed(parsed: ParseResult) {
    setAudit({ ...MOCK_AUDIT, ...parsed.result, accountName: parsed.accountName })
    setIsDemo(false)
    setShowUpload(false)
  }

  function resetToDemo() {
    setAudit(MOCK_AUDIT)
    setIsDemo(true)
    setShowUpload(false)
  }

  const issues        = audit.issues        ?? []
  const moduleScores  = (audit as AuditResult).modules ?? []
  const scoreHistory  = audit.scoreHistory  ?? []
  const overallScore  = audit.overallScore  ?? 0
  const wastedSpend   = issues.reduce((s, i) => s + (i.estimatedSaving ?? 0), 0)
  const criticalCount = issues.filter(i => i.severity === 'critical').length
  const highCount     = issues.filter(i => i.severity === 'high').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-900">{audit.accountName} — Google Ads</h1>
              {isDemo && (
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                  Demo — mock data
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Last audit: {new Date(audit.runAt ?? Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowUpload(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition-colors ${
                showUpload
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Upload size={14} />
              {showUpload ? 'Cancel' : 'Upload CSV'}
            </button>
            {!isDemo && (
              <button
                onClick={resetToDemo}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={14} />
                Demo
              </button>
            )}
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-xl hover:bg-blue-700 transition-colors">
              <FileText size={14} />
              Export PDF
            </button>
          </div>
        </div>

        {/* CSV Upload panel */}
        {showUpload && (
          <div className="mb-6">
            <CSVUpload onParsed={handleParsed} onDismiss={() => setShowUpload(false)} />
          </div>
        )}

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Audit score</p>
            <p className={`text-3xl font-bold ${scoreColor(overallScore)}`}>
              {overallScore}<span className="text-base font-normal text-gray-400">/100</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{scoreLabel(overallScore)}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Wasted spend</p>
            <p className="text-3xl font-bold text-red-600">{formatUSD(wastedSpend)}</p>
            <p className="text-xs text-gray-400 mt-0.5">est. monthly</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Issues found</p>
            <p className="text-3xl font-bold text-gray-900">{issues.length}</p>
            <p className="text-xs text-red-500 mt-0.5">{criticalCount} critical · {highCount} high</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Avg QS</p>
            <p className="text-3xl font-bold text-orange-500">5.8<span className="text-base font-normal text-gray-400">/10</span></p>
            <p className="text-xs text-gray-400 mt-0.5">industry avg: 7.0</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Audit score over time</h2>
            <ScoreHistory data={scoreHistory} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Module scores</h2>
            <div className="flex flex-col gap-3">
              {moduleScores.map(m => (
                <div key={m.module}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{m.label}</span>
                    <span className={`text-xs font-semibold ${scoreColor(m.score)}`}>{m.score}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${m.score}%`,
                        background: m.score >= 80 ? '#16a34a' : m.score >= 60 ? '#d97706' : '#dc2626',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {criticalCount > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-red-600" />
              <h2 className="text-sm font-semibold text-red-800">Critical issues — fix these first</h2>
            </div>
            <div className="flex flex-col gap-1.5">
              {issues.filter(i => i.severity === 'critical').map(i => (
                <div key={i.id} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-0.5 shrink-0">→</span>
                  <span>{i.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Detailed audit — all modules</h2>
          <AuditTabs result={MOCK_AUDIT} />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-blue-900 text-sm">Save this audit to Google Sheets</h3>
            <p className="text-sm text-blue-700 mt-0.5">All issues, scores, and fixes written to your connected spreadsheet automatically.</p>
          </div>
          <button className="shrink-0 text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            Connect Google Sheets →
          </button>
        </div>

      </div>
    </div>
  )
}
