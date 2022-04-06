import { zodResolver } from '@hookform/resolvers/zod'
import type { StudentWorkExperience } from '@prisma/client'
import clsx from 'clsx'
import { MCheckbox } from 'components/lib/MCheckbox'
import { MDialog } from 'components/lib/MDialog'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import { useExperience } from 'contexts/student'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { createExperienceSchema } from 'schemas'
import { studentExperienceAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { INDUSTRY_TYPES } from 'utils/constnts'
import { formatDate } from 'utils/helpers'
import { z } from 'zod'
import { ExperienceCard } from './ExperienceCard'

interface Props {}

const JOB_TYPE = ['Internship', 'Full Time', 'Part Time', 'Others'].map((val) => ({ label: val, value: val }))
const COMPANY_TYPE_OPTIONS = INDUSTRY_TYPES.map((val) => ({ label: val, value: val }))
const STIPEND_OPTIONS = ['0-10K', '10-50K', '50K Plus'].map((value) => ({ label: value, value }))

export const WorkExperience: React.FC<Props> = () => {
  const workExperience = useAtomValue(studentExperienceAtom)
  const { create, update, isLoading } = useExperience()
  const userData = useUser()

  const [selectedExperience, setSelected] = useState<number | null>(null)
  const [isDialog, setDialog] = useState(false)

  const form = useForm<z.infer<typeof createExperienceSchema>>({
    resolver: zodResolver(createExperienceSchema.omit({ studentId: true })),
    defaultValues: {
      company: '',
      title: '',
      location: '',
      type: 'NA',
      jobType: '',
      companySector: '',
      stipend: '',
      notes: '',
      isCurriculum: true,
      isOngoing: false,
      endedAt: undefined,
    },
    shouldFocusError: true,
  })

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = form

  const isOngoingVal = useWatch({
    control,
    name: 'isOngoing',
  })

  async function submitHandler(val: z.infer<typeof createExperienceSchema>, createExp: boolean) {
    if (createExp && userData.studentId !== null) {
      await create({
        ...val,
        studentId: userData.studentId,
      })

      setDialog(false)
      resetForm()
    }

    if (!createExp && selectedExperience !== null) {
      await update({
        ...val,
        id: selectedExperience,
      })

      setDialog(false)
      resetForm()
    }
  }

  function handleExperienceSelection({ studentId: _sid, id, ...rest }: StudentWorkExperience) {
    setSelected(id)
    setDialog(true)

    Object.entries(rest).forEach(([key, value]) => {
      if (['verified', 'verifiedBy', 'verifiedOn'].includes(key)) return

      // ! This is an issue with native date input
      // ! The element expects an output/input in the format YYYY-MM-DD but it shows as MM/DD/YYYY inside the element
      setValue(key as any, ['startedAt', 'endedAt'].includes(key) ? formatDate(value, 'YYYY-MM-DD') : value)
    })
  }

  function resetForm() {
    reset()
    setSelected(null)
  }

  // TODO: add delete and document upload
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-6 text-gray-900">Work experience</div>
        <button className="gap-2 flex-start btn btn-sm btn-secondary" onClick={() => setDialog(true)}>
          <span>
            <IconLaPlusCircle />
          </span>
          <span>Add new Experience</span>
        </button>
      </div>

      {workExperience.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 grid-col-1">
          {workExperience.map((exp) => {
            return <ExperienceCard experience={exp} key={exp.id} onClick={() => handleExperienceSelection(exp)} />
          })}
        </div>
      ) : (
        <h4> You have not added any experience yet !</h4>
      )}

      <MDialog
        show={isDialog}
        onClose={() => {
          setDialog(false)
          resetForm()
        }}
      >
        <div className="flex flex-col gap-2">
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit((data) => {
                void submitHandler(data, selectedExperience === null)
              })}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <MInput
                    {...register('company')}
                    error={errors.company}
                    label="Company / Institute name"
                    name="company"
                    placeholder="Acme Inc."
                  />

                  <MInput
                    {...register('title')}
                    error={errors.title}
                    label="Title / Designation"
                    name="title"
                    placeholder="Business analyst"
                  />

                  <MInput
                    {...register('location')}
                    error={errors.location}
                    label="Location"
                    name="location"
                    placeholder="Location"
                  />

                  <MInput
                    error={errors.startedAt}
                    {...register('startedAt')}
                    name="startedAt"
                    label="Started at"
                    type="date"
                  />

                  <MCheckbox
                    control={control}
                    error={errors.isOngoing}
                    name="isOngoing"
                    label="I currently work here"
                  />
                </div>

                <div>
                  <MSelect
                    error={errors.companySector}
                    label="Company sector"
                    name="companySector"
                    options={COMPANY_TYPE_OPTIONS}
                  />

                  <MSelect error={errors.stipend} label="Stipend" name="stipend" options={STIPEND_OPTIONS} />

                  <MSelect error={errors.jobType} label="Position type" name="jobType" options={JOB_TYPE} />

                  {isOngoingVal === false && (
                    // TODO: enforce required when true
                    <MInput
                      error={errors.endedAt}
                      {...register('endedAt')}
                      name="endedAt"
                      label="Ended at"
                      type="date"
                    />
                  )}

                  <MCheckbox
                    control={control}
                    error={errors.isCurriculum}
                    name="isCurriculum"
                    label="Included in curriculam"
                  />
                </div>
              </div>

              <MInput {...register('notes')} error={errors.notes} as="textarea" label="Description" name="notes" />
              <div className="text-right">
                <button
                  type="submit"
                  className={clsx(['mt-5 btn btn-sm btn-primary', isLoading === true && 'loading'])}
                >
                  Save
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </MDialog>
    </div>
  )
}
