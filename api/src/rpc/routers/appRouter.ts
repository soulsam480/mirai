/**
 * This file contains the root router of your tRPC-backend
 */
import superjson from 'superjson'
import { createRouter } from '../createRouter'
import { accountRouter } from './accounts'
import { authRouter } from './auth'
import { courseRouter } from './course'
import { departmentRouter } from './departments'
import { instituteRouter } from './institute'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  .merge('account.', accountRouter)
  .merge('auth.', authRouter)
  .merge('institute.', instituteRouter)
  .merge('department.', departmentRouter)
  .merge('course.', courseRouter)

export type AppRouter = typeof appRouter
