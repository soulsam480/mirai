import { z } from 'zod'
import { createRouter } from '../../createRouter'

export const experienceRouter = createRouter().query('get', {
  input: z.number(),
  async resolve({ ctx, input }) {
    const experienceData = ctx.prisma.studentWorkExperience.findFirst({
      where: { studentId: input },
    })

    return experienceData
  },
})
