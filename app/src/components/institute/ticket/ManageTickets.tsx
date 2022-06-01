import type { TicketStatus } from '@prisma/client'
import { MInput } from 'components/lib/MInput'
import dayjs from 'dayjs'
import React from 'react'
import { TICKET_DISPLAY_FIELDS } from 'utils/constants'
import { formatDate, titleCase } from 'utils/helpers'
import { MSelect } from 'lib/MSelect'
import { useAtom, useAtomValue } from 'jotai'
import { activeTicketAtom, selectedTicketsAtom, selectedTicketsSnapshotAtom } from 'stores/ticket'
import { STATUS_OPTIONS } from 'pages/institute/tickets'
import { useStudentAcademicMeta } from 'utils/hooks'
import { MBadge } from 'components/lib/MBadge'

interface Props {
  previousTicket: () => void
  nextTicket: () => void
  closeModal: () => void
  onSubmit: () => void
}

const ManageTickets: React.FC<Props> = ({ closeModal, previousTicket, nextTicket, onSubmit }) => {
  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom)
  const selectedTicketsSnapshot = useAtomValue(selectedTicketsSnapshotAtom)
  const activeTicketIndex = useAtomValue(activeTicketAtom)

  const activeTicket = selectedTickets[activeTicketIndex]
  const { meta, id } = activeTicket
  const { data: ticketData, type: ticketType } = meta as Record<string, any>

  const studentAcademics = useStudentAcademicMeta(
    ticketType !== 'STUDENT_ONBOARDING'
      ? null
      : {
          batchId: ticketData.batchId,
          departmentId: ticketData.departmentId,
          courseId: ticketData.courseId,
        },
  )

  const totalTickets = selectedTickets.length

  function getSafeVal(key: string) {
    return typeof ticketData[key] === 'string'
      ? dayjs(Date.parse(ticketData[key])).isValid()
        ? formatDate(ticketData[key], 'DD MMM YYYY')
        : ticketData[key]
      : null
  }

  function handleStatusChange(value: TicketStatus) {
    void setSelectedTickets((prev) => {
      return prev.map((activeTicket) => (activeTicket.id === id ? { ...activeTicket, status: value } : activeTicket))
    })
  }

  function handleNotes(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget
    void setSelectedTickets((prev) => {
      return prev.map((activeTicket) => (activeTicket.id === id ? { ...activeTicket, notes: value } : activeTicket))
    })
  }

  const oldTicket = selectedTicketsSnapshot[activeTicketIndex]

  const noteValue = activeTicket.notes
  const statusValue = activeTicket.status

  const isNextSubmitDisabled = oldTicket?.status === statusValue
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const isLastTicket = activeTicketIndex + 1 === totalTickets

  return (
    <div className="flex w-full flex-col gap-5 sm:w-[600px]">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-xl font-semibold">
          Reviewing ticket {'#'}
          {activeTicket.id}
        </h1>
        <IconPhX className="cursor-pointer text-lg " onClick={() => closeModal()} />
      </div>

      <div className="rounded-md bg-base-300/70 p-4">
        <div className="mb-2 text-lg font-semibold">Details</div>

        <div className="grid grid-cols-4 gap-2">
          <div>Ticket type</div>{' '}
          <div className="col-span-3">
            <MBadge className="badge-info">{titleCase(ticketType)}</MBadge>
          </div>
          {TICKET_DISPLAY_FIELDS.map((field) => {
            return getSafeVal(field.value) !== null ? (
              <React.Fragment key={field.value}>
                <div>{field.label}</div> <div className="col-span-3">{getSafeVal(field.value)}</div>
              </React.Fragment>
            ) : null
          })}
          {ticketType === 'STUDENT_ONBOARDING' && (
            <>
              <div>Batch</div> <div className="col-span-3">{studentAcademics?.batch?.name}</div>
              <div>Course</div> <div className="col-span-3">{studentAcademics?.course?.programName}</div>
              <div>Department</div> <div className="col-span-3">{studentAcademics?.department?.name}</div>
            </>
          )}
        </div>

        <div className="divider my-2"></div>

        <div className="mb-2 text-lg font-semibold">Review</div>

        <div className="grid grid-cols-2 gap-4">
          <MSelect
            value={statusValue}
            onChange={handleStatusChange}
            name="status"
            options={STATUS_OPTIONS}
            label="Status"
          />

          <MInput label="Notes" as="textarea" value={noteValue ?? ''} onChange={handleNotes} />
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <div>
          <button
            type="button"
            disabled={activeTicketIndex === 0}
            onClick={previousTicket}
            className="btn btn-outline btn-sm mt-5"
          >
            Previous
          </button>
        </div>

        <div className="flex justify-between gap-2">
          {isLastTicket && (
            <button
              type="button"
              className="btn  btn-sm mt-5"
              onClick={onSubmit}
              disabled={isLastTicket && isNextSubmitDisabled}
            >
              Submit
            </button>
          )}

          <button
            type="button"
            disabled={isNextSubmitDisabled || isLastTicket}
            onClick={nextTicket}
            className="btn btn-outline btn-sm mt-5"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export { ManageTickets }
