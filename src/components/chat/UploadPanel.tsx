import { useRef, useState } from 'react'
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UploadPanelProps {
  onUpload: (file: File) => void
  isUploading: boolean
  uploadedMaterialId: string | null
  isProcessing: boolean
  materialTitle: string | null
}

export function UploadPanel({
  onUpload,
  isUploading,
  uploadedMaterialId,
  isProcessing,
  materialTitle,
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (file: File | null) => {
    if (!file) return
    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.pptx')) handleFileChange(file)
  }

  return (
    <div className="p-4 space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pptx"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center',
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
            : 'border-border hover:border-indigo-400 hover:bg-muted/50'
        )}
      >
        <div className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 p-3">
          <Upload className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Drop your file here</p>
          <p className="text-xs text-muted-foreground mt-0.5">or click to browse</p>
        </div>
        <p className="text-xs text-muted-foreground">PowerPoint (.pptx) only</p>
      </div>

      {/* Selected file — ready to upload */}
      {selectedFile && !uploadedMaterialId && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
          <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onUpload(selectedFile)}
            disabled={isUploading}
            className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
          >
            {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Upload'}
          </Button>
        </div>
      )}

      {/* Processing state */}
      {uploadedMaterialId && isProcessing && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-800">
          <Loader2 className="h-4 w-4 text-indigo-500 shrink-0 animate-spin" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              Generating summary & flashcards…
            </p>
            <p className="text-xs text-indigo-500 truncate">
              {materialTitle ?? 'Processing your file'}
            </p>
          </div>
        </div>
      )}

      {/* Done state */}
      {uploadedMaterialId && !isProcessing && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 dark:text-green-400">Ready</p>
            <p className="text-xs text-green-600 dark:text-green-500 truncate">
              {materialTitle ?? 'Material processed'} — check the other tabs
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
