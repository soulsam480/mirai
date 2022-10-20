import type { Account } from '@prisma/client'

export interface LoginResponse extends Pick<Account, 'email' | 'id' | 'role'> {}

export interface TicketResolveResponse {
  id: number
  error: any
}
