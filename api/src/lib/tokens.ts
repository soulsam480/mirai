import * as jsonwebtoken from 'jsonwebtoken'

interface OnboardingPayload {
  instituteId: number
  name: string
  createdAt: string
}

export const onBoardingTokens = {
  encode(value: OnboardingPayload) {
    return jsonwebtoken.sign(value, process.env.ONBOARDING_SECRET, { expiresIn: '3d' })
  },
  decode(value: string) {
    return jsonwebtoken.verify(value, process.env.ONBOARDING_SECRET) as OnboardingPayload
  },
}
