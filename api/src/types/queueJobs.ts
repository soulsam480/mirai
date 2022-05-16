import type { TicketStatus } from '@prisma/client'
export interface TicketJob {
  id: number
  status: TicketStatus
  notes?: string
}
