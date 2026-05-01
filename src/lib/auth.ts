export const getUserId = (): string => {
  const token = localStorage.getItem('token') ?? ''
  if (!token) return ''
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub ?? payload.user_id ?? ''
  } catch {
    return ''
  }
}
