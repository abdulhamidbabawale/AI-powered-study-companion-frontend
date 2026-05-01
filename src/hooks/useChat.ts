import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getChatHistory } from '@/services/chat.service'
import { askQuestion } from '@/services/ai.service'
import type { Message } from '@/types/chat'

export const useChat = (initialChatId?: string) => {
  const [chatId, setChatId] = useState<string | undefined>(initialChatId)
  const queryClient = useQueryClient()

  useEffect(() => {
    setChatId(initialChatId)
  }, [initialChatId])

  const historyQuery = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatHistory(chatId!),
    enabled: !!chatId,
  })

  const messages: Message[] = historyQuery.data?.messages ?? []
  const chatTitle: string | null = historyQuery.data?.title ?? null

  const sendMutation = useMutation({
    mutationFn: ({ message }: { message: string }) =>
      askQuestion(chatId!, message),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['chat', chatId],
        (old: { _id: string; title: string; messages: Message[] } | undefined) => ({
          ...old,
          messages: [
            ...(old?.messages ?? []),
            { role: 'user' as const, content: variables.message },
            { role: 'model' as const, content: data.answer },
          ],
        })
      )
    },
  })

  return {
    chatId,
    setChatId,
    chatTitle,
    messages,
    isLoadingHistory: historyQuery.isLoading,
    send: (message: string) => sendMutation.mutate({ message }),
    isSending: sendMutation.isPending,
    sendError: sendMutation.error,
  }
}
