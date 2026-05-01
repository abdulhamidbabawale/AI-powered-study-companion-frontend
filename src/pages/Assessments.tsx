import { useState } from 'react'
import { Plus, CheckCircle2, Pencil, Trash2, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AssessmentForm } from '@/components/assessments/AssessmentForm'
import { useAssessments } from '@/hooks/useAssessments'
import type { Assessment, CreateAssessmentPayload } from '@/types/assessment'

const TYPE_COLORS: Record<string, string> = {
  exam: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200',
  quiz: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200',
  assignment: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200',
  test: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200',
}

function isDueSoon(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return diff >= 0 && diff <= 2 * 24 * 60 * 60 * 1000
}

function formatDueDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  const formatted = date.toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  if (diffMs < 0) return `Overdue · ${formatted}`
  if (diffDays === 0) return `Today · ${formatted}`
  if (diffDays === 1) return `Tomorrow · ${formatted}`
  return `In ${diffDays} days · ${formatted}`
}

function AssessmentCard({
  assessment,
  onComplete,
  onEdit,
  onDelete,
}: {
  assessment: Assessment
  onComplete: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const soon = isDueSoon(assessment.due_date) && !assessment.is_completed
  const overdue = new Date(assessment.due_date) < new Date() && !assessment.is_completed

  return (
    <Card className={`transition-opacity ${assessment.is_completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`text-sm font-semibold truncate ${assessment.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {assessment.title}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${TYPE_COLORS[assessment.assessment_type] ?? TYPE_COLORS.other}`}>
                {assessment.assessment_type}
              </span>
              {soon && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Due soon
                </span>
              )}
              {overdue && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200">
                  Overdue
                </span>
              )}
              {assessment.is_completed && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200">
                  Completed
                </span>
              )}
            </div>

            <p className={`text-xs mt-1 flex items-center gap-1 ${overdue && !assessment.is_completed ? 'text-red-500' : 'text-muted-foreground'}`}>
              <Clock className="h-3 w-3" />
              {formatDueDate(assessment.due_date)}
            </p>

            {assessment.description && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{assessment.description}</p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!assessment.is_completed && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={onComplete}>
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const Assessments = () => {
  const { assessments, isLoading, create, isCreating, update, isUpdating, complete, remove } = useAssessments()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Assessment | null>(null)

  const handleSubmit = (payload: CreateAssessmentPayload) => {
    if (editing) {
      update(editing._id, payload)
    } else {
      create(payload)
    }
    setFormOpen(false)
    setEditing(null)
  }

  const pending = assessments.filter((a) => !a.is_completed)
  const completed = assessments.filter((a) => a.is_completed)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assessments</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your upcoming tests, exams, and assignments.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              Upcoming <span className="text-muted-foreground font-normal">({pending.length})</span>
            </h2>
            {pending.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No upcoming assessments.</p>
                </CardContent>
              </Card>
            ) : (
              pending.map((a) => (
                <AssessmentCard
                  key={a._id}
                  assessment={a}
                  onComplete={() => complete(a._id)}
                  onEdit={() => { setEditing(a); setFormOpen(true) }}
                  onDelete={() => remove(a._id)}
                />
              ))
            )}
          </div>

          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Completed <span className="font-normal">({completed.length})</span>
              </h2>
              {completed.map((a) => (
                <AssessmentCard
                  key={a._id}
                  assessment={a}
                  onComplete={() => complete(a._id)}
                  onEdit={() => { setEditing(a); setFormOpen(true) }}
                  onDelete={() => remove(a._id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <AssessmentForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        initial={editing ?? undefined}
      />
    </div>
  )
}

export default Assessments
