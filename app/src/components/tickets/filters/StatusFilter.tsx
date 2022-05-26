import { MSelect } from 'components/lib/MSelect'
import { useAtom } from 'jotai'
import React, { useMemo } from 'react'
import { useSelectAtom } from 'stores/index'
import { ticketFiltersAtom } from 'stores/ticketFilters'

interface Props {}

export const StatusFilter: React.FC<Props> = () => {
  const statusOptions = useMemo(
    () => ['OPEN', 'INPROGRESS', 'CLOSED', 'RESOLVED'].map((t) => ({ label: t, value: t })),
    [],
  )

  const [filters, setFilters] = useAtom(ticketFiltersAtom)

  return (
    <MSelect
      name="status"
      options={statusOptions}
      value={filters.status}
      palceholder="Select status"
      onChange={(val) => {
        void setFilters((prev) => ({
          ...prev,
          status: val,
        }))
      }}
      width="max-content"
      reset
    />
  )
}

export const StatusFilterPreview: React.FC = () => {
  const statusValue = useSelectAtom(ticketFiltersAtom, (ticket) => ticket.status)

  if (statusValue === undefined) return null

  return (
    <div className="text-sm">
      with status <span className="font-semibold text-primary-focus">{statusValue}</span>
    </div>
  )
}
