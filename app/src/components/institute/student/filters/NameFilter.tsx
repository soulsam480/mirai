import { MIcon } from 'components/lib/MIcon'
import { useSetAtom } from 'jotai'
import React, { useState } from 'react'
import { useDebounce } from 'react-use'
import { useSelectAtom } from 'stores/index'
import { studentFiltersAtom } from 'stores/student'

interface Props {}

export const NameFilter: React.FC<Props> = () => {
  const setFilters = useSetAtom(studentFiltersAtom)

  const [value, setValue] = useState('')

  useDebounce(
    () => {
      void setFilters((prev) => ({ ...prev, name: value }))
    },
    500,
    [value],
  )

  return (
    <div className="relative">
      <input
        className="input input-bordered input-primary input-sm"
        placeholder="Name"
        value={value}
        onChange={({ currentTarget }) => {
          setValue(currentTarget.value)
        }}
      />

      {value.length > 0 && (
        <MIcon
          className="tooltip tooltip-left tooltip-secondary absolute inset-y-0 right-0 m-0.5 flex cursor-pointer items-center rounded bg-base-100 px-1 text-sm"
          onClick={(e) => {
            e.stopPropagation()

            setValue('')
          }}
          data-tip="Reset value"
        >
          <IconLaUndoAlt />
        </MIcon>
      )}
    </div>
  )
}

export const NameFilterPreview: React.FC = () => {
  const studentName = useSelectAtom(studentFiltersAtom, (v) => v.name)
  const uniId = useSelectAtom(studentFiltersAtom, (v) => v.uniId)

  if (!Boolean(studentName)) return null

  return (
    <div className="text-sm">
      with name <span className="font-semibold text-primary-focus">{studentName}</span>
      {Boolean(uniId) && ','}
    </div>
  )
}
