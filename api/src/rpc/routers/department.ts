import { TRPCError } from '@trpc/server'
import { trpc } from '../trpc'
import { createDepartmentSchema } from '@mirai/app'
import { z } from 'zod'
import { procedureWithInstitute } from '../procedures'

export const departmentRouter = trpc.router({
  create: procedureWithInstitute.input(createDepartmentSchema).mutation(async ({ ctx, input }) => {
    const department = await ctx.prisma.department.create({
      data: input,
    })

    return department
  }),

  update: procedureWithInstitute
    .input(createDepartmentSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      await ctx.prisma.department.update({
        where: { id },
        data,
      })
    }),

  getAll: procedureWithInstitute.input(z.number()).query(async ({ ctx, input }) => {
    const departments = await ctx.prisma.department.findMany({ where: { instituteId: input } })

    return departments
  }),

  get: procedureWithInstitute
    .input(
      z.object({
        instituteId: z.number(),
        departmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const department = await ctx.prisma.department.findFirst({
        where: { id: input.departmentId, instituteId: input.instituteId },
      })

      if (department === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Department not found !',
        })
      }

      return department
    }),
})
