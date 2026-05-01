import { useQuery } from '@tanstack/react-query'
import { getUserChats } from '@/services/chat.service'
import { getUserMaterials } from '@/services/material.service'
import { getUserId } from '@/lib/auth'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null') as {
      first_name: string
      last_name: string
      email: string
    } | null
  } catch {
    return null
  }
}

export const useDashboard = () => {
  const userId = getUserId()
  const user = getStoredUser()

  const chatsQuery = useQuery({
    queryKey: ['chats'],
    queryFn: getUserChats,
  })

  const materialsQuery = useQuery({
    queryKey: ['materials'],
    queryFn: getUserMaterials,
  })

  return {
    user,
    userId,
    chats: chatsQuery.data ?? [],
    materials: materialsQuery.data ?? [],
    isLoading: chatsQuery.isLoading || materialsQuery.isLoading,
    isError: chatsQuery.isError || materialsQuery.isError,
  }
}
