import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { StatusFilter, StatusFilterPreview } from './StatusFilter'
import { TypeFilter, TypeFilterPreview } from './TypeFilter'
import { useResetAtom } from 'jotai/utils'
import { CreatedAtFilter, CreatedAtFilterPreview } from './CreatedAtFilter'
import { ticketFiltersAtom } from '../../../stores'
import { MIcon } from '../../lib'

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
            <MIcon className="tooltip tooltip-right tooltip-secondary" data-tip="Reset all">
              <IconPhXCircle />
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
