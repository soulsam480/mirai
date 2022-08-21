import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { instituteBatches, studentFiltersAtom, useSelectAtom } from '../../../../stores'
import { MSelect } from '../../../lib'

interface Props {}

export const BatchFilter: React.FC<Props> = () => {
  const batches = useAtomValue(instituteBatches)

  const [filters, setFilters] = useAtom(studentFiltersAtom)

  const batchOptions = useMemo(() => batches.map(({ name, id }) => ({ value: id, label: name })), [batches])

  return (
    <MSelect
      name="batch"
      options={batchOptions}
      value={filters.batchId}
      palceholder="Select Batch"
      onChange={(val) => {
        void setFilters((prev) => ({
          ...prev,
          batchId: val,
        }))
      }}
      width="max-content"
      reset
    />
  )
}

export const BatchFilterPreview: React.FC = () => {
  const batchId = useSelectAtom(studentFiltersAtom, (v) => v.batchId)
  const departmentId = useSelectAtom(studentFiltersAtom, (v) => v.departmentId)
  const batches = useAtomValue(instituteBatches)

  const batchName = useMemo(() => batches.find((b) => b.id === batchId), [batchId, batches])

  if (batchId === undefined || batchName === undefined) return null

  return (
    <div className="text-sm">
      belong to <span className="font-semibold text-primary-focus">{batchName.name}</span> batch
      {departmentId !== undefined && ','}
    </div>
  )
}
