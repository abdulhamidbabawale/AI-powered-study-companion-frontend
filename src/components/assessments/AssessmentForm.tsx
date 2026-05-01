import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { Assessment, AssessmentType, CreateAssessmentPayload } from '@/types/assessment'

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
  assessment_type: Yup.string().required('Type is required'),
  due_date: Yup.string().required('Due date is required'),
  description: Yup.string(),
  reminder_date: Yup.string(),
})

interface AssessmentFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: CreateAssessmentPayload) => void
  isSubmitting: boolean
  initial?: Assessment
}

const TYPES: AssessmentType[] = ['exam', 'quiz', 'assignment', 'test', 'other']

// Convert ISO string to datetime-local input value
const toInputValue = (iso?: string | null) => {
  if (!iso) return ''
  return iso.slice(0, 16)
}

export function AssessmentForm({ open, onClose, onSubmit, isSubmitting, initial }: AssessmentFormProps) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initial?.title ?? '',
      assessment_type: initial?.assessment_type ?? 'exam',
      due_date: toInputValue(initial?.due_date),
      description: initial?.description ?? '',
      reminder_date: toInputValue(initial?.reminder_date),
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmit({
        title: values.title,
        assessment_type: values.assessment_type as AssessmentType,
        due_date: new Date(values.due_date).toISOString(),
        ...(values.description ? { description: values.description } : {}),
        ...(values.reminder_date
          ? { reminder_date: new Date(values.reminder_date).toISOString() }
          : {}),
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { formik.resetForm(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Assessment' : 'New Assessment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="e.g. Biology Final Exam"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-destructive">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={formik.values.assessment_type}
              onValueChange={(v) => formik.setFieldValue('assessment_type', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="datetime-local"
              name="due_date"
              value={formik.values.due_date}
              onChange={formik.handleChange}
            />
            {formik.touched.due_date && formik.errors.due_date && (
              <p className="text-xs text-destructive">{formik.errors.due_date}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Reminder Date <span className="text-muted-foreground font-normal">(optional)</span></label>
            <Input
              type="datetime-local"
              name="reminder_date"
              value={formik.values.reminder_date}
              onChange={formik.handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="e.g. Covers chapters 1-8"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { formik.resetForm(); onClose() }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initial ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
