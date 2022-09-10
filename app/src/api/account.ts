import { tourSchema } from '../schemas'
import { trpcClient } from '../utils/trpc'
import { z } from 'zod'

export async function toggleTour(opts: z.infer<typeof tourSchema>) {
  return await trpcClient.account.toggle_tour.mutate(opts)
}
