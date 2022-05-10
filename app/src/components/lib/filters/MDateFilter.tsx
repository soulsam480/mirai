import React, { useEffect, useState } from 'react'
import { Option } from 'types'
import { MSelect } from 'lib/MSelect'
import { MIcon } from 'lib/MIcon'

export interface DateFilterValue {
  type: 'lt' | 'gte'
  value: string
}

interface Props {
  onChange: (value: DateFilterValue) => void
  value: DateFilterValue
}

const DATE_OPTIONS: Option[] = [
  {
    label: 'Before date',
    value: 'lt',
  },
  {
    label: 'After date',
    value: 'gte',
  },
]

export const MDateFilter: React.FC<Props> = ({ onChange, value }) => {
  const [filters, setFilters] = useState<DateFilterValue>({
    type: 'gte',
    value: '',
  })

  useEffect(() => {
    if (value.value.length === 0 && filters.value.length === 0) return

    onChange(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, value])

  return (
    <div className="relative flex items-center gap-0.5 border border-primary ">
      <MSelect
        name="type"
        options={DATE_OPTIONS}
        value={filters.type}
        palceholder="Select date filter type"
        onChange={(type) => {
          setFilters((prev) => ({
            ...prev,
            type,
          }))
        }}
        width="max-content"
        borderless
      />

      <input
        className="input input-bordered input-primary input-sm border-y-0 border-r-0 focus:outline-none"
        placeholder="Select date"
        value={filters.value}
        onChange={({ currentTarget }) => {
          setFilters((prev) => ({
            ...prev,
            value: currentTarget.value,
          }))
        }}
        type="date"
      />

      {filters.value.length !== 0 && (
        <MIcon
          className="tooltip tooltip-left tooltip-secondary m-0.5 flex cursor-pointer items-center self-stretch border-l border-primary px-1 text-sm"
          onClick={(e) => {
            e.stopPropagation()

            setFilters((prev) => ({
              ...prev,
              value: '',
            }))
          }}
          data-tip="Reset value"
        >
          <IconLaUndoAlt />
        </MIcon>
      )}
    </div>
  )
}
