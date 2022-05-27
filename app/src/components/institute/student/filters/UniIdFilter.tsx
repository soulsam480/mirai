import { MIcon } from 'components/lib/MIcon'
import { useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { useSelectAtom } from 'stores/index'
import { studentFiltersAtom } from 'stores/student'

interface Props {}

export const UniIdFilter: React.FC<Props> = () => {
  const setFilters = useSetAtom(studentFiltersAtom)
  const uniIdFilter = useSelectAtom(studentFiltersAtom, (v) => v.uniId)

  const [value, setValue] = useState('')

  useDebounce(
    () => {
      void setFilters((prev) => ({ ...prev, uniId: value }))
    },
    500,
    [value],
  )

  useEffect(() => {
    uniIdFilter === undefined && setValue('')
  }, [uniIdFilter, setValue])

  return (
    <div className="relative">
      <input
        className="input input-bordered input-primary input-sm"
        placeholder="Reg. number"
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
          <IconPhArrowCounterClockwise />
        </MIcon>
      )}
    </div>
  )
}

export const UniIdFilterPreview: React.FC = () => {
  const uniId = useSelectAtom(studentFiltersAtom, (v) => v.uniId)

  if (!Boolean(uniId)) return null

  return (
    <div className="text-sm">
      with registration number <span className="font-semibold text-primary-focus">{uniId}</span>
    </div>
  )
}
