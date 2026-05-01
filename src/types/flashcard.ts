export type Flashcard = {
  question: string
  answer: string
}

export type FlashcardResponse = {
  chat_id: string
  flashcards: Flashcard[]
}

export type SummaryResponse = {
  chat_id: string
  summary: string
}
