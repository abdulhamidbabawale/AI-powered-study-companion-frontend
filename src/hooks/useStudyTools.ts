import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { uploadMaterial, getMaterial } from '@/services/material.service'
import { getFlashcards, getSummary } from '@/services/ai.service'
import type { Flashcard } from '@/types/flashcard'

export const useStudyTools = (existingChatId?: string, onUploaded?: (chatId: string) => void) => {
  const queryClient = useQueryClient()
  const [uploadedMaterialId, setUploadedMaterialId] = useState<string | null>(null)
  const [uploadedChatId, setUploadedChatId] = useState<string | null>(null)

  // --- New upload flow: poll material by material_id ---
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadMaterial(file),
    onSuccess: (data) => {
      setUploadedMaterialId(data.material_id)
      setUploadedChatId(data.chat_id)
      onUploaded?.(data.chat_id)
      queryClient.invalidateQueries({ queryKey: ['materials'] })
    },
  })

  const materialQuery = useQuery({
    queryKey: ['material', uploadedMaterialId],
    queryFn: () => getMaterial(uploadedMaterialId!),
    enabled: !!uploadedMaterialId,
    refetchInterval: (query) =>
      query.state.data?.processing_status === 'done' ? false : 3000,
  })

  const isProcessing =
    !!uploadedMaterialId && materialQuery.data?.processing_status !== 'done'

  // --- Existing chat flow: fetch by chat_id from AI endpoints ---
  const flashcardsQuery = useQuery({
    queryKey: ['flashcards', existingChatId],
    queryFn: () => getFlashcards(existingChatId!),
    enabled: !!existingChatId && !uploadedMaterialId,
  })

  const summaryQuery = useQuery({
    queryKey: ['summary', existingChatId],
    queryFn: () => getSummary(existingChatId!),
    enabled: !!existingChatId && !uploadedMaterialId,
  })

  // Prefer freshly uploaded material data, fall back to fetched data
  const flashcards: Flashcard[] =
    materialQuery.data?.flashcards ??
    flashcardsQuery.data?.flashcards ??
    []

  const summary: string | null =
    materialQuery.data?.summary ??
    summaryQuery.data?.summary ??
    null

  return {
    uploadedMaterialId,
    uploadedChatId,
    materialTitle: materialQuery.data?.title ?? null,
    upload: (file: File) => uploadMutation.mutate(file),
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,

    isProcessing,
    flashcards,
    summary,
  }
}
