import { useState } from 'react'
import { Layers } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Flashcard } from '@/types/flashcard'

interface FlashcardsPanelProps {
  flashcards: Flashcard[]
  isGenerating: boolean
}

function FlipCard({ flashcard, index }: { flashcard: Flashcard; index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="h-32 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border border-border bg-card p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs text-muted-foreground">#{index + 1} — click to reveal</span>
          <p className="text-sm font-medium text-foreground text-center">{flashcard.question}</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-800 p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs text-indigo-400">Answer</span>
          <p className="text-sm text-foreground text-center">{flashcard.answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FlashcardsPanel({ flashcards, isGenerating }: FlashcardsPanelProps) {
  if (isGenerating) {
    return (
      <div className="p-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-4">
        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 p-4">
          <Layers className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">No flashcards yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload a material and generate flashcards from the Upload tab.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground">{flashcards.length} cards — click to flip</p>
        {flashcards.map((card, i) => (
          <FlipCard key={i} flashcard={card} index={i} />
        ))}
      </div>
    </div>
  )
}
