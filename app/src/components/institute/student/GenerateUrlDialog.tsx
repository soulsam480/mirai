import { zodResolver } from '@hookform/resolvers/zod'
import { MForm } from 'components/lib/MForm'
import { MSelect } from 'components/lib/MSelect'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { generateOnboardingUrlSchema } from 'schemas'
import { useUser } from 'stores/user'
import { z } from 'zod'
import { trpcClient } from 'utils/trpc'
import { copyToClip } from 'utils/helpers'
import { useAlert } from 'components/lib/store/alerts'
import { useAtomValue } from 'jotai'
import { instituteBatches, instituteCourses, instituteDepartments } from 'stores/institute'

interface Props {}

export const GenerateUrlDialog: React.FC<Props> = () => {
  const userData = useUser()
  const setAlert = useAlert()
  const departments = useAtomValue(instituteDepartments)
  const batches = useAtomValue(instituteBatches)
  const courses = useAtomValue(instituteCourses)

  const departmentOptions = useMemo(
    () => departments.map((dept) => ({ label: dept.name, value: dept.id })),
    [departments],
  )
  const batchOptions = useMemo(() => batches.map((batch) => ({ label: batch.name, value: batch.id })), [batches])
  const courseOptions = useMemo(
    () => courses.map((course) => ({ label: course.programName, value: course.id })),
    [courses],
  )

  const form = useForm<z.infer<typeof generateOnboardingUrlSchema>>({
    resolver: zodResolver(generateOnboardingUrlSchema),
    defaultValues: {
      instituteId: userData.instituteId as number,
      name: userData?.owner?.name,
    },
    shouldFocusError: true,
  })

  const { formState, handleSubmit } = form

  async function generateUrl(data: z.infer<typeof generateOnboardingUrlSchema>) {
    try {
      const payload = await trpcClient.mutation('institute.gen_onboarding_token', data)

      const { origin } = location

      const url = `${origin}/student/onboarding?${new URLSearchParams({ payload }).toString()}`

      void copyToClip(url).then(() => setAlert({ message: 'Signup link copied to clipboard !', type: 'success' }))
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Unable to generate URL',
      })
    }
  }

  return (
    <MForm form={form} className="flex w-full flex-col gap-2 sm:w-80" onSubmit={handleSubmit(generateUrl)}>
      <div className="text-lg">Generate URL</div>

      <MSelect
        name="departmentId"
        label="Department"
        options={departmentOptions}
        error={formState.errors.departmentId}
      />

      <MSelect name="batchId" label="Batch" options={batchOptions} error={formState.errors.batchId} />

      <MSelect name="courseId" label="Course" options={courseOptions} error={formState.errors.courseId} />

      <div className="flex justify-end">
        <button className="btn btn-outline btn-sm" type="submit">
          Copy to clipboard
        </button>
      </div>
    </MForm>
  )
}
