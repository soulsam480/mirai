import { TRPCError } from '@trpc/server'
import { createRouter } from '../createRouter'
import { createDepartmentSchema } from '@mirai/app'
import { z } from 'zod'
import { isInstituteRole } from '../../lib'

export const departmentRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.user == null || !isInstituteRole(ctx.user.user.role).is) throw new TRPCError({ code: 'UNAUTHORIZED' })

    return await next({
      // might seem dumb, but it's done like this to keep TS happy
      ctx: { ...ctx, user: ctx.user },
    })
  })
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
