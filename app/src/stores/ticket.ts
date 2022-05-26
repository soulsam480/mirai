import { Ticket } from '@prisma/client'
import { atom } from 'jotai'

export const selectedTicketsAtom = atom<Ticket[]>([])
selectedTicketsAtom.debugLabel = 'selectedTickets'

export const activeTicketAtom = atom<number>(0)
activeTicketAtom.debugLabel = 'activeTicket'
