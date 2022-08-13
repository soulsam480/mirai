import * as jsonwebtoken from 'jsonwebtoken'
import type { SessionUser } from '../rpc/context'
import { OnboardingPayload } from '../types'

export const onBoardingTokens = {
  encode(value: OnboardingPayload) {
    return jsonwebtoken.sign(value, process.env.ONBOARDING_SECRET, { expiresIn: '3d' })
  },
  decode(value: string) {
    return jsonwebtoken.verify(value, process.env.ONBOARDING_SECRET) as OnboardingPayload
  },
}

export const authToken = {
  encode(session: SessionUser) {
    return jsonwebtoken.sign(session, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
  },
  decode(token: string) {
    return jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET) as SessionUser
  },
}
