import { Ticket } from '@prisma/client'
import { atom } from 'jotai'

export const selectedTicketsAtom = atom<Ticket[]>([])
selectedTicketsAtom.debugLabel = 'selectedTickets'

//  a separate immutable copy/snapshot of selected tickets
// which can be used to run validations
export const selectedTicketsSnapshotAtom = atom<Ticket[]>([])
selectedTicketsSnapshotAtom.debugLabel = 'selectedTicketsSnapshotAtom'

export const selectedTicketsSetAtom = atom<null, (p: Ticket[]) => Ticket[]>(null, (get, set, update) => {
  const base = update(get(selectedTicketsAtom))

  set(selectedTicketsAtom, base)
  set(selectedTicketsSnapshotAtom, base)
})
selectedTicketsSetAtom.debugLabel = 'selectedTicketsSetAtom'

export const activeTicketAtom = atom<number>(0)
activeTicketAtom.debugLabel = 'activeTicket'
