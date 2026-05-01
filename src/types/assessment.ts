export type AssessmentType = 'exam' | 'quiz' | 'assignment' | 'test' | 'other'

export type Assessment = {
  _id: string
  user_id: string
  title: string
  assessment_type: AssessmentType
  due_date: string
  description: string | null
  reminder_date: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

export type AssessmentsResponse = {
  data: Assessment[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

export type CreateAssessmentPayload = {
  title: string
  assessment_type: AssessmentType
  due_date: string
  description?: string
  reminder_date?: string
}

export type UpdateAssessmentPayload = Partial<CreateAssessmentPayload>
