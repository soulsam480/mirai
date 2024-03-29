import type { Ticket, TicketStatus } from '@prisma/client'
import { useAtom, useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect, useMemo, useState } from 'react'
import { AppLayout } from '../../../components/globals/AppLayout'
import { ManageTicket } from '../../../components/institute/ticket/ManageTicket'
import { Column, MAlertDialog, MBadge, MDialog, MIcon, MSelect, MTable, useAlert } from '../../../components/lib'
import { TicketFiltersBlock } from '../../../components/tickets/filters'
import { ListingSettings } from '../../../components/tickets/ListingSettings'
import { useInstituteAssets } from '../../../contexts'
import { TicketWithMeta, useTickets } from '../../../contexts/useTicket'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import {
  activeTicketAtom,
  selectedTicketsAtom,
  selectedTicketsSetAtom,
  ticketFiltersAtom,
  useUser,
} from '../../../stores'
import { Option } from '../../../types'
import { formatDate, interpolate, titleCase, trpcClient } from '../../../utils'
import { NextPageWithLayout } from '../../_app'
import IconPhListChecks from '~icons/ph/list-checks.jsx'
import IconPhArrowCounterClockwise from '~icons/ph/arrow-counter-clockwise.jsx'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

export const STATUS_OPTIONS: Array<Option<TicketStatus>> = [
  {
    label: 'Resolve',
    value: 'RESOLVED',
  },
  {
    label: 'In Progress',
    value: 'INPROGRESS',
  },
  {
    label: 'Close',
    value: 'CLOSED',
  },
]

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

const Tickets: NextPageWithLayout = () => {
  useInstituteAssets()
  const { tickets, isLoading } = useTickets()
  const userData = useUser()
  const setAlert = useAlert()

  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom)
  // this is a setter of the write-only atom which makes two copies of selected tickets
  const setSelectedTicketsStore = useSetAtom(selectedTicketsSetAtom)
  const [activeTicketIndex, setActiveTicketIndex] = useAtom(activeTicketAtom)
  const setFilters = useResetAtom(ticketFiltersAtom)

  const [allTicketsSelected, setSelectAll] = useState(false)
  const [allStatus, setAllStatus] = useState<TicketStatus | null>(null)
  const [activeModal, setActiveModal] = useState(false)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [alertModal, setAlertModal] = useState(false)

  function closeVerifyModal() {
    setActiveModal(false)
    void setActiveTicketIndex(0)
  }

  const countSelected = selectedTickets.length

  function previousTicket() {
    if (activeTicketIndex !== 0) void setActiveTicketIndex((prev) => prev - 1)
  }

  function nextTicket() {
    if (activeTicketIndex + 1 !== countSelected) void setActiveTicketIndex((prev) => prev + 1)
  }

  async function submitReview() {
    try {
      const response = await trpcClient.mutation('ticket.action', {
        key: userData.id,
        data: selectedTickets.map(({ id, status, notes }) => ({ id, status, notes })),
      })

      const { data, success } = response

      closeVerifyModal()
      setAlertModal(false)

      if (success) {
        // for no errors
        setAlert({
          message: `${selectedTickets.length} tickets are being processed. You will be notified once it's done.`,
          type: 'success',
        })

        void setSelectedTicketsStore(() => [])
      } else {
        setAlert({
          message: `Unable to process tickets, please try again.`,
          type: 'danger',
        })

        // eslint-disable-next-line no-console
        console.error(data)
      }
    } catch (_e) {
      setAlert({
        message: 'Unable to process tickets. Please try again',
        type: 'danger',
      })
    }
  }

  function reviewAll(value: TicketStatus) {
    setAllStatus(value)
    void setSelectedTickets((prev) => prev.map((ticket) => ({ ...ticket, status: value })))
  }

  const columns = useMemo<Array<Column<TicketWithMeta>>>(() => {
    function handleSelectAll() {
      if (allTicketsSelected) {
        setSelectAll((prev) => !prev)
        setAllStatus(null)
        // looks a bit weired but setter functions are not available in
        // write-only atoms
        return setSelectedTickets([])
      }

      const toBeSelected = tickets.filter(({ status }) => !['RESOLVED', 'CLOSED'].includes(status))

      if (toBeSelected.length === 0) {
        return setAlert({
          message: 'Only tickets with OPEN or INPROGRESS status can be selected',
          type: 'danger',
        })
      }

      if (toBeSelected.length > 100) {
        setSelectAll((prev) => !prev)
        void setSelectedTickets(toBeSelected.slice(99))

        return setAlert({
          message: 'Maximum 100 tickets can be selected at once for bulk actions',
          type: 'danger',
        })
      }

      if (
        toBeSelected.length > 1 &&
        toBeSelected.slice(1).find(({ status }) => status !== toBeSelected[0].status) !== undefined
      ) {
        return setAlert({
          message: 'Only tickets of similar status can be selected for bulk actions',
          type: 'danger',
        })
      }

      setSelectAll((prev) => !prev)

      void setSelectedTickets(toBeSelected)
    }

    function handleTicketSelection(selectedId: number) {
      // when a new ticket is being selected
      if (selectedTickets.length === 100 && selectedTickets.find(({ id }) => id === selectedId) === undefined) {
        return setAlert({
          message: 'Maximum 100 tickets can be selected for review',
          type: 'danger',
        })
      }

      setAllStatus(null)

      void setSelectedTicketsStore((prev) =>
        prev.find(({ id }) => id === selectedId) !== undefined
          ? prev.filter(({ id }) => id !== selectedId)
          : [...prev, tickets.find(({ id }) => id === selectedId) as Ticket],
      )
    }

    return [
      {
        field: 'select',
        headerslot: (
          <div className="flex items-center justify-center">
            <input
              className="checkbox checkbox-xs sm:checkbox-sm"
              type="checkbox"
              checked={allTicketsSelected}
              onChange={handleSelectAll}
              disabled={tickets.length === 0}
            />
          </div>
        ),
        format: ({ id, status }) => (
          <div className="flex items-center justify-center">
            <input
              className="checkbox checkbox-xs sm:checkbox-sm"
              type="checkbox"
              disabled={['RESOLVED', 'CLOSED'].includes(status)}
              checked={selectedTickets.find((ticket) => ticket.id === id) !== undefined}
              onChange={() => handleTicketSelection(id)}
              onClick={(e) => e.stopPropagation()}
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
    ]
  }, [allTicketsSelected, tickets, setSelectedTickets, setAlert, setSelectedTicketsStore, selectedTickets])

  useEffect(() => {
    if (allTicketsSelected && selectedTickets.length === 0) {
      setSelectAll(false)
    }
  }, [selectedTickets, allTicketsSelected])

  useEffect(() => {
    return () => {
      void setFilters()
      void setSelectedTicketsStore(() => [])
    }
  }, [setFilters, setSelectedTicketsStore])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between pb-2">
        <div className="text-xl font-medium">Tickets</div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm">Filter tickets</div>
        <TicketFiltersBlock />
      </div>

      {(selectedTickets.length !== 0 || allTicketsSelected) && (
        <div className="mt-5 flex items-center gap-2">
          {selectedTickets.length !== 0 && !allTicketsSelected && (
            <>
              <div>{interpolate('{{count}} ticket selected', { count: countSelected })}</div>

              <button
                className="btn btn-sm flex items-center gap-2"
                onClick={() => {
                  setActiveModal(true)
                }}
              >
                <MIcon>
                  <IconPhListChecks />
                </MIcon>
                <span>Start review</span>
              </button>

              <button
                className="btn btn-sm flex items-center gap-2"
                onClick={() => {
                  void setSelectedTicketsStore(() => [])
                }}
              >
                <MIcon>
                  <IconPhArrowCounterClockwise />
                </MIcon>
                <span>Discard selection</span>
              </button>
            </>
          )}

          {allTicketsSelected && (
            <>
              <div>All tickets selected</div>

              <MSelect
                name="status"
                options={STATUS_OPTIONS}
                value={allStatus}
                onChange={reviewAll}
                width="max-content"
                palceholder="Select status to continue"
              />

              <button className="btn btn-sm" disabled={allStatus === null} onClick={() => setAlertModal(true)}>
                Submit
              </button>
            </>
          )}
        </div>
      )}

      <MAlertDialog
        label={
          allTicketsSelected
            ? 'Submit bulk action ? This is an irreversible operation.'
            : 'Submit ticket review ? This is an irreversible operation.'
        }
        show={alertModal}
        onReject={setAlertModal}
        onConfirm={async () => await submitReview()}
      />

      <MTable
        className="mt-4"
        columns={columns}
        rows={tickets}
        compact
        noDataLabel={'No tickets were found !'}
        loading={isLoading}
        onRowClick={setActiveTicket}
        settingsSlot={<ListingSettings />}
        bodyRowClass="cursor-pointer"
      />

      {activeTicket !== null && (
        <MDialog show={activeTicket !== null} onClose={() => null} noEscape>
          <ManageTicket activeTicket={activeTicket} detailsOnly={true} closeModal={() => setActiveTicket(null)} />
        </MDialog>
      )}

      {activeModal && (
        <MDialog show={activeModal} onClose={() => null} noEscape>
          <ManageTicket
            activeTicket={selectedTickets[activeTicketIndex]}
            closeModal={closeVerifyModal}
            nextTicket={nextTicket}
            previousTicket={previousTicket}
            onSubmit={() => setAlertModal(true)}
          />
        </MDialog>
      )}
    </div>
  )
}

Tickets.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Tickets
