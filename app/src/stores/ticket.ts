import { Ticket } from '@prisma/client'
import { atom } from 'jotai'

interface SelectedTicketType {
  id: number
  isChecked: boolean
}

export const selectedTickets = atom<SelectedTicketType[]>([])
selectedTickets.debugLabel = 'selectedTickets'

export const activeTicket = atom<Ticket | null>(null)
activeTicket.debugLabel = 'activeTicket'
