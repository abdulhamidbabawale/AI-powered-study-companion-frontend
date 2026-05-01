import api from '@/api/client'
import type { ChatResponse, ChatHistory, ChatSummary } from '@/types/chat'

export const startNewChat = async (message: string): Promise<ChatResponse> => {
  const { data } = await api.post('/ai/chat', { message })
  return data
}

export const continueChat = async (chat_id: string, message: string): Promise<ChatResponse> => {
  const { data } = await api.post(`/ai/ask/${chat_id}`, { message })
  return data
}

export const getChatHistory = async (chat_id: string): Promise<ChatHistory> => {
  const { data } = await api.get(`/ai/chat/${chat_id}`)
  return data
}

export const getUserChats = async (): Promise<ChatSummary[]> => {
  const { data } = await api.get('/ai/chats')
  return Array.isArray(data) ? data : (data.chats ?? data.data ?? [])
}
