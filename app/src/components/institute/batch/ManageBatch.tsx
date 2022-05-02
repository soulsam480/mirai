import { zodResolver } from '@hookform/resolvers/zod'
import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import { useAlert } from 'components/lib/store/alerts'
import { useBatch } from 'contexts/useBatch'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createBatchSchema } from 'schemas'
import { useUser } from 'stores/user'
import { TRPCErrorType } from 'types'
import { z } from 'zod'

const durationType = ['YEAR', 'MONTH', 'WEEK', 'DAY'].map((o) => ({ label: o, value: o }))
const statusType = ['ACTIVE', 'INACTIVE'].map((o) => ({ label: o, value: o }))

export const ManageBatch: React.FC<any> = () => {
  const router = useRouter()
  const setAlert = useAlert()
  const userData = useUser()

  const [globalError, setError] = useState<TRPCErrorType | null>(null)
  const isEditMode = useMemo(
    () => router.query.batchId !== undefined && router.query.batchId.length > 0,
    [router.query],
  )

  const { batch, create, update } = useBatch({
    onSuccess(data) {
      const { name, status, duration, durationType } = data

      name !== null && setValue('name', name)
      status !== null && setValue('status', status)
      duration !== null && setValue('duration', duration)
      durationType !== null && setValue('durationType', durationType)
    },
    onError(e) {
      setError(e)
      if (e?.data?.code === 'NOT_FOUND') {
        void router.push('/institute/batch')
      }
    },
  })

  const form = useForm<z.infer<typeof createBatchSchema>>({
    resolver: zodResolver(createBatchSchema.omit({ instituteId: true })),
    defaultValues: {
      name: '',
      duration: '',
      durationType: 'YEAR',
      status: 'INACTIVE',
    },
    shouldFocusError: true,
  })

  const { register, handleSubmit, formState, setValue } = form

  async function createBatch(data: Omit<z.infer<typeof createBatchSchema>, 'instituteId'>) {
    create.mutate({ ...data, instituteId: Number(userData.instituteId) })
  }

  async function updateBatch(data: Omit<z.infer<typeof createBatchSchema>, 'instituteId'>) {
    update.mutate({ ...data, id: Number(router.query.batchId), instituteId: userData.instituteId as number })
  }

  useEffect(() => {
    if (globalError == null) return

    setAlert({
      message: globalError.message,
      type: 'danger',
    })

    setError(null)
  }, [globalError, setAlert])

  useEffect(() => {
    return () => form.reset()
  }, [form])

  return (
    <>
      <div className="text-lg font-medium leading-6    ">
        {isEditMode ? (
          <>
            Manage <span className="font-bold text-primary">{batch?.name}</span>
          </>
        ) : (
          'Create new Batch'
        )}
      </div>

      <MForm
        form={form}
        className="sm:max-w-80 form-control flex sm:w-80"
        onSubmit={handleSubmit(isEditMode ? updateBatch : createBatch)}
      >
        <MInput label="Name" {...register('name')} placeholder="Batch name" error={formState.errors.name} />

        <MInput {...register('duration')} label="Duration" placeholder="Duration" error={formState.errors.duration} />

        <MSelect
          name="durationType"
          label="Batch duration type"
          options={durationType}
          error={formState.errors.durationType}
        />

        <MSelect name="status" label="Status" options={statusType} error={formState.errors.status} />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={async () => await router.push('/institute/batch')}
            className="   btn btn-outline btn-sm mt-5"
          >
            Cancel
          </button>

          <button type="submit" className="   btn btn-sm mt-5">
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </MForm>
    </>
  )
}

export default ManageBatch
