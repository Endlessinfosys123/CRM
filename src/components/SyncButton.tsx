'use client'

import { useState } from 'react'
import { RefreshCcw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function SyncButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSync = async () => {
    setStatus('loading')
    try {
      // Small delay to simulate sync or wait for webhook
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real scenario, we might call:
      // await fetch('/api/sync/trigger') 
      
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <button
      onClick={handleSync}
      disabled={status === 'loading'}
      className={cn(
        "flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-sm font-medium",
        status === 'idle' && "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800",
        status === 'loading' && "bg-blue-600/10 border-blue-600/20 text-blue-500 cursor-not-allowed",
        status === 'success' && "bg-emerald-600/10 border-emerald-600/20 text-emerald-500",
        status === 'error' && "bg-red-600/10 border-red-600/20 text-red-500"
      )}
    >
      {status === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status === 'success' ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : status === 'error' ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
      
      {status === 'loading' ? 'Syncing...' : status === 'success' ? 'Synced!' : status === 'error' ? 'Failed' : 'Sync Sheet'}
    </button>
  )
}
