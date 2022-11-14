import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUser } from '../../../stores'
import { useGlobalError } from '../../../utils'
import { useDepartment } from '../../../contexts'
import { createDepartmentSchema } from '@mirai/schema'
import { MForm, MInput } from '../../lib'

export const ManageDepartment: React.FC<any> = () => {
  const router = useRouter()
  const userData = useUser()
  const setError = useGlobalError()

  const isEditMode = useMemo(
    () => router.query.departmentId !== undefined && router.query.departmentId.length > 0,
    [router.query],
  )

  const { department, update, create } = useDepartment({
    onSuccess(data) {
      const { inCharge, name } = data

      name !== null && setValue('name', name)
      inCharge !== null && setValue('inCharge', inCharge)
    },
    onError(e) {
      setError(e)

      if (e?.data?.code === 'NOT_FOUND') {
        void router.push('/institute/department')
      }
    },
  })

  const form = useForm({
    resolver: zodResolver(createDepartmentSchema.omit({ instituteId: true })),
    defaultValues: {
      name: '',
      inCharge: '',
    },
    shouldFocusError: true,
  })

  const { handleSubmit, setValue } = form

  async function createDepartment(data: Omit<z.infer<typeof createDepartmentSchema>, 'instituteId'>) {
    create.mutate({ ...data, instituteId: Number(userData.instituteId) })
  }

  async function updateDepartment(data: Omit<z.infer<typeof createDepartmentSchema>, 'instituteId'>) {
    update.mutate({ ...data, id: Number(router.query.departmentId), instituteId: userData.instituteId as number })
  }

  return (
    <>
      <MForm
        className="sm:max-w-80 form-control flex sm:w-80"
        onSubmit={handleSubmit(isEditMode ? updateDepartment : createDepartment)}
        form={form}
      >
        <div className="text-lg font-medium leading-6">
          {isEditMode ? (
            <>
              Manage <span className="font-bold text-primary">{department?.name}</span>
            </>
          ) : (
            'Create new department'
          )}
        </div>

        <MInput label="Name" name="name" placeholder="Department name" />

        <MInput name="inCharge" label="In charge" placeholder="Department incharge" />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={async () => await router.push('/institute/department')}
            className="btn-outline btn-sm btn mt-5"
          >
            Cancel
          </button>

          <button type="submit" className="btn-sm btn mt-5">
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </MForm>
    </>
  )
}
