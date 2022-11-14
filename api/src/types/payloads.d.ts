import { generateOnboardingUrlSchema } from '@mirai/schema'
import { z } from 'zod'

export interface LoginPayload {
  email: string
  password: string
}

export interface OnboardingPayload extends z.infer<typeof generateOnboardingUrlSchema> {
  createdAt: string
}
export interface NotificationPayload {
  id: number
  ts: number
}
