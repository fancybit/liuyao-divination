import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!url) {
    return NextResponse.json({ ok: false, error: 'SUPABASE_URL not set' })
  }

  const supabase = createClient(url, serviceKey || anonKey)

  // Try to execute migration via REST API (DDL via direct SQL)
  const sql = `ALTER TABLE divination_records ADD COLUMN IF NOT EXISTS interpretation_en TEXT;`

  try {
    // Use direct SQL via Supabase Management API
    const projectRef = url.match(/https:\/\/([^.]+)/)?.[1] || ''
    
    const mgmtResp = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    })

    const mgmtData = await mgmtResp.json().catch(() => mgmtResp.text())
    
    return NextResponse.json({
      ok: mgmtResp.ok,
      status: mgmtResp.status,
      data: mgmtData,
      projectRef,
      hasServiceKey: !!serviceKey,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message })
  }
}