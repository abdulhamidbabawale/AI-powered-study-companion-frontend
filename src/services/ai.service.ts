import api from '@/api/client'
import type { FlashcardResponse, SummaryResponse } from '@/types/flashcard'

export const getFlashcards = async (chat_id: string): Promise<FlashcardResponse> => {
  const { data } = await api.get(`/ai/flashcards/${chat_id}`)
  return data
}

export const getSummary = async (chat_id: string): Promise<SummaryResponse> => {
  const { data } = await api.get(`/ai/summary/${chat_id}`)
  return data
}

export const askQuestion = async (chat_id: string, question: string): Promise<{ answer: string }> => {
  const { data } = await api.post(`/ai/ask/${chat_id}`, { question })
  return data
}
