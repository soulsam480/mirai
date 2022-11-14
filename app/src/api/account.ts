import { tourSchema } from '@mirai/schema'
import { trpcClient } from '../utils/trpc'
import { z } from 'zod'

export function toggleTour(opts: z.infer<typeof tourSchema>) {
  return trpcClient.mutation('account.toggle_tour', opts)
}
