import { MIcon } from 'components/lib/MIcon'
import { useAtomValue } from 'jotai'
import React from 'react'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { StatusFilter, StatusFilterPreview } from './StatusFilter'
import { TypeFilter, TypeFilterPreview } from './TypeFilter'
import { useResetAtom } from 'jotai/utils'
import { CreatedAtFilter, CreatedAtFilterPreview } from './CreatedAtFilter'

interface Props {}

export const TicketFiltersBlock: React.FC<Props> = () => {
  const filters = useAtomValue(ticketFiltersAtom)
  const resetFilters = useResetAtom(ticketFiltersAtom)

  const hasAnyFilter = Object.values(filters).some((value) =>
    typeof value === 'object' ? value.value.length > 0 : Boolean(value),
  )
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <TypeFilter />
        <StatusFilter />
        <CreatedAtFilter />

        {hasAnyFilter && (
          <button className="btn  btn-ghost btn-circle btn-sm" onClick={resetFilters}>
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
          <CreatedAtFilterPreview />
        </div>
      )}
    </>
  )
}
