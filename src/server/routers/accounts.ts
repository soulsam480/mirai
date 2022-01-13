import { createRouter } from 'server/createRouter';
import { z } from 'zod';

export const accountRouter = createRouter()
  .mutation('create_institute', {
    input: z.object({
      code: z.string(),
      name: z.string(),
      status: z.enum(['ONBOARDED', 'INPROGRESS', 'PENDING']),
      logo: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const institute = await ctx.prisma.institute.create({
        data: input,
      });

      return institute;
    },
  })
  .mutation('create_student', {
    input: z.object({
      code: z.string(),
      batchId: z.number(),
      instituteId: z.number(),
      accountId: z.number(),
      name: z.string(),
      dob: z.string(),
      gender: z.string(),
      category: z.string(),
      mobile_number: z.string(),
      primary_email: z.string(),
      secondary_email: z.string().optional(),
      permanent_address: z.string(),
      current_address: z.string(),
    }),
    async resolve({ ctx, input }) {
      const student = await ctx.prisma.student.create({
        data: input,
      });

      return student;
    },
  });
