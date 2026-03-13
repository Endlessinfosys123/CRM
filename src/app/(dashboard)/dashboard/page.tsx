import { createClient } from '@/utils/supabase/server'
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  
  // Total Leads
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  // Followups Today
  const today = new Date().toISOString().split('T')[0]
  const { count: followupsToday } = await supabase
    .from('followups')
    .select('*', { count: 'exact', head: true })
    .eq('scheduled_date', today)
    .eq('status', 'pending')

  // Closed Leads
  const { count: closedLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Closed')

  // Pending Leads
  const { count: pendingLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .in('status', ['New', 'Followup', 'Proposal'])

  return {
    totalLeads: totalLeads || 0,
    followupsToday: followupsToday || 0,
    closedLeads: closedLeads || 0,
    pendingLeads: pendingLeads || 0
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const statCards = [
    { name: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Followups Today', value: stats.followupsToday, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Closed Leads', value: stats.closedLeads, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Pending Leads', value: stats.pendingLeads, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-3 rounded-xl"}>
                <stat.icon className={stat.color + " h-6 w-6"} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                +12%
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.name}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Chart Placeholder */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Lead Inflow</h3>
            <select className="bg-slate-950 border border-slate-800 text-xs text-slate-400 rounded-lg px-2 py-1 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
            Lead Chart Data will appear here
          </div>
        </div>

        {/* Sync Status / Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">System Health</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="text-blue-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Google Sheet Sync</p>
                <p className="text-xs text-slate-500 mt-1">Automatic sync is enabled.</p>
                <div className="mt-2 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[85%]" />
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-emerald-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Database Status</p>
                <p className="text-xs text-slate-500 mt-1">Supabase Postgres is operational.</p>
                <p className="text-[10px] text-emerald-500 mt-2 font-mono">LATENCY: 42ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
