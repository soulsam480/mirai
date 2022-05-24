import { atom } from 'jotai'

export const selectedTicketsAtom = atom<number[]>([])
selectedTicketsAtom.debugLabel = 'selectedTickets'

export const activeTicket = atom<number>(0)
activeTicket.debugLabel = 'activeTicket'
