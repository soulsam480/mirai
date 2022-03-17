import { createRouter } from 'server/createRouter';
import { z } from 'zod';

export const departmentRouter = createRouter()
  .mutation('create', {
    input: z.object({}),
    resolve() {
      //
    },
  })
  .mutation('update', {
    input: z.object({}),
    async resolve() {
      //
    },
  })
  .query('getAll', {
    input: z.number(),
    async resolve() {
      // findMany()
    },
  })
  .query('get', {
    input: z.number(),
    async resolve() {
      // findFirst()
    },
  });
