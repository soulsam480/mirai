import { generateOnboardingUrlSchema } from '@mirai/app'
import { z } from 'zod'

export interface LoginPayload {
  email: string
  password: string
}

export interface OnboardingPayload extends z.infer<typeof generateOnboardingUrlSchema> {
  createdAt: string
}
