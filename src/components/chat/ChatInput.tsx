import { useState, useRef, type KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  onSend: (message: string) => void
  isSending: boolean
  disabledReason?: string
}

export function ChatInput({ onSend, isSending, disabledReason }: ChatInputProps) {
  const isDisabled = isSending || !!disabledReason
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isDisabled) return
    onSend(trimmed)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
  }

  return (
    <div className="border-t border-border p-4 shrink-0">
      {disabledReason && (
        <p className="text-xs text-muted-foreground text-center mb-2">{disabledReason}</p>
      )}
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabledReason ?? 'Ask anything... (Enter to send, Shift+Enter for new line)'}
          rows={1}
          className="flex-1 resize-none min-h-10 max-h-32 overflow-y-auto"
          disabled={isDisabled}
        />
        <Button
          onClick={handleSend}
          disabled={isDisabled || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 h-10 w-10 p-0 shrink-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
