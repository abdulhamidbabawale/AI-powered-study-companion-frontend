import { useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageBubble } from './MessageBubble'
import type { Message } from '@/types/chat'
import { MessageSquare } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  isLoadingHistory: boolean
  isSending: boolean
}

export function MessageList({ messages, isLoadingHistory, isSending }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  if (isLoadingHistory) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
              <Skeleton className={`h-12 rounded-2xl ${i % 2 === 0 ? 'w-64' : 'w-48'}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (messages.length === 0 && !isSending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 p-4">
          <MessageSquare className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Start the conversation</p>
          <p className="text-xs text-muted-foreground mt-1">Ask anything to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="px-4 py-4 space-y-4">
        {messages.map((message, i) => (
          <MessageBubble key={i} message={message} />
        ))}
        {isSending && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 rounded-full bg-indigo-100 shrink-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-indigo-600">AI</span>
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
