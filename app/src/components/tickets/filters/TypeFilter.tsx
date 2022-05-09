import { MSelect } from 'components/lib/MSelect'
import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { ticketFiltersAtom } from 'stores/ticketFilters'
import { titleCase } from 'utils/helpers'

interface Props {}

export const TypeFilter: React.FC<Props> = () => {
  const typeOptions = useMemo(
    () =>
      ['STUDENT_ONBOARDING', 'STUDENT_UPDATE_DATA', 'STUDENT_SUPPORT'].map((t) => ({ label: titleCase(t), value: t })),
    [],
  )

  const [filters, setFilters] = useAtom(ticketFiltersAtom)

  return (
    <MSelect
      name="type"
      options={typeOptions}
      value={filters.type}
      palceholder="Select Type"
      onChange={(val) => {
        void setFilters((prev) => ({
          ...prev,
          type: val,
        }))
      }}
      width="max-content"
      reset
    />
  )
}

export const TypeFilterPreview: React.FC = () => {
  const filters = useAtomValue(ticketFiltersAtom)

  if (filters.type === undefined) return null

  return (
    <div className="text-sm">
      of type <span className="font-semibold text-primary-focus">{titleCase(filters.type)}</span>
      {filters.status !== undefined && ','}
    </div>
  )
}
