import { adminMiddleware, instituteMiddleware, sessionMiddleware } from './middlewares'
import { trpc } from './trpc'

export const procedureWithSession = trpc.procedure.use(sessionMiddleware)
export const procedureWithInstitute = trpc.procedure.use(instituteMiddleware)
export const procedureWithStudent = trpc.procedure.use(sessionMiddleware)
export const procedureWithAdmin = trpc.procedure.use(sessionMiddleware).use(adminMiddleware)
