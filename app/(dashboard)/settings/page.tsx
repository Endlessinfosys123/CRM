import { createClient } from '@/utils/supabase/server'
import { 
  User as UserIcon, 
  Shield, 
  History, 
  Settings as SettingsIcon,
  Database,
  RefreshCcw,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import SyncButton from '@/components/SyncButton'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

async function getSettingsData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  let syncLogs = []
  if (profile?.role === 'admin') {
    const { data } = await supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    syncLogs = data || []
  }

  return { profile, user, syncLogs }
}

export default async function SettingsPage() {
  const data = await getSettingsData()
  if (!data) return null

  const { profile, user, syncLogs } = data

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your profile and system preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-blue-500" />
            Personal Profile
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl text-white font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">{profile?.display_name || 'Set your name'}</h4>
              <p className="text-slate-500">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Shield className="h-3 w-3" />
                Role: {profile?.role || 'User'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
              <input 
                type="text" 
                defaultValue={profile?.display_name || ''} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email (Primary)</label>
              <input 
                type="email" 
                value={user.email || ''} 
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all font-medium text-sm shadow-lg shadow-blue-900/20">
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>

      {/* Admin Section: Sync Logs */}
      {profile?.role === 'admin' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="h-5 w-5 text-amber-500" />
              Sync History
            </h3>
            <SyncButton />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/30">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Count</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {syncLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        log.status === 'success' 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {log.status === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {log.synced_count} leads
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 italic">
                      {log.error || 'Normal sync cycle'}
                    </td>
                  </tr>
                ))}
                {syncLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-600 text-sm">
                      No sync history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Database Status */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <Database className="h-6 w-6 text-slate-500" />
          </div>
          <div>
            <h4 className="text-white font-bold">Persistence Layer</h4>
            <p className="text-xs text-slate-500">Connected to Supabase Postgres (Vercel Edge Ready)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Operational
          </div>
        </div>
      </div>
    </div>
  )
}
