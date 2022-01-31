import { createRouter } from 'server/createRouter';
import { z } from 'zod';

/**
 * create department
 * create courses
 * create batches
 */

const cerateDepartmentSchema = z.object({
  name: z.string(),
  inCharge: z.string().optional(),
  instituteId: z.number(),
});

export const instituteRouter = createRouter();
