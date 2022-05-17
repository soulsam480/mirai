import { MDateFilter } from 'lib/filters/MDateFilter'
import { useSetAtom } from 'jotai'
import React from 'react'
import { useSelectAtom } from 'stores/index'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { formatDate } from 'utils/helpers'

interface Props {}

export const CreatedAtFilter: React.FC<Props> = () => {
  const setFilters = useSetAtom(ticketFiltersAtom)
  const filterValue = useSelectAtom(ticketFiltersAtom, (ticket) => ticket.createdAt)

  return (
    <MDateFilter
      value={filterValue}
      onChange={(data) => {
        void setFilters((prev) => {
          return {
            ...prev,
            createdAt: data,
          }
        })
      }}
    />
  )
}

export const CreatedAtFilterPreview: React.FC<Props> = () => {
  const filterValue = useSelectAtom(ticketFiltersAtom, (ticket) => ticket.createdAt)

  if (filterValue.value.length === 0) return null

  return (
    <div className="text-sm">
      created{' '}
      <span className="font-semibold text-primary-focus">
        {filterValue.type === 'gte' ? 'after' : 'before'} {formatDate(filterValue.value, 'DD MMM YYYY')}
      </span>
    </div>
  )
}
