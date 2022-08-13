import { FastifyPluginAsync } from 'fastify'
import miraiClient from '../db'
import { comparePassword } from '../lib'
import { LoginPayload } from '../types/payloads'

const router: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.post<{ Body: LoginPayload }>('/', async ({ body }, reply) => {
    const { email, password } = body

    const user = await miraiClient.account.findFirst({
      where: { email },
      select: { password: true, role: true, id: true },
    })

    if (user === null || user.password === null || user.password?.length === 0)
      return await reply.status(404).send('No account was found with the email')

    const isSamePassword = await comparePassword(password, user.password)

    if (!isSamePassword) return await reply.status(400).send('Email or password is incorrect !')

    return {
      email,
      role: user.role,
      id: user.id,
    }
  })
}

export default router
export const autoPrefix = '/auth'
