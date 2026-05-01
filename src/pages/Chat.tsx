import { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Layers, AlignLeft, Upload } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useStudyTools } from '@/hooks/useStudyTools'
import { MessageList } from '@/components/chat/MessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { UploadPanel } from '@/components/chat/UploadPanel'
import { FlashcardsPanel } from '@/components/chat/FlashcardsPanel'
import { SummaryPanel } from '@/components/chat/SummaryPanel'

const ChatPage = () => {
  const { chatId: paramChatId } = useParams<{ chatId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') ?? 'upload'

  const resolvedInitialId = paramChatId === 'new' ? undefined : paramChatId

  const { chatId, setChatId, chatTitle, messages, send, isSending, isLoadingHistory } = useChat(resolvedInitialId)

  const {
    upload,
    isUploading,
    uploadedMaterialId,
    isProcessing,
    materialTitle,
    flashcards,
    summary,
  } = useStudyTools(chatId, (newChatId) => {
    setChatId(newChatId)
    navigate(`/chat/${newChatId}`, { replace: true })
  })

  // Sync URL if chat_id appears on an existing "new" route (shouldn't happen anymore but kept as safety)
  useEffect(() => {
    if (chatId && paramChatId === 'new') {
      navigate(`/chat/${chatId}`, { replace: true })
    }
  }, [chatId, paramChatId, navigate])

  const hasMaterial = !!chatId
  const disabledReason = !hasMaterial
    ? 'Upload a material first to start asking questions'
    : isProcessing
    ? 'Material is still processing, please wait…'
    : undefined

  return (
    <div className="-m-6 flex overflow-hidden" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* Left panel: Chat */}
      <div className="flex flex-col flex-1 min-w-0 border-r border-border">
        {/* Chat header */}
        <div className="flex items-center h-14 px-4 border-b border-border shrink-0">
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground truncate">
              {chatTitle ?? materialTitle ?? (resolvedInitialId ? 'Chat' : 'New Chat')}
            </h2>
          </div>
        </div>

        {/* Messages */}
        <MessageList
          messages={messages}
          isLoadingHistory={isLoadingHistory}
          isSending={isSending}
        />

        {/* Input */}
        <ChatInput onSend={send} isSending={isSending} disabledReason={disabledReason} />
      </div>

      {/* Right panel: Study Tools */}
      <div className="w-96 flex flex-col shrink-0">
        <div className="flex items-center h-14 px-4 border-b border-border shrink-0">
          <h2 className="font-semibold text-foreground">Study Tools</h2>
        </div>

        <Tabs defaultValue={defaultTab} className="flex flex-col flex-1 min-h-0">
          <TabsList className="mx-4 mt-3 shrink-0">
            <TabsTrigger value="upload" className="flex-1 gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex-1 gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex-1 gap-1.5">
              <AlignLeft className="h-3.5 w-3.5" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-1 overflow-y-auto mt-0">
            <UploadPanel
              onUpload={upload}
              isUploading={isUploading}
              uploadedMaterialId={uploadedMaterialId}
              isProcessing={isProcessing}
              materialTitle={materialTitle}
            />
          </TabsContent>

          <TabsContent value="flashcards" className="flex flex-col flex-1 min-h-0 mt-0">
            <FlashcardsPanel
              flashcards={flashcards}
              isGenerating={isProcessing}
            />
          </TabsContent>

          <TabsContent value="summary" className="flex flex-col flex-1 min-h-0 mt-0">
            <SummaryPanel
              summary={summary}
              isGenerating={isProcessing}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ChatPage
