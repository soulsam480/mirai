import clsx from 'clsx'
import { MIcon } from 'components/lib/MIcon'
import { MSelect } from 'components/lib/MSelect'
import { useAtom } from 'jotai'
import React from 'react'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { Option } from 'types'

interface Props {}

const SORT_OPTIONS: Option[] = [
  {
    label: 'Ascending',
    value: 'asc',
    meta: { icon: <IconLaSortAmountUp /> },
  },
  {
    label: 'Descending',
    value: 'desc',
    meta: { icon: <IconLaSortAmountDown /> },
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
        return <MIcon>{value.value === 'asc' ? <IconLaSortAmountUp /> : <IconLaSortAmountDown />}</MIcon>
      }}
      width="max-content"
      borderless
      optionSlot={({ slotCtx: { selected }, option }) => (
        <div
          className={clsx([
            selected === true ? 'font-semibold text-primary group-hover:text-base-100' : 'text-base-content',
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
