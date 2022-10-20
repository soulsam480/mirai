import React from 'react'
import { Option } from '../../../types'
import { MIcon } from '../MIcon'
import { MSelect } from '../MSelect'
import IconPhArrowCounterClockwise from '~icons/ph/arrow-counter-clockwise'

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

export const MDateFilter: React.FC<Props> = ({ onChange, value: model }) => {
  return (
    <div className="relative flex items-center gap-0.5 border border-primary ">
      <MSelect
        name="type"
        options={DATE_OPTIONS}
        value={model.type}
        palceholder="Select date filter type"
        onChange={(type) => {
          onChange({
            ...model,
            type,
          })
        }}
        width="max-content"
        borderless
      />

      <input
        className="input input-bordered input-primary input-sm border-y-0 border-r-0 focus:outline-none"
        placeholder="Select date"
        value={model.value}
        onChange={({ currentTarget }) => {
          onChange({
            ...model,
            value: currentTarget.value,
          })
        }}
        type="date"
      />

      {model.value.length !== 0 && (
        <MIcon
          className="tooltip tooltip-left tooltip-secondary m-0.5 flex cursor-pointer items-center self-stretch border-l border-primary px-1 text-sm"
          onClick={(e) => {
            e.stopPropagation()

            onChange({
              ...model,
              value: '',
            })
          }}
          data-tip="Reset value"
        >
          <IconPhArrowCounterClockwise />
        </MIcon>
      )}
    </div>
  )
}
