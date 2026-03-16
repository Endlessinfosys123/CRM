import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, 
  Instagram, 
  Phone, 
  Mail, 
  Calendar, 
  User as UserIcon,
  Tag,
  Clock,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import ActivityPanel from '@/components/ActivityPanel'

async function getLead(id: string) {
  const supabase = await createClient()
  
  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      profiles:assigned_to (
        display_name,
        email
      ),
      activities (
        *,
        profiles:user_id (display_name)
      ),
      followups (*)
    `)
    .eq('id', id)
    .single()

  return lead
}

export default async function LeadDetailsPage({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id)

  if (!lead) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link 
        href="/leads" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leads
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Col: Lead Info */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                <UserIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{lead.client_name}</h1>
                <p className="text-sm text-slate-500">Lead ID: #{lead.sr_no || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Instagram className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Instagram</p>
                  <p className="text-white">{lead.instagram_id || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Contact</p>
                  <p className="text-white">{lead.contact}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Current Status</p>
                  <span className="text-blue-500 font-medium">{lead.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-4">Lead Details</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Goal of Client</p>
                  <p className="text-sm text-white">{lead.goal || 'No goal specified'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                    <p className="text-sm text-white">{lead.profiles?.display_name || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Created At</p>
                    <p className="text-sm text-white">{new Date(lead.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Activities & Followups */}
        <div className="lg:flex-1 space-y-6">
          <ActivityPanel lead={lead} />
        </div>
      </div>
    </div>
  )
}
