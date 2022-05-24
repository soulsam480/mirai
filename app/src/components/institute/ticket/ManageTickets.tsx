import { Ticket } from '@prisma/client'
import { MInput } from 'components/lib/MInput'
import React, { SetStateAction } from 'react'
import { SelectedTicketType } from 'stores/ticket'
import { StudentTicketShape } from 'types'
import { formatDate } from 'utils/helpers'

interface Props {
  ticket: Ticket
  ticketIndex: number
  totalTickets: number
  previousTicket: () => void
  nextTicket: () => void
  closeModal: () => void
  updateTicket: (update: SetStateAction<SelectedTicketType[]>) => void
}

const ManageTickets: React.FC<Props> = ({
  ticket,
  closeModal,
  ticketIndex,
  totalTickets,
  previousTicket,
  nextTicket,
  // updateTicket,
}) => {
  const { status, meta } = ticket

  const {
    data: { name, email, gender, mobileNumber, category, dob },
    type,
  } = meta as StudentTicketShape

  return (
    <form className="w-full sm:w-[35rem]">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-xl font-semibold">{type.replaceAll('_', ' ')}</h1>
        <IconLaTimesCircle onClick={() => closeModal()} />
      </div>

      <div className="rounded-md border border-gray-700 p-2">
        <h1 className="font-bold">Details</h1>
        <p>Name : {name}</p>
        <p>Email : {email}</p>
        <p>Status : {status}</p>
        <p>Gender : {gender}</p>
        <p>Category : {category}</p>
        <p>Mobile number : {mobileNumber}</p>
        <p>Date of birth : {formatDate(dob, 'DD MMMM YYYY')}</p>
        <MInput label="Notes" as="textarea" />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
            }}
            className="btn btn-success btn-sm mt-5"
          >
            Resolve
          </button>
          <button type="button" className="btn btn-error btn-sm mt-5">
            Reject
          </button>
        </div>
      </div>

      <div className="flex justify-between space-x-2">
        <div>
          <button
            type="button"
            disabled={ticketIndex === 0}
            onClick={(e) => {
              e.preventDefault()
              previousTicket()
            }}
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
            type="submit"
            disabled={ticketIndex + 1 === totalTickets}
            onClick={(e) => {
              e.preventDefault()
              nextTicket()
            }}
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
