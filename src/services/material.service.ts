import api from '@/api/client'
import type { Material, UploadMaterialResponse } from '@/types/material'

export const uploadMaterial = async (file: File): Promise<UploadMaterialResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/materials/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getUserMaterials = async (): Promise<Material[]> => {
  const { data } = await api.get('/materials/user/all')
  return Array.isArray(data) ? data : (data.materials ?? data.data ?? [])
}

export const getMaterial = async (material_id: string): Promise<Material> => {
  const { data } = await api.get(`/materials/${material_id}`)
  return data
}
