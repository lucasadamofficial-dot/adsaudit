'use client'

import { useRef, useState } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { parseGoogleAdsCSV, type ParseResult } from '@/lib/csv-parser'

interface Props {
  onParsed: (result: ParseResult) => void
  onDismiss?: () => void
}

const REPORT_LABELS: Record<string, string> = {
  campaign:    '📊 Campaign Performance Report',
  keyword:     '🔑 Keywords Report',
  search_term: '🔍 Search Terms Report',
  ad:          '📝 Ad Performance Report',
  unknown:     '📄 Unknown Report Type',
}

export default function CSVUpload({ onParsed, onDismiss }: Props) {
  const [dragging, setDragging]   = useState(false)
  const [parsing,  setParsing]    = useState(false)
  const [error,    setError]      = useState<string | null>(null)
  const [preview,  setPreview]    = useState<ParseResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function processFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file downloaded from Google Ads.')
      return
    }
    setParsing(true)
    setError(null)
    setPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = parseGoogleAdsCSV(text)
        setPreview(parsed)
      } catch (err) {
        setError("Could not parse this CSV. Make sure it's a Google Ads export.")
      } finally {
        setParsing(false)
      }
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
          }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900">Upload Google Ads CSV</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit your real account data — no API key needed
          </p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Drop zone */}
      {!preview && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleChange}
          />
          {parsing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Parsing CSV…</p>
            </div>
          ) : (
            <>
              <Upload size={28} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">
                Drop your Google Ads CSV here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: Campaigns · Keywords · Search Terms reports
              </p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Preview after parsing */}
      {preview && (
        <div className="mt-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
            <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800">
                {REPORT_LABELS[preview.reportType]}
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                {preview.rowCount} rows · {preview.result.issues?.length ?? 0} issues found ·
                Account: {preview.accountName}
              </p>
            </div>
            <button
              onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = '' }}
              className="text-green-500 hover:text-green-700 shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onParsed(preview)}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Run audit on this data →
            </button>
            <button
              onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = '' }}
              className="px-4 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Change file
            </button>
          </div>
        </div>
      )}

      {/* How to download hint */}
      {!preview && !parsing && (
        <details className="mt-4 text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700 font-medium">
            How to download a CSV from Google Ads
          </summary>
          <ol className="mt-2 space-y-1 pl-4 list-decimal">
            <li>Sign in at <strong>ads.google.com</strong></li>
            <li>Go to <strong>Campaigns</strong>, <strong>Keywords</strong>, or <strong>Reports → Search Terms</strong></li>
            <li>Set your date range (Last 30 days recommended)</li>
            <li>Click the <strong>Download</strong> icon → <strong>CSV</strong></li>
            <li>Upload the downloaded file here</li>
          </ol>
        </details>
      )}
    </div>
  )
                }
