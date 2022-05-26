import { MIcon } from 'components/lib/MIcon'
import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { StatusFilter, StatusFilterPreview } from './StatusFilter'
import { TypeFilter, TypeFilterPreview } from './TypeFilter'
import { useResetAtom } from 'jotai/utils'
import { CreatedAtFilter, CreatedAtFilterPreview } from './CreatedAtFilter'

interface Props {}

export const TicketFiltersBlock: React.FC<Props> = () => {
  const filters = useAtomValue(ticketFiltersAtom)
  const resetFilters = useResetAtom(ticketFiltersAtom)

  const hasAnyFilter = useMemo(() => {
    const { sort: _sort, ...rest } = filters

    return Object.values(rest).some((value) => Boolean(typeof value === 'object' ? value.value : value))
  }, [filters])

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <TypeFilter />
        <StatusFilter />
        <CreatedAtFilter />

        {hasAnyFilter && (
          <button className="btn  btn-circle btn-ghost btn-sm" onClick={resetFilters}>
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
