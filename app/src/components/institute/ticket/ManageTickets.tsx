import type { Ticket, TicketStatus } from '@prisma/client'
import { MInput } from 'components/lib/MInput'
import dayjs from 'dayjs'
import React, { SetStateAction } from 'react'
import { Option } from 'types'
import { TICKET_DISPLAY_KEYS } from 'utils/constnts'
import { formatDate, titleCase } from 'utils/helpers'
import { MSelect } from 'lib/MSelect'
import { useSetAtom } from 'jotai'
import { selectedTicketsAtom } from 'stores/ticket'

interface Props {
  ticket: Ticket
  ticketIndex: number
  totalTickets: number
  previousTicket: () => void
  nextTicket: () => void
  closeModal: () => void
  updateTicket: (update: SetStateAction<number[]>) => void
}

const STATUS_OPTIONS: Array<Option<TicketStatus>> = [
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

const ManageTickets: React.FC<Props> = ({
  ticket,
  closeModal,
  ticketIndex,
  totalTickets,
  previousTicket,
  nextTicket,
  // updateTicket,
}) => {
  const { meta } = ticket

  const { data } = meta as Record<string, any>

  function getSafeVal(key: string) {
    return typeof data[key] === 'string'
      ? dayjs(Date.parse(data[key])).isValid()
        ? formatDate(data[key], 'DD MMM YYYY')
        : data[key]
      : null
  }

  const updateSelectedTickets = useSetAtom(selectedTicketsAtom)

  function _updateTicket(_data: Ticket) {
    void updateSelectedTickets((prev) => {
      // update current ticket here
      return prev
    })
  }

  return (
    <form className="flex w-full flex-col gap-5 sm:w-[600px]">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-xl font-semibold">
          Reviewing ticket {'#'}
          {ticket.id}
        </h1>
        <IconLaTimesCircle onClick={() => closeModal()} />
      </div>

      <div className="rounded-md bg-base-300/70 p-4">
        <div className="mb-2 text-lg font-semibold">Details</div>

        <div className="grid grid-cols-2 gap-2">
          {TICKET_DISPLAY_KEYS.map((key) => {
            return getSafeVal(key) !== null ? (
              <>
                <div className="max-w-max">{titleCase(key)}:</div> <div>{getSafeVal(key)}</div>
              </>
            ) : null
          })}
        </div>

        <div className="divider my-2"></div>

        <div className="grid grid-cols-2 gap-4">
          <MInput label="Notes" as="textarea" />

          <MSelect
            value={(ticket.meta as any).status}
            onChange={(value) => {
              console.log(value)
            }}
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
          <button type="button" className="btn  btn-sm mt-5">
            Submit
          </button>

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
