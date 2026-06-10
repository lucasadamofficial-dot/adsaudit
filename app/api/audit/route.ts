import { NextResponse } from 'next/server'
import { MOCK_AUDIT } from '@/lib/mock-data'
import { writeAuditToSheet } from '@/lib/sheets'

export async function POST() {
    try {
          const result = { ...MOCK_AUDIT, runAt: new Date().toISOString() }
          if (
                  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
                  process.env.GOOGLE_PRIVATE_KEY &&
                  process.env.GOOGLE_SHEET_ID
                ) {
                  await writeAuditToSheet(result)
                }
          return NextResponse.json({ success: true, result })
        } catch (err) {
          console.error('Audit error:', err)
          return NextResponse.json({ success: false, error: 'Audit failed' }, { status: 500 })
        }
  }

export async function GET() {
    return NextResponse.json({ result: MOCK_AUDIT })
  }
