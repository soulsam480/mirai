import { createInstituteSchema } from 'pages/admin/institute/manage/[[...id]]';
import { createRouter } from 'server/createRouter';
import { z } from 'zod';

export const accountRouter = createRouter()
  .mutation('create_institute', {
    input: createInstituteSchema,
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
      mobileNumber: z.string(),
      primaryEmail: z.string(),
      secondaryEmail: z.string().optional(),
      permanentAddress: z.string(),
      currentAddress: z.string(),
    }),
    async resolve({ ctx, input }) {
      const student = await ctx.prisma.student.create({
        data: input,
      });

      return student;
    },
  });
