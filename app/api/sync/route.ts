import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use service role key for backend sync as it needs to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization')
    const secret = authHeader?.replace('Bearer ', '')

    if (secret !== process.env.SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    // Mapping Google Sheet columns to Database fields
    // Sheet: [SR. NO., CLIENT'S NAME, INSTAGRAM ID, CONTACT NUMBER/MAIL ID, CALL BY MY SIDE, REVERT, PROPOSAL, REVERT AFTER PROPOSAL, GOAL OF CLIENT]
    
    const leadsToUpsert = data.map((item: any) => ({
      sr_no: item['SR. NO.'],
      client_name: item["CLIENT'S NAME"],
      instagram_id: item['INSTAGRAM ID'],
      contact: item['CONTACT NUMBER/MAIL ID'],
      call_by: item['CALL BY MY SIDE'],
      revert: item['REVERT'],
      proposal: item['PROPOSAL'],
      revert_after_proposal: item['REVERT AFTER PROPOSAL'],
      goal: item['GOAL OF CLIENT'],
      updated_at: new Date().toISOString()
    }))

    const { data: upsertedData, error } = await supabaseAdmin
      .from('leads')
      .upsert(leadsToUpsert, { 
        onConflict: 'contact',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      await supabaseAdmin.from('sync_logs').insert({
        status: 'error',
        error: error.message,
        synced_count: 0
      })
      throw error
    }

    // Log success
    await supabaseAdmin.from('sync_logs').insert({
      status: 'success',
      synced_count: leadsToUpsert.length
    })

    return NextResponse.json({ 
      success: true, 
      count: leadsToUpsert.length,
      message: 'Sync completed successfully'
    })

  } catch (error: any) {
    console.error('Sync Error:', error)
    return NextResponse.json({ 
      error: 'Sync failed', 
      details: error.message 
    }, { status: 500 })
  }
}
