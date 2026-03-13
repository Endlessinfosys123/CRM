'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  Instagram,
  Phone,
  User as UserIcon,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function LeadsTable({ leads }: { leads: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.instagram_id?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'Followup': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'Proposal': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'Closed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'Lost': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between bg-slate-900/50 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search name, contact, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-sm text-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Followup">Followup</option>
            <option value="Proposal">Proposal</option>
            <option value="Closed">Closed</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sr. No</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-400">#{lead.sr_no || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{lead.client_name}</span>
                    {lead.instagram_id && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                        <Instagram className="h-3 w-3" />
                        {lead.instagram_id}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    {lead.contact}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(lead.status)
                  )}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                      <UserIcon className="h-3 w-3 text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-400">
                      {lead.profiles?.display_name || 'Unassigned'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 text-center">
          <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white">No leads found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center bg-slate-900/50">
        Showing {filteredLeads.length} of {leads.length} leads
        <div className="flex gap-1">
          <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}
