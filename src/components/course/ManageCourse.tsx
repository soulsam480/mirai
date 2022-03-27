import { zodResolver } from '@hookform/resolvers/zod'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import { useDepartments, useCourse } from 'contexts'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useGlobalError } from 'utils/hooks'
import { z } from 'zod'
import omit from 'lodash/omit'
import { useUser } from 'stores/user'

interface Props {}

const programDurationType = ['SEMESTER', 'YEAR'].map((o) => ({ label: o, value: o }))
const courseScoreType = ['CGPA', 'PERCENTAGE'].map((o) => ({ label: o, value: o }))
const programLevel = ['UG', 'PG', 'PHD'].map((o) => ({ label: o, value: o }))

export const createCourseSchema = z.object({
  instituteId: z.number(),
  departmentId: z.number(),
  programDuration: z.number(),
  branchName: z.string().min(1),
  branchCode: z.string().min(1),
  programName: z.string().min(1),
  scoreType: z.enum(['CGPA', 'PERCENTAGE']),
  programDurationType: z.enum(['SEMESTER', 'YEAR']),
  programLevel: z.enum(['UG', 'PG', 'PHD']),
})

export const ManageCourse: React.FC<Props> = () => {
  const router = useRouter()
  const setError = useGlobalError()
  const userData = useUser()
  const { departments = [] } = useDepartments()

  const departmentOptions = useMemo(
    () => departments.map((dept) => ({ label: dept.name, value: dept.id })),
    [departments],
  )

  const isEditMode = useMemo(
    () => router.query.courseId !== undefined && router.query.courseId.length > 0,
    [router.query],
  )

  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema.omit({ instituteId: true })),
    defaultValues: {
      branchName: '',
      branchCode: '',
      programName: '',
      scoreType: 'CGPA',
      programDurationType: 'SEMESTER',
      programLevel: 'UG',
    },
    shouldFocusError: true,
  })

  const { register, handleSubmit, formState, setValue } = form

  const { course, create, update } = useCourse({
    onSuccess(data) {
      const {
        programDuration,
        branchName,
        branchCode,
        programName,
        scoreType,
        programDurationType,
        programLevel,
        departmentId,
      } = data

      setValue('branchName', branchName)
      setValue('branchCode', branchCode)
      setValue('programName', programName)
      setValue('programDurationType', programDurationType)
      setValue('programDuration', programDuration)
      setValue('scoreType', scoreType)
      setValue('programLevel', programLevel)
      setValue('departmentId', departmentId)
    },
    onError(e) {
      setError(e)

      if (e?.data?.code === 'NOT_FOUND') {
        void router.push('/admin/institute')
      }
    },
  })

  function submitHandler(data: Omit<z.infer<typeof createCourseSchema>, 'instituteId'>) {
    isEditMode
      ? update.mutate({
          ...omit(data, ['instituteId']),
          id: +(router.query.courseId as string),
        })
      : create.mutate({
          ...data,
          instituteId: userData.instituteId as number,
        })
  }

  useEffect(() => {
    return () => form.reset()
  }, [form])

  return (
    <>
      <div className="mb-4 text-lg font-medium leading-6 text-gray-900">
        {isEditMode ? (
          <>
            Manage{' '}
            <span className="font-bold text-primary">
              {course?.programName}, {course?.branchName}
            </span>
          </>
        ) : (
          'Create new course'
        )}
      </div>

      <FormProvider {...form}>
        <form className="flex w-full form-control sm:w-[700px]" onSubmit={handleSubmit(submitHandler)}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
            <div>
              <MInput
                label="Branch name"
                {...register('branchName')}
                placeholder="Branch name"
                error={formState.errors.branchName}
              />

              <MInput
                label="Branch code"
                {...register('branchCode')}
                placeholder="Branch code"
                error={formState.errors.branchCode}
              />

              <MInput
                label="Course name"
                {...register('programName')}
                placeholder="Course name"
                error={formState.errors.programName}
              />

              <MSelect
                name="programDurationType"
                label="Course duration type"
                options={programDurationType}
                error={formState.errors.programDurationType}
              />
            </div>

            <div>
              <MInput
                label="Course duration"
                {...register('programDuration', { valueAsNumber: true })}
                placeholder="Course duration"
                error={formState.errors.programDuration}
                type="number"
                min={0}
              />

              <MSelect
                name="scoreType"
                label="Course score type"
                options={courseScoreType}
                error={formState.errors.scoreType}
              />

              <MSelect name="programLevel" label="Course level" options={programLevel} />

              <MSelect name="departmentId" label="Department" options={departmentOptions} />
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              onClick={async () => await router.push('/institute/course')}
              className="mt-5 btn btn-sm btn-secondary"
            >
              Cancel
            </button>

            <button type="submit" className="mt-5 btn btn-sm btn-primary">
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}
