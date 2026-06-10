import { NextRequest, NextResponse } from 'next/server'
import { ensureSheetHeaders, writeAuditToSheet } from '@/lib/sheets'
import { MOCK_AUDIT } from '@/lib/mock-data'

/** POST /api/sheets — initialise headers + write a test row */
export async function POST(req: NextRequest) {
    try {
          const sheetId = process.env.GOOGLE_SHEET_ID
          if (!sheetId) {
                  return NextResponse.json(
                            { success: false, error: 'GOOGLE_SHEET_ID not set in environment variables' },
                            { status: 400 }
                          )
                }

          await ensureSheetHeaders(sheetId)
          await writeAuditToSheet(MOCK_AUDIT)

          return NextResponse.json({
                  success: true,
                  message: 'Audit written to Google Sheets',
                  sheetId,
                })
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          return NextResponse.json({ success: false, error: message }, { status: 500 })
        }
  }
