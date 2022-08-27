import { atomWithReset } from 'jotai/utils'
import { ticketListingInput } from '../schemas'
import { z } from 'zod'

type TicketFilterQuery = Omit<z.infer<typeof ticketListingInput>, 'instituteId'>

export const ticketFiltersAtom = atomWithReset<TicketFilterQuery>({
  createdAt: { type: 'gte', value: '' },
  sort: 'desc',
})
ticketFiltersAtom.debugLabel = 'ticketFiltersAtom'
