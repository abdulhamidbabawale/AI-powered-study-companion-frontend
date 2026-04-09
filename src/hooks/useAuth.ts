// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginService } from '../services/auth.service'

export const useLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/'

  return useMutation({
    mutationFn: LoginService,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      navigate(from, { replace: true })
    },
    onError: (error) => {
      console.error('Login failed', error)
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()

  return () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }
}