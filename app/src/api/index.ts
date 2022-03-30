import { LoginPayload, LoginResponse } from '@mirai/api'
import axios from 'axios'

export const apiBase = axios.create({
  baseURL: process.env.NEXT_API_BASE ?? 'http://localhost:4002/',
})

export async function authorizeUser(payload: LoginPayload) {
  return await apiBase.post<LoginResponse>('auth', payload)
}
