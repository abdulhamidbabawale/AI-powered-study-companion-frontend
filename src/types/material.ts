import type { Flashcard } from './flashcard'

export type Material = {
  _id: string
  material_id?: string
  user_id: string
  chat_id: string
  title: string
  file_type: string
  summary: string | null
  flashcards: Flashcard[]
  processing_status: 'processing' | 'done' | 'error'
  processing_error: string | null
  created_at: string
  updated_at: string
}

export type UploadMaterialResponse = {
  material_id: string
  chat_id: string
  title: string
  processing_status: string
  message: string
}
