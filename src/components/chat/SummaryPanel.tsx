import { Loader2, AlignLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface SummaryPanelProps {
  summary: string | null
  isGenerating: boolean
}

export function SummaryPanel({ summary, isGenerating }: SummaryPanelProps) {
  if (isGenerating) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating summary...
        </div>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className={`h-4 w-full rounded ${i === 3 ? 'w-2/3' : ''}`} />
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-4">
        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 p-4">
          <AlignLeft className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">No summary yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload a material and generate a summary from the Upload tab.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-4">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  )
}
