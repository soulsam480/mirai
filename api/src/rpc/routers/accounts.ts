import { TRPCError } from '@trpc/server'
// import { createStudentSchema } from 'pages/admin/student/manage/[[...id]]';
import { createRouter } from 'rpc/createRouter'
import { z } from 'zod'
import { createInstituteSchema } from '@mirai/app'

export const accountRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (ctx.user == null || ctx.user.user.role !== 'ADMIN')
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })

    const nextCtx = await next({
      ctx: { ...ctx, user: ctx.user },
    })

    return nextCtx
  })
  .mutation('create_institute', {
    input: createInstituteSchema,
    async resolve({ ctx, input }) {
      const isDupId = await ctx.prisma.institute.findFirst({ where: { code: input.code }, select: { id: true } })

      if (isDupId != null) {
        throw new TRPCError({
          message: 'Duplicate Institute code',
          code: 'BAD_REQUEST',
        })
      }

      const institute = await ctx.prisma.institute.create({
        data: input,
      })

      return institute
    },
  })
  .mutation('update_institute', {
    input: createInstituteSchema.merge(z.object({ instituteId: z.number() })),
    async resolve({ ctx, input }) {
      const { instituteId, ...data } = input
      await ctx.prisma.institute.update({
        where: { id: instituteId },
        data,
      })
    },
  })
// .mutation('create_student', {
//   input: createStudentSchema,
//   async resolve({ ctx, input }) {
//     const student = await ctx.prisma.student.create({
//       data: input,
//     });

//     return student;
//   },
// });
