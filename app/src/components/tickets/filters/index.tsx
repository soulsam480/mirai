import { MIcon } from 'components/lib/MIcon'
import { useAtom } from 'jotai'
import React from 'react'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { StatusFilter, StatusFilterPreview } from './StatusFilter'
import { TypeFilter, TypeFilterPreview } from './TypeFilter'

interface Props {}

export const TicketFiltersBlock: React.FC<Props> = () => {
  const [filters, setFilters] = useAtom(ticketFiltersAtom)

  const hasAnyFilter = Object.values(filters).some(Boolean)

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <TypeFilter />
        <StatusFilter />

        {hasAnyFilter && (
          <button className="btn  btn-ghost btn-circle btn-sm" onClick={() => setFilters({})}>
            <MIcon className="tooltip tooltip-right tooltip-secondary text-lg" data-tip="Reset all">
              <IconLaTimesCircle />
            </MIcon>
          </button>
        )}
      </div>

      {hasAnyFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
          <span>Tickets </span>
          <TypeFilterPreview />
          <StatusFilterPreview />
        </div>
      )}
    </>
  )
}
