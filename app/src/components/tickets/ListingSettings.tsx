import clsx from 'clsx'
import { useAtom } from 'jotai'
import React from 'react'
import { ticketFiltersAtom } from '../../stores'
import { Option } from '../../types'
import { MIcon, MSelect } from '../lib'
import IconPhSortAscending from '~icons/ph/sort-ascending'
import IconPhSortDescending from '~icons/ph/sort-descending'

interface Props {}

const SORT_OPTIONS: Option[] = [
  {
    label: 'Ascending',
    value: 'asc',
    meta: { icon: <IconPhSortAscending /> },
  },
  {
    label: 'Descending',
    value: 'desc',
    meta: { icon: <IconPhSortDescending /> },
  },
]

export const ListingSettings: React.FC<Props> = () => {
  const [filters, setFilters] = useAtom(ticketFiltersAtom)

  return (
    <MSelect
      value={filters.sort}
      onChange={(sort) => {
        void setFilters((prev) => ({ ...prev, sort }))
      }}
      name="sort"
      options={SORT_OPTIONS}
      customButton={({ value }) => {
        return (
          <MIcon className="tooltip tooltip-left" data-tip="Sort tickets">
            {value.value === 'asc' ? <IconPhSortAscending /> : <IconPhSortDescending />}
          </MIcon>
        )
      }}
      width="max-content"
      borderless
      optionSlot={({ slotCtx: { selected }, option }) => (
        <div
          className={clsx([
            selected ? 'font-semibold text-primary group-hover:text-base-100' : 'text-base-content',
            'flex flex-grow ',
          ])}
        >
          <MIcon>{option.meta.icon}</MIcon>
          <span>{option.label}</span>
        </div>
      )}
    />
  )
}
