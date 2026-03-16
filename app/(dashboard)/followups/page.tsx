import { createClient } from '@/utils/supabase/server'
import FollowupsTable from '@/components/FollowupsTable'
import { Calendar, Filter } from 'lucide-react'

async function getFollowups() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('followups')
    .select(`
      *,
      leads (
        client_name,
        contact,
        status
      ),
      profiles:user_id (display_name)
    `)
    .order('scheduled_date', { ascending: true })

  if (profile?.role !== 'admin') {
    query = query.eq('user_id', user.id)
  }

  const { data: followups } = await query
  return followups || []
}

export default async function FollowupsPage() {
  const followups = await getFollowups()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">My Followups</h1>
          <p className="text-slate-400">Keep track of your scheduled interactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 transition-all text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <FollowupsTable initialFollowups={followups} />
      </div>
    </div>
  )
}
