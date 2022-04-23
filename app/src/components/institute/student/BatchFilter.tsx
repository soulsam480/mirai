import { MSelect } from 'components/lib/MSelect'
import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { instituteBatches } from 'stores/institute'
import { studentFiltersAtom } from 'stores/student'

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
