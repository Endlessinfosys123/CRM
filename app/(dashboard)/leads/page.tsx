import { createClient } from '@/utils/supabase/server'
import LeadsTable from '@/components/LeadsTable'
import { Plus, Download, RefreshCcw } from 'lucide-react'

import SyncButton from '@/components/SyncButton'

async function getLeads() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('leads')
    .select(`
      *,
      profiles:assigned_to (
        display_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  // If not admin, only show assigned leads
  if (profile?.role !== 'admin') {
    query = query.eq('assigned_to', user.id)
  }

  const { data: leads } = await query

  return leads || []
}

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Leads Management</h1>
          <p className="text-slate-400">View and manage your potential clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncButton />
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all text-sm font-medium shadow-lg shadow-blue-900/20">
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}
