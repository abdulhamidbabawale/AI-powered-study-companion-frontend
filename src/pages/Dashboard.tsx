import { useNavigate } from 'react-router-dom'
import { MessageSquare, FileText, Plus, Upload, Clock, ClipboardList, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboard } from '@/hooks/useDashboard'
import { useAssessments } from '@/hooks/useAssessments'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, chats, materials, isLoading } = useDashboard()
  const { assessments, upcoming, isLoading: isLoadingAssessments } = useAssessments()
  const pendingAssessments = assessments.filter((a) => !a.is_completed)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{user ? `, ${user.first_name}` : ''}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with your studies.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-3xl font-bold">{chats.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Materials</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-3xl font-bold">{materials.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assessments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAssessments ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-3xl font-bold">{pendingAssessments.length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/chat/new')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        <Button variant="outline" onClick={() => navigate('/chat/new?tab=upload')}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Material
        </Button>
        <Button variant="outline" onClick={() => navigate('/assessments')}>
          <ClipboardList className="mr-2 h-4 w-4" />
          Assessments
        </Button>
      </div>

      {/* Upcoming Reminders */}
      {upcoming.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              {upcoming.length} assessment{upcoming.length > 1 ? 's' : ''} due within 2 days
            </p>
          </div>
          {upcoming.map((a) => (
            <div key={a._id} className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="font-medium">{a.title}</span>
              <span className="text-amber-500">·</span>
              <span>{new Date(a.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Chats */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Chats</h2>
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No chats yet.</p>
                <p className="text-xs text-muted-foreground">Start a new chat to begin.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {chats.slice(0, 5).map((chat) => (
                <Card
                  key={chat._id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/chat/${chat._id}`)}
                >
                  <CardContent className="flex items-center gap-3 py-3 px-4">
                    <MessageSquare className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(chat.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Materials */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Materials</h2>
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : materials.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No materials uploaded yet.</p>
                <p className="text-xs text-muted-foreground">Upload a .pptx file to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {materials.slice(0, 5).map((material) => (
                <Card key={material.material_id}>
                  <CardContent className="flex items-center gap-3 py-3 px-4">
                    <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{material.filename}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(material.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
