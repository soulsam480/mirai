import type { Account } from '@prisma/client'

export interface LoginResponse extends Pick<Account, 'email' | 'id' | 'role'> {}

export interface TicketResolveResponse {
  type: 'system' | 'duplicate'
  data: any
}
