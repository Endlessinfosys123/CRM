'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Instagram, Phone, User as UserIcon, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ColumnProps {
  title: string
  leads: any[]
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: string) => void
  onDragStart: (e: React.DragEvent, lead: any) => void
}

function Column({ title, leads, onDragOver, onDrop, onDragStart }: ColumnProps) {
  return (
    <div 
      className="flex flex-col w-80 bg-slate-900/50 border border-slate-800 rounded-2xl h-full"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-sm rounded-t-2xl z-20">
        <h3 className="font-bold text-white flex items-center gap-2">
          {title}
          <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg text-xs">{leads.length}</span>
        </h3>
        <button className="text-slate-500 hover:text-white">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {leads.map((lead) => (
          <motion.div
            key={lead.id}
            layoutId={lead.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              draggable
              onDragStart={(e) => onDragStart(e, lead)}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm cursor-move hover:border-blue-500/50 hover:bg-slate-800/50 transition-colors group"
            >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">#{lead.sr_no || 'N/A'}</span>
              <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-opacity">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <Link href={`/leads/${lead.id}`} className="block">
              <h4 className="font-bold text-white text-sm mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                {lead.client_name}
              </h4>
            </Link>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Instagram className="h-3 w-3" />
                <span className="line-clamp-1">{lead.instagram_id || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone className="h-3 w-3" />
                <span>{lead.contact}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <UserIcon className="h-3 w-3 text-slate-500" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Clock className="h-3 w-3" />
                {new Date(lead.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </div>
            </div>
              </div>
          </motion.div>
        ))}
        {leads.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-700 text-sm italic">
            Empty Stage
          </div>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ initialData, stages }: { initialData: any, stages: string[] }) {
  const [data, setData] = useState(initialData)
  const router = useRouter()
  const supabase = createClient()

  const onDragStart = (e: React.DragEvent, lead: any) => {
    e.dataTransfer.setData('leadId', lead.id)
    e.dataTransfer.setData('originalStatus', lead.status)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = async (e: React.DragEvent, newStatus: string) => {
    const leadId = e.dataTransfer.getData('leadId')
    const originalStatus = e.dataTransfer.getData('originalStatus')

    if (originalStatus === newStatus) return

    // Optimistic Update
    const newData = { ...data }
    const leadToMove = newData[originalStatus].find((l: any) => l.id === leadId)
    
    if (leadToMove) {
      newData[originalStatus] = newData[originalStatus].filter((l: any) => l.id !== leadId)
      const updatedLead = { ...leadToMove, status: newStatus }
      newData[newStatus] = [updatedLead, ...newData[newStatus]]
      setData(newData)

      // Persistence
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)

      if (error) {
        // Rollback on error
        setData(initialData)
        alert('Failed to update lead status. Please try again.')
      } else {
        router.refresh()
      }
    }
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 h-full custom-scrollbar">
      <AnimatePresence>
        {stages.map((stage) => (
          <Column
            key={stage}
            title={stage}
            leads={data[stage]}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
