import type { Ticket, TicketStatus } from '@prisma/client'
import { MInput } from 'components/lib/MInput'
import dayjs from 'dayjs'
import React from 'react'
import { TICKET_DISPLAY_KEYS } from 'utils/constnts'
import { formatDate, titleCase } from 'utils/helpers'
import { MSelect } from 'lib/MSelect'
import { useAtom } from 'jotai'
import { selectedTicketsAtom } from 'stores/ticket'
import { STATUS_OPTIONS } from 'pages/institute/tickets'

interface Props {
  ticket: Ticket
  ticketIndex: number
  totalTickets: number
  previousTicket: () => void
  nextTicket: () => void
  closeModal: () => void
  pushTicketToQueue: (tickets: Ticket[]) => Promise<void>
}

const ManageTickets: React.FC<Props> = ({
  ticket,
  closeModal,
  ticketIndex,
  totalTickets,
  previousTicket,
  nextTicket,
  pushTicketToQueue,
}) => {
  const { meta, id } = ticket
  const { data } = meta as Record<string, any>

  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom)

  function getSafeVal(key: string) {
    return typeof data[key] === 'string'
      ? dayjs(Date.parse(data[key])).isValid()
        ? formatDate(data[key], 'DD MMM YYYY')
        : data[key]
      : null
  }

  function handleStatusChange(value: TicketStatus) {
    void setSelectedTickets((prev) => {
      return prev.map((ticket) => (ticket.id === id ? { ...ticket, status: value } : ticket))
    })
  }

  function handleNotes(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget
    void setSelectedTickets((prev) => {
      return prev.map((ticket) => (ticket.id === id ? { ...ticket, notes: value } : ticket))
    })
  }

  const noteValue = selectedTickets.find((ticket) => ticket.id === id)?.notes
  const statusValue = selectedTickets.find((ticket) => ticket.id === id)?.status

  return (
    <form className="flex w-full flex-col gap-5 sm:w-[600px]">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-xl font-semibold">
          Reviewing ticket {'#'}
          {ticket.id}
        </h1>
        <IconLaTimes className="cursor-pointer text-lg " onClick={() => closeModal()} />
      </div>

      <div className="rounded-md bg-base-300/70 p-4">
        <div className="mb-2 text-lg font-semibold">Details</div>

        <div className="grid grid-cols-2 gap-2">
          {TICKET_DISPLAY_KEYS.map((key) => {
            return getSafeVal(key) !== null ? (
              <React.Fragment key={key}>
                <div className="max-w-max">{titleCase(key)}:</div> <div>{getSafeVal(key)}</div>
              </React.Fragment>
            ) : null
          })}
        </div>

        <div className="divider my-2"></div>

        <div className="grid grid-cols-2 gap-4">
          <MInput label="Notes" as="textarea" value={noteValue ?? ''} onChange={handleNotes} />

          <MSelect
            value={statusValue}
            onChange={handleStatusChange}
            name="status"
            options={STATUS_OPTIONS}
            label="Status"
          />
        </div>
      </div>

      <div className="flex justify-between space-x-2">
        <div>
          <button
            type="button"
            disabled={ticketIndex === 0}
            onClick={previousTicket}
            className="btn btn-outline btn-sm mt-5"
          >
            Previous
          </button>{' '}
        </div>

        <div className="flex justify-between space-x-2">
          {ticketIndex + 1 === totalTickets && (
            <button
              type="button"
              className="btn  btn-sm mt-5"
              onClick={async () => {
                await pushTicketToQueue(selectedTickets)
              }}
            >
              Submit
            </button>
          )}
          <button
            type="button"
            disabled={ticketIndex + 1 === totalTickets}
            onClick={nextTicket}
            className="btn btn-outline btn-sm mt-5"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  )
}

export default ManageTickets
