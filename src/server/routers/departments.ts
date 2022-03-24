import { TRPCError } from '@trpc/server'
import { createRouter } from 'server/createRouter'
import { createDepartmentSchema } from 'components/department/ManageDepartment'
import { z } from 'zod'

export const departmentRouter = createRouter()
  .mutation('create', {
    input: createDepartmentSchema,
    async resolve({ ctx, input }) {
      const department = await ctx.prisma.department.create({
        data: input,
      })

      return department
    },
  })
  .mutation('update', {
    input: createDepartmentSchema.extend({ id: z.number() }),
    async resolve({ ctx, input }) {
      const { id, ...data } = input

      await ctx.prisma.department.update({
        where: { id },
        data,
      })
    },
  })
  .query('getAll', {
    input: z.number(),
    async resolve({ ctx, input }) {
      const departments = await ctx.prisma.department.findMany({ where: { instituteId: input } })

      return departments
    },
  })
  .query('get', {
    input: z.object({
      instituteId: z.number(),
      departmentId: z.number(),
    }),
    async resolve({ ctx, input }) {
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
    },
  })
