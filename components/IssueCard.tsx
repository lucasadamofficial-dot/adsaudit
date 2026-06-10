'use client'
  import { useState } from 'react'
    import { ChevronDown, ChevronUp, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'
    import type { AuditIssue } from '@/lib/mock-data'
    import { severityColor, severityLabel } from '@/lib/audit-engine'

    interface Props { issue: AuditIssue }

export default function IssueCard({ issue }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${severityColor(issue.severity)}`}>
{severityLabel(issue.severity)}
        </span>
        <span className="text-sm font-medium text-gray-900 flex-1">{issue.title}</span>
        <div className="flex items-center gap-3 shrink-0">
{issue.estimatedSaving && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-red-600 font-medium">
              <DollarSign size={12} />${issue.estimatedSaving.toLocaleString()} wasted
            </span>
          )}
{issue.estimatedCvrLift && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 font-medium">
              <TrendingUp size={12} />+{issue.estimatedCvrLift}% CVR
            </span>
          )}
{open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>
{open && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">{issue.description}</p>
          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1.5">
              <AlertTriangle size={12} />How to fix
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{issue.fix}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
{issue.affectedCount && (
              <span className="bg-white border border-gray-200 rounded-full px-2.5 py-1">
                Affects {issue.affectedCount} items
              </span>
            )}
{issue.estimatedSaving && (
              <span className="bg-red-50 border border-red-100 text-red-700 rounded-full px-2.5 py-1 font-medium">
                ~${issue.estimatedSaving.toLocaleString()} monthly savings
              </span>
            )}
{issue.estimatedCvrLift && (
              <span className="bg-green-50 border border-green-100 text-green-700 rounded-full px-2.5 py-1 font-medium">
                Estimated +{issue.estimatedCvrLift}% CVR lift
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
