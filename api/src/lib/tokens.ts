import * as jsonwebtoken from 'jsonwebtoken'
import type { SessionUser } from '../rpc/context'
import type { OnboardingPayload } from '../types'
import { getEnv } from './helpers'

export const onBoardingTokens = {
  encode(value: OnboardingPayload) {
    return jsonwebtoken.sign(value, getEnv('ONBOARDING_SECRET') as string, { expiresIn: '3d' })
  },
  decode(value: string) {
    return jsonwebtoken.verify(value, getEnv('ONBOARDING_SECRET') as string) as OnboardingPayload
  },
}

export const authToken = {
  encode(session: SessionUser) {
    return jsonwebtoken.sign(session, getEnv('ACCESS_TOKEN_SECRET') as string, { expiresIn: '15m' })
  },
  decode(token: string) {
    return jsonwebtoken.verify(token, getEnv('ACCESS_TOKEN_SECRET') as string) as SessionUser
  },
}
