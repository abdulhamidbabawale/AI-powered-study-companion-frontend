import api from '@/api/client'
import type {
  Assessment,
  AssessmentsResponse,
  CreateAssessmentPayload,
  UpdateAssessmentPayload,
} from '@/types/assessment'

export const getAssessments = async (page = 1, limit = 50): Promise<AssessmentsResponse> => {
  const { data } = await api.get('/assessments/', { params: { page, limit } })
  return data
}

export const getAssessment = async (id: string): Promise<Assessment> => {
  const { data } = await api.get(`/assessments/${id}`)
  return data
}

export const createAssessment = async (payload: CreateAssessmentPayload): Promise<Assessment> => {
  const { data } = await api.post('/assessments/', payload)
  return data
}

export const updateAssessment = async (id: string, payload: UpdateAssessmentPayload): Promise<Assessment> => {
  const { data } = await api.patch(`/assessments/${id}`, payload)
  return data
}

export const completeAssessment = async (id: string): Promise<Assessment> => {
  const { data } = await api.patch(`/assessments/${id}/complete`)
  return data
}

export const deleteAssessment = async (id: string): Promise<void> => {
  await api.delete(`/assessments/${id}`)
}
