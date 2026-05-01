import { useState } from 'react'
import { AlertTriangle, X, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Assessment } from '@/types/assessment'

interface ReminderBannerProps {
  assessments: Assessment[]
}

function getDaysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const hours = diff / (1000 * 60 * 60)
  if (hours < 24) return 'today'
  return 'tomorrow'
}

const TYPE_COLORS: Record<string, string> = {
  exam: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  quiz: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  assignment: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  test: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

export function ReminderBanner({ assessments }: ReminderBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = assessments.filter((a) => !dismissed.has(a._id))
  if (visible.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {visible.map((assessment) => (
        <div
          key={assessment._id}
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 shadow-lg"
        >
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 truncate">
                {assessment.title}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[assessment.assessment_type] ?? TYPE_COLORS.other}`}>
                {assessment.assessment_type}
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due {getDaysUntil(assessment.due_date)} —{' '}
              {new Date(assessment.due_date).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {assessment.description && (
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 line-clamp-2">
                {assessment.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setDismissed((prev) => new Set([...prev, assessment._id]))}
            className="text-amber-400 hover:text-amber-600 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
