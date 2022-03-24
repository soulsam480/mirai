import { useAlert } from 'components/lib/store/alerts'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import { TRPCErrorType } from 'types'
import { z } from 'zod'
import { MInput } from 'components/lib/MInput'
import { trpc } from 'utils/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUser } from 'stores/user'
import { useLoader } from 'components/lib/store/loader'

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name shouldn't be empty"),
  inCharge: z.string().optional(),
  instituteId: z.number(),
})

const _manageDepartmentSchema = createDepartmentSchema.extend({ id: z.number() })

export const ManageDepartment: React.FC<any> = () => {
  const router = useRouter()
  const setAlert = useAlert()
  const utils = trpc.useContext()
  const userData = useUser()
  const loader = useLoader()

  const [globalError, setError] = useState<TRPCErrorType | null>(null)
  const isEditMode = useMemo(
    () => router.query.departmentId !== undefined && router.query.departmentId.length > 0,
    [router.query],
  )

  trpc.useQuery(
    [
      'department.get',
      {
        departmentId: +(router.query.departmentId ?? ''),
        // institute ID will be here 100%
        instituteId: userData.instituteId as number,
      },
    ],
    {
      enabled: isEditMode,
      refetchOnWindowFocus: false,
      retry: false,
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
    },
  )

  const { mutateAsync: createDepartmentMut } = trpc.useMutation(['department.create'], {
    onError: setError,
  })

  const { mutateAsync: updateDepartmentMut } = trpc.useMutation(['department.update'], {
    onError: setError,
    onSuccess() {
      void utils.invalidateQueries(['department.getAll'])
    },
  })

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: zodResolver(createDepartmentSchema.omit({ instituteId: true })),
    defaultValues: {
      name: '',
      inCharge: '',
    },
    shouldFocusError: true,
  })

  async function createDepartment(data: Omit<z.infer<typeof createDepartmentSchema>, 'instituteId'>) {
    try {
      const resp = await createDepartmentMut({ ...data, instituteId: userData.instituteId as number })

      setAlert({
        message: 'Department created successfully !',
        type: 'success',
      })

      void router.replace({
        pathname: `/institute/department/${resp.id}`,
      })
    } catch (_) {}
  }

  async function updateDepartment(data: Omit<z.infer<typeof createDepartmentSchema>, 'instituteId'>) {
    try {
      loader.show()

      await updateDepartmentMut({
        ...data,
        id: Number(router.query.departmentId),
        instituteId: userData.instituteId as number,
      })

      setAlert({
        message: 'Institute updated successfully !',
        type: 'success',
      })

      void router.push('/institute/department')
    } catch (_) {
    } finally {
      loader.hide()
    }
  }

  useEffect(() => {
    if (globalError == null) return

    setAlert({
      message: globalError.message,
      type: 'danger',
    })

    setError(null)
  }, [globalError, setAlert])

  return (
    <>
      <div className="text-lg font-medium leading-6 text-gray-900">
        {isEditMode ? (
          <>
            Manage <span className="font-bold text-primary">{''}</span>
          </>
        ) : (
          'Create new department'
        )}
      </div>
      <form
        className="flex w-full form-control sm:w-80"
        onSubmit={handleSubmit(isEditMode ? updateDepartment : createDepartment)}
      >
        <MInput label="Name" {...register('name')} placeholder="Department name" error={formState.errors.name} />

        <MInput
          {...register('inCharge')}
          label="In charge"
          placeholder="Department incharge"
          error={formState.errors.inCharge}
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={async () => await router.push('/institute/department')}
            className="mt-5 btn btn-sm btn-secondary"
          >
            Cancel{' '}
          </button>

          <button type="submit" className="mt-5 btn btn-sm btn-primary">
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </>
  )
}
