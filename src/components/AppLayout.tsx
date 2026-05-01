// src/components/AppLayout.tsx
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from './AppSidebar'
import { ReminderBanner } from './assessments/ReminderBanner'
import { useAssessments } from '@/hooks/useAssessments'
import { Outlet } from 'react-router-dom'

function ReminderMount() {
  const { upcoming } = useAssessments()
  return <ReminderBanner assessments={upcoming} />
}

export default function AppLayout() {
  return (
    <TooltipProvider>
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center h-14 px-4 border-b border-gray-200">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
      <ReminderMount />
    </SidebarProvider>
    </TooltipProvider>
  )
}