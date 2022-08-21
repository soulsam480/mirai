import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import omit from 'lodash/omit'
import { useGlobalError } from '../../../utils'
import { useUser } from '../../../stores'
import { useCourse, useDepartments } from '../../../contexts'
import { createCourseSchema } from '../../../schemas'
import { MForm, MInput, MSelect } from '../../lib'

interface Props {}

const programDurationType = ['SEMESTER', 'YEAR'].map((o) => ({ label: o, value: o }))
const courseScoreType = ['CGPA', 'PERCENTAGE'].map((o) => ({ label: o, value: o }))
const programLevel = ['UG', 'PG', 'PHD'].map((o) => ({ label: o, value: o }))

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

  const { handleSubmit, setValue } = form

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
      <div className="mb-4 text-lg font-medium leading-6">
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

      <MForm
        form={form}
        className="form-control flex w-full sm:w-[700px] sm:max-w-[700px]"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
          <div>
            <MInput name="branchName" label="Branch name" placeholder="Branch name" />

            <MInput name="branchCode" label="Branch code" placeholder="Branch code" />

            <MInput name="programName" label="Course name" placeholder="Course name" />

            <MSelect name="programDurationType" label="Course duration type" options={programDurationType} />
          </div>

          <div>
            <MInput
              name="programDuration"
              label="Course duration"
              placeholder="Course duration"
              type="number"
              min={0}
            />

            <MSelect name="scoreType" label="Course score type" options={courseScoreType} />

            <MSelect name="programLevel" label="Course level" options={programLevel} />

            <MSelect name="departmentId" label="Department" options={departmentOptions} />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={async () => await router.push('/institute/course')}
            className="btn btn-outline btn-sm mt-5"
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
