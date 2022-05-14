import { AppLayout } from 'components/globals/AppLayout'
import { MBadge } from 'components/lib/MBadge'
import { Column, MTable } from 'components/lib/MTable'
import { TicketFiltersBlock } from 'components/tickets/filters'
import { ListingSettings } from 'components/tickets/ListingSettings'
import { TicketWithMeta, useTickets } from 'contexts/useTicket'
import { useResetAtom } from 'jotai/utils'
import { NextPageWithLayout } from 'pages/_app'
import { useEffect, useMemo } from 'react'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { formatDate, titleCase } from 'utils/helpers'
import { trpcClient } from 'utils/trpc'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

function getStatusColor(status: TicketWithMeta['status']) {
  switch (status) {
    case 'OPEN':
      return 'badge-info'

    case 'INPROGRESS':
      return 'badge-warning'

    case 'CLOSED':
      return 'badge-error'

    case 'RESOLVED':
      return 'badge-success'
  }
}

const TicketListing: NextPageWithLayout = () => {
  const { tickets, isLoading } = useTickets()
  const setFilters = useResetAtom(ticketFiltersAtom)

  const columns = useMemo<Array<Column<TicketWithMeta>>>(
    () => [
      {
        field: 'id',
        label: 'ID',
      },
      {
        field: 'meta.type',
        label: 'Ticket type',
        format: (ticket) => <>{titleCase(ticket.meta.type)}</>,
      },
      {
        field: 'status',
        label: 'Status',
        format: (ticket) => <MBadge className={getStatusColor(ticket.status)}>{titleCase(ticket.status)}</MBadge>,
      },
      {
        field: 'createdAt',
        label: 'Created at',
        format: (ticket) => <>{formatDate(ticket.createdAt, 'DD MMM YYYY')}</>,
      },
      {
        field: 'closedAt',
        label: 'Closed at',
        format: (ticket) => <>{ticket.closedAt === null ? '-' : formatDate(ticket.closedAt, 'DD MMM YYYY')}</>,
      },
      {
        field: 'closedBy',
        label: 'Closed by',
        format: (ticket) => <>{ticket.closedBy === null ? '-' : ticket.closedBy}</>,
      },
      {
        field: 'action',
        label: 'Action',
        format: ({ id }) => (
          <button
            className="btn btn-xs"
            onClick={() => {
              trpcClient.mutation('ticket.resolve', { id, status: 'RESOLVED' })
            }}
          >
            Resolve
          </button>
        ),
      },
    ],
    [],
  )

  useEffect(() => {
    return () => {
      void setFilters()
    }
  }, [setFilters])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between pb-2">
        <div className="text-xl font-medium">Tickets</div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm">Filter tickets</div>
        <TicketFiltersBlock />
      </div>

      <MTable
        className="mt-4"
        columns={columns}
        rows={tickets}
        compact
        noDataLabel={'No tickets were found !'}
        loading={isLoading}
        settingsSlot={<ListingSettings />}
      />
    </div>
  )
}

TicketListing.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default TicketListing
