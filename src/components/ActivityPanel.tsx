'use client'

import { useState } from 'react'
import { 
  MessageSquare, 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle2, 
  User as UserIcon,
  Send,
  Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function ActivityPanel({ lead }: { lead: any }) {
  const [activeTab, setActiveTab] = useState<'activities' | 'followups'>('activities')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [followupDate, setFollowupDate] = useState('')
  const [followupNote, setFollowupNote] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase
      .from('activities')
      .insert({
        lead_id: lead.id,
        user_id: user.id,
        content: content.trim(),
        type: 'note'
      })

    if (!error) {
      setContent('')
      router.refresh()
    }
    setLoading(false)
  }

  const handleScheduleFollowup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!followupDate) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase
      .from('followups')
      .insert({
        lead_id: lead.id,
        user_id: user.id,
        scheduled_date: followupDate,
        note: followupNote.trim(),
        status: 'pending'
      })

    if (!error) {
      setFollowupDate('')
      setFollowupNote('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      <div className="p-4 border-b border-slate-800 flex gap-4">
        <button
          onClick={() => setActiveTab('activities')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-xl transition-all",
            activeTab === 'activities' 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
              : "text-slate-400 hover:text-white"
          )}
        >
          Activity Feed
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-xl transition-all",
            activeTab === 'followups' 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
              : "text-slate-400 hover:text-white"
          )}
        >
          Followups
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'activities' ? (
          <>
            <form onSubmit={handleAddActivity} className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a note or activity log..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none min-h-[100px]"
              />
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>

            <div className="space-y-6">
              {lead.activities?.map((activity: any) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{activity.profiles?.display_name || 'User'}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {new Date(activity.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 bg-slate-950 border border-slate-800/50 p-3 rounded-xl rounded-tl-none">
                      {activity.content}
                    </p>
                  </div>
                </div>
              ))}
              {(!lead.activities || lead.activities.length === 0) && (
                <div className="text-center py-12 text-slate-600">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-10" />
                  <p>No activities yet.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleScheduleFollowup} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white">Schedule New Followup</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Date</label>
                  <input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Note</label>
                <textarea
                  value={followupNote}
                  onChange={(e) => setFollowupNote(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !followupDate}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Schedule Followup
              </button>
            </form>

            <div className="space-y-4">
              {lead.followups?.map((followup: any) => (
                <div key={followup.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                      followup.status === 'completed' 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                        : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                    )}>
                      {followup.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{new Date(followup.scheduled_date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{followup.note || 'No note'}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    followup.status === 'completed' ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                  )}>
                    {followup.status}
                  </span>
                </div>
              ))}
              {(!lead.followups || lead.followups.length === 0) && (
                <div className="text-center py-12 text-slate-600">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-10" />
                  <p>No followups scheduled.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
