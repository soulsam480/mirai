import { Ticket } from '@prisma/client'
import { AppLayout } from 'components/globals/AppLayout'
import ManageTickets from 'components/institute/ticket/ManageTickets'
import { MBadge } from 'components/lib/MBadge'
import { MDialog } from 'components/lib/MDialog'
import { Column, MTable } from 'components/lib/MTable'
import { TicketFiltersBlock } from 'components/tickets/filters'
import { ListingSettings } from 'components/tickets/ListingSettings'
import { TicketWithMeta, useTickets } from 'contexts/useTicket'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { NextPageWithLayout } from 'pages/_app'
import { useEffect, useMemo, useState } from 'react'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { activeTicket, selectedTicketsAtom } from 'stores/ticket'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { formatDate, titleCase } from 'utils/helpers'

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

  const [activeModal, setActiveModal] = useState<boolean>(false)
  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom)
  const [activeTicketId, setActiveTicketId] = useAtom(activeTicket)

  const [allTicketsSelected, setSelectAll] = useState(false)

  const closeModal = () => setActiveModal(false)

  const countSelected = selectedTickets.length

  const previousTicket = () => {
    if (activeTicketId !== 0) void setActiveTicketId((prev) => prev - 1)
  }

  const nextTicket = () => {
    if ((activeTicketId as number) + 1 !== countSelected) void setActiveTicketId((prev) => prev++)
  }

  const columns = useMemo<Array<Column<TicketWithMeta>>>(() => {
    function handleSelectAll() {
      setSelectAll((prev) => !prev)

      void setSelectedTickets(allTicketsSelected ? [] : tickets.map(({ id }) => id))
    }

    function handleTicketSelection(selectedId: number) {
      void setSelectedTickets((prev) =>
        prev.includes(selectedId) === true ? prev.filter((id) => id !== selectedId) : [...prev, selectedId],
      )
    }

    return [
      {
        field: 'select',
        headerslot: (
          <div className="flex items-center justify-center">
            <input
              className="checkbox checkbox-xs"
              type="checkbox"
              checked={allTicketsSelected}
              onChange={handleSelectAll}
            />
          </div>
        ),
        format: ({ id }) => (
          <div className="flex items-center justify-center">
            <input
              className="checkbox checkbox-xs"
              type="checkbox"
              checked={selectedTickets.includes(id)}
              onChange={() => handleTicketSelection(id)}
            />
          </div>
        ),
      },
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
      // TODO: handle tickets like this from UI when doing batch ops
      // {
      //   field: 'action',
      //   label: 'Action',
      //   format: ({ id }) => (
      //     <button
      //       className="btn btn-xs"
      //       onClick={async () => {
      //         await trpcClient.mutation('ticket.action', {
      //           key: userData.owner?.code ?? '',
      //           data: [{ id, status: 'RESOLVED' }],
      //         })
      //       }}
      //     >
      //       Resolve
      //     </button>
      //   ),
      // },
    ]
  }, [allTicketsSelected, selectedTickets, setSelectedTickets, tickets])

  useEffect(() => {
    if (allTicketsSelected && selectedTickets.length === 0) {
      setSelectAll(false)
    }
  }, [selectedTickets, allTicketsSelected])

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

      <div className="h-4">
        {selectedTickets.length !== 0 && (
          <div>
            <p>
              You have selected {countSelected} tickets,{' '}
              <button
                className="btn  btn-xs"
                onClick={() => {
                  setActiveModal(true)
                  void setActiveTicketId(selectedTickets[0])
                }}
              >
                Click
              </button>{' '}
              to start resolving.
            </p>
          </div>
        )}
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

      <MDialog show={activeModal} onClose={() => null} noEscape>
        <ManageTickets
          closeModal={closeModal}
          updateTicket={setSelectedTickets}
          ticket={tickets[activeTicketId] as Ticket}
          ticketIndex={activeTicketId}
          nextTicket={nextTicket}
          previousTicket={previousTicket}
          totalTickets={countSelected}
        />
      </MDialog>
    </div>
  )
}

TicketListing.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default TicketListing
