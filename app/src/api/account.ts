import { tourSchema } from '../schemas'
import { trpcClient } from '../utils/trpc'
import { z } from 'zod'

export function toggleTour(opts: z.infer<typeof tourSchema>) {
  return trpcClient.mutation('account.toggle_tour', opts)
}
