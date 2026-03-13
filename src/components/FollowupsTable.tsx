'use client'

import { useState } from 'react'
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Phone, 
  Calendar,
  MoreVertical,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function FollowupsTable({ initialFollowups }: { initialFollowups: any[] }) {
  const [followups, setFollowups] = useState(initialFollowups)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const toggleStatus = async (id: string, currentStatus: string) => {
    setLoading(id)
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'

    const { error } = await supabase
      .from('followups')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setFollowups(followups.map(f => f.id === id ? { ...f, status: newStatus } : f))
      router.refresh()
    }
    setLoading(null)
  }

  const isOverdue = (date: string, status: string) => {
    if (status !== 'pending') return false
    const today = new Date().setHours(0, 0, 0, 0)
    const d = new Date(date).setHours(0, 0, 0, 0)
    return d < today
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/30">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task / Note</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {followups.map((followup) => {
            const overdue = isOverdue(followup.scheduled_date, followup.status)
            return (
              <tr key={followup.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(followup.id, followup.status)}
                    disabled={loading === followup.id}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                      followup.status === 'completed' 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                    )}
                  >
                    {loading === followup.id ? (
                      <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    ) : followup.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    {followup.status.toUpperCase()}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-sm font-semibold",
                      overdue ? "text-red-500" : "text-white"
                    )}>
                      {new Date(followup.scheduled_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {overdue && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="h-3 w-3" /> Overdue
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{followup.leads?.client_name}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" /> {followup.leads?.contact}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-400 line-clamp-2 max-w-md">
                    {followup.note || 'No description provided'}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/leads/${followup.lead_id}`}
                    className="inline-flex items-center gap-2 p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all text-xs font-medium"
                  >
                    View Lead
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {followups.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 text-center">
          <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white">No followups scheduled</h3>
          <p className="text-slate-500 text-sm mt-1">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}
