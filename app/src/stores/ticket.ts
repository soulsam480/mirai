import { atom } from 'jotai'

export interface SelectedTicketType {
  id: number
  isChecked: boolean
}

export const selectedTickets = atom<SelectedTicketType[]>([])
selectedTickets.debugLabel = 'selectedTickets'

export const activeTicket = atom<number>(0)
activeTicket.debugLabel = 'activeTicket'
