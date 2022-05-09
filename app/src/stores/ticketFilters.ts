import { atomWithReset } from 'jotai/utils'
import { ticketFiltersSchema } from 'schemas'
import { z } from 'zod'

type TicketFilterQuery = Omit<z.infer<typeof ticketFiltersSchema>, 'instituteId'>

export const ticketFiltersAtom = atomWithReset<TicketFilterQuery>({})
ticketFiltersAtom.debugLabel = 'ticketFiltersAtom'
