/**
 * Google Sheets integration
  * Writes audit results to a Google Sheet with multiple tabs:
   *   - Audit_Results  (one row per run)
    *   - Issues         (one row per issue)
     *   - Score_History  (score over time)
      *
       * Env vars required:
        *   GOOGLE_SERVICE_ACCOUNT_EMAIL
         *   GOOGLE_PRIVATE_KEY          (newlines as \n)
          *   GOOGLE_SHEET_ID
           */

           import { google } from 'googleapis'
           import type { AuditResult } from './mock-data'

           function getAuth() {
             const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
               const key   = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
                 if (!email || !key) throw new Error('Missing Google Sheets credentials in env')
                   return new google.auth.JWT(email, undefined, key, [
                       'https://www.googleapis.com/auth/spreadsheets',
                         ])
                         }

                         export async function writeAuditToSheet(result: AuditResult): Promise<void> {
                           const sheetId = process.env.GOOGLE_SHEET_ID
                             if (!sheetId) throw new Error('GOOGLE_SHEET_ID not set')

                               const auth   = getAuth()
                                 const sheets = google.sheets({ version: 'v4', auth })

                                   await sheets.spreadsheets.values.append({
                                       spreadsheetId: sheetId,
                                           range: 'Audit_Results!A:G',
                                               valueInputOption: 'USER_ENTERED',
                                                   requestBody: {
                                                         values: [[
                                                                 result.runAt,
                                                                         result.accountId,
                                                                                 result.accountName,
                                                                                         result.overallScore,
                                                                                                 result.issuesFound,
                                                                                                         result.wastedSpend,
                                                                                                                 result.modules.map(m => `${m.label}: ${m.score}`).join(' | '),
                                                                                                                       ]],
                                                                                                                           },
                                                                                                                             })
                                                                                                                             
                                                                                                                               const issueRows = result.issues.map(i => [
                                                                                                                                   result.runAt,
                                                                                                                                       result.accountName,
                                                                                                                                           i.module,
                                                                                                                                               i.severity,
                                                                                                                                                   i.title,
                                                                                                                                                       i.description,
                                                                                                                                                           i.fix,
                                                                                                                                                               i.estimatedSaving  ? `$${i.estimatedSaving}` : '',
                                                                                                                                                                   i.estimatedCvrLift ? `+${i.estimatedCvrLift}% CVR` : '',
                                                                                                                                                                       i.affectedCount    ? i.affectedCount : '',
                                                                                                                                                                         ])
                                                                                                                                                                         
                                                                                                                                                                           await sheets.spreadsheets.values.append({
                                                                                                                                                                               spreadsheetId: sheetId,
                                                                                                                                                                                   range: 'Issues!A:J',
                                                                                                                                                                                       valueInputOption: 'USER_ENTERED',
                                                                                                                                                                                           requestBody: { values: issueRows },
                                                                                                                                                                                             })
                                                                                                                                                                                             
                                                                                                                                                                                               await sheets.spreadsheets.values.append({
                                                                                                                                                                                                   spreadsheetId: sheetId,
                                                                                                                                                                                                       range: 'Score_History!A:C',
                                                                                                                                                                                                           valueInputOption: 'USER_ENTERED',
                                                                                                                                                                                                               requestBody: {
                                                                                                                                                                                                                     values: [[result.runAt, result.accountName, result.overallScore]],
                                                                                                                                                                                                                         },
                                                                                                                                                                                                                           })
                                                                                                                                                                                                                           }
                                                                                                                                                                                                                           
                                                                                                                                                                                                                           /** Bootstrap the sheet with headers on first run */
                                                                                                                                                                                                                           export async function ensureSheetHeaders(sheetId: string): Promise<void> {
                                                                                                                                                                                                                             const auth   = getAuth()
                                                                                                                                                                                                                               const sheets = google.sheets({ version: 'v4', auth })
                                                                                                                                                                                                                               
                                                                                                                                                                                                                                 const headers: Record<string, string[][]> = {
                                                                                                                                                                                                                                     'Audit_Results!A1:G1': [['Run At', 'Account ID', 'Account Name', 'Score', 'Issues', 'Wasted Spend ($)', 'Module Scores']],
                                                                                                                                                                                                                                         'Issues!A1:J1':        [['Run At', 'Account', 'Module', 'Severity', 'Issue', 'Description', 'Fix', 'Saving', 'CVR Lift', 'Affected']],
                                                                                                                                                                                                                                             'Score_History!A1:C1': [['Run At', 'Account', 'Score']],
                                                                                                                                                                                                                                               }
                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                 for (const [range, values] of Object.entries(headers)) {
                                                                                                                                                                                                                                                     await sheets.spreadsheets.values.update({
                                                                                                                                                                                                                                                           spreadsheetId: sheetId,
                                                                                                                                                                                                                                                                 range,
                                                                                                                                                                                                                                                                       valueInputOption: 'USER_ENTERED',
                                                                                                                                                                                                                                                                             requestBody: { values },
                                                                                                                                                                                                                                                                                 })
                                                                                                                                                                                                                                                                                   }
                                                                                                                                                                                                                                                                                   }
