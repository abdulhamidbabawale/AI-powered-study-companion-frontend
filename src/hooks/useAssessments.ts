import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAssessments,
  createAssessment,
  updateAssessment,
  completeAssessment,
  deleteAssessment,
} from '@/services/assessment.service'
import type { CreateAssessmentPayload, UpdateAssessmentPayload } from '@/types/assessment'

const QK = ['assessments']

export const useAssessments = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QK,
    queryFn: () => getAssessments(),
  })

  const assessments = query.data?.data ?? []

  // Assessments due within 2 days (not completed)
  const now = new Date()
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000
  const upcoming = assessments.filter((a) => {
    if (a.is_completed) return false
    const diff = new Date(a.due_date).getTime() - now.getTime()
    return diff >= 0 && diff <= twoDaysMs
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateAssessmentPayload) => createAssessment(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAssessmentPayload }) =>
      updateAssessment(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK }),
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => completeAssessment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAssessment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK }),
  })

  return {
    assessments,
    upcoming,
    isLoading: query.isLoading,
    create: (payload: CreateAssessmentPayload) => createMutation.mutate(payload),
    isCreating: createMutation.isPending,
    update: (id: string, payload: UpdateAssessmentPayload) => updateMutation.mutate({ id, payload }),
    isUpdating: updateMutation.isPending,
    complete: (id: string) => completeMutation.mutate(id),
    remove: (id: string) => deleteMutation.mutate(id),
  }
}
