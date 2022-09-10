import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAtomValue } from 'jotai'
import { instituteBatches, instituteCourses, instituteDepartments, useUser } from '../../../stores'
import { MForm, MSelect, useAlert } from '../../lib'
import { generateOnboardingUrlSchema } from '../../../schemas'
import { copyToClip, trpcClient } from '../../../utils'

interface Props {
  onClose: (val: boolean) => void
}

export const GenerateUrlDialog: React.FC<Props> = ({ onClose }) => {
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

  const { handleSubmit } = form

  async function generateUrl(data: z.infer<typeof generateOnboardingUrlSchema>) {
    try {
      const payload = await trpcClient.institute.gen_onboarding_token.mutate(data)

      const { origin } = location

      const url = `${origin}/student/onboarding?${new URLSearchParams({ payload }).toString()}`

      await copyToClip(url)
      setAlert({ message: 'Signup link copied to clipboard !', type: 'success' })

      onClose(false)
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

      <MSelect name="departmentId" label="Department" options={departmentOptions} />

      <MSelect name="batchId" label="Batch" options={batchOptions} />

      <MSelect name="courseId" label="Course" options={courseOptions} />

      <div className="flex justify-end">
        <button className="btn btn-outline btn-sm" type="submit">
          Copy to clipboard
        </button>
      </div>
    </MForm>
  )
}
