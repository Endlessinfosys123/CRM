import { createClient } from '@/utils/supabase/server'
import KanbanBoard from '@/components/KanbanBoard'

const STAGES = ['New', 'Followup', 'Proposal', 'Closed', 'Lost']

async function getLeadsByStage() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('updated_at', { ascending: false })

  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = leads?.filter(l => l.status === stage) || []
    return acc
  }, {} as Record<string, any[]>)

  return grouped
}

export default async function PipelinePage() {
  const initialData = await getLeadsByStage()

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Sales Pipeline</h1>
        <p className="text-slate-400">Track and manage your leads through different stages.</p>
      </div>

      <div className="flex-1 min-h-0">
        <KanbanBoard initialData={initialData} stages={STAGES} />
      </div>
    </div>
  )
}
