import { trpc } from '../trpc'
import { batchRouter } from './batch'
import { accountRouter } from './accounts'
import { authRouter } from './auth'
import { courseRouter } from './course'
import { departmentRouter } from './department'
import { instituteRouter } from './institute'
import { studentRouter } from './student'
import { ticketRouter } from './ticket'
import { notificationRouter } from './notifications'

export const appRouter = trpc.router({
  account: accountRouter,
  auth: authRouter,
  institute: instituteRouter,
  department: departmentRouter,
  course: courseRouter,
  batch: batchRouter,
  student: studentRouter,
  ticket: ticketRouter,
  notification: notificationRouter,
})

export type AppRouter = typeof appRouter
