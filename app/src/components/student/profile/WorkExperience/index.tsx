import { zodResolver } from '@hookform/resolvers/zod'
import type { StudentWorkExperience } from '@prisma/client'
import clsx from 'clsx'
import { MCheckbox } from 'components/lib/MCheckbox'
import { MDialog } from 'components/lib/MDialog'
import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { MSearch } from 'components/lib/MSearch'
import { MSelect } from 'components/lib/MSelect'
import { useExperience } from 'contexts/student'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import omit from 'lodash/omit'
import React, { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { createExperienceSchema } from 'schemas'
import { studentExperienceAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { OverWrite } from 'types'
import { INDUSTRY_TYPES } from 'utils/constnts'
import { formatDate, getDiff } from 'utils/helpers'
import { z } from 'zod'
import { ExperienceCard } from './ExperienceCard'

interface Props {}

const JOB_TYPE = ['Internship', 'Full Time', 'Part Time', 'Others'].map((val) => ({ label: val, value: val }))
const COMPANY_TYPE_OPTIONS = INDUSTRY_TYPES.map((val) => ({ label: val, value: val }))
const STIPEND_OPTIONS = ['0-10K', '10-50K', '50K Plus'].map((value) => ({ label: value, value }))

type StudentWorkExperienceDateStrings = Omit<
  OverWrite<StudentWorkExperience, { startedAt: string; endedAt: string | null }>,
  'verified' | 'verifiedBy' | 'verifiedOn'
>

export const WorkExperience: React.FC<Props> = () => {
  const workExperience = useAtomValue(studentExperienceAtom)
  const { create, update, isLoading } = useExperience()
  const userData = useUser()

  const [selectedExperience, setSelected] = useState<number | null>(null)
  const [isDialog, setDialog] = useState(false)
  const [isReadonly, setReadonly] = useState(false)

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
    setError,
  } = form

  const isOngoingVal = useWatch({
    control,
    name: 'isOngoing',
  })

  useEffect(() => {
    isOngoingVal === true && setValue('endedAt', '')
  }, [isOngoingVal, setValue])

  function validateEndedAt(val: z.infer<typeof createExperienceSchema>) {
    const { endedAt, startedAt, isOngoing } = val

    if (isOngoing === true) return true

    if (endedAt === null || endedAt.length === 0) {
      setError('endedAt', { message: 'Ended at is required' })

      return false
    }

    if (startedAt?.length > 0 && !dayjs(startedAt).isBefore(dayjs(endedAt))) {
      setError('endedAt', { message: "Ended at can't be before Started at" })

      return false
    }

    return true
  }

  async function submitHandler(val: z.infer<typeof createExperienceSchema>, createExp: boolean) {
    if (!validateEndedAt(val)) return

    if (createExp && userData.studentId !== null) {
      await create({
        ...val,
        studentId: userData.studentId,
      })

      setDialog(false)
      resetForm()
    }

    if (!createExp && selectedExperience !== null) {
      // TODO: simplify setup to only update diff
      let currExp = workExperience.find(
        ({ id }) => id === selectedExperience,
      ) as unknown as StudentWorkExperienceDateStrings

      currExp = omit(currExp, [
        'verified',
        'verifiedBy',
        'verifiedOn',
        'studentId',
        'id',
      ]) as StudentWorkExperienceDateStrings

      const diff = getDiff(currExp, val)

      await update({
        ...diff,
        id: selectedExperience,
      })

      setDialog(false)
      resetForm()
    }
  }

  function handleExperienceSelection({ studentId: _sid, id, ...rest }: StudentWorkExperience, readonly = false) {
    setSelected(id)
    setDialog(true)
    readonly && setReadonly(true)

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

  // TODO: add document upload
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-6 text-gray-900">Work experience</div>
        <button className="flex-start btn btn-secondary btn-sm gap-2" onClick={() => setDialog(true)}>
          <span>
            <IconLaPlusCircle />
          </span>
          <span>Add new Experience</span>
        </button>
      </div>

      {workExperience.length > 0 ? (
        <div className="grid-col-1 grid gap-2 sm:grid-cols-2">
          {workExperience.map((exp) => {
            return (
              <ExperienceCard
                experience={exp}
                key={exp.id}
                onEdit={(readOnly) => handleExperienceSelection(exp, readOnly)}
              />
            )
          })}
        </div>
      ) : (
        <h4> You have not added any experience yet !</h4>
      )}

      <MDialog show={isDialog} onClose={() => null} noEscape>
        <MForm
          form={form}
          onSubmit={handleSubmit((data) => {
            void submitHandler(data, selectedExperience === null)
          })}
          className="flex flex-col gap-2 md:w-[700px] md:max-w-[700px]"
        >
          <div className="text-lg font-medium leading-6 text-gray-900">Work experience</div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <MInput
                {...register('company')}
                error={errors.company}
                label="Company / Institute name"
                name="company"
                placeholder="Acme Inc."
                disabled={isReadonly}
              />

              <MInput
                {...register('title')}
                error={errors.title}
                label="Title / Designation"
                name="title"
                placeholder="Business analyst"
                disabled={isReadonly}
              />

              <MInput
                {...register('location')}
                error={errors.location}
                label="Location"
                name="location"
                placeholder="Location"
                disabled={isReadonly}
              />

              <MInput
                error={errors.startedAt}
                {...register('startedAt')}
                name="startedAt"
                label="Started at"
                type="date"
                disabled={isReadonly}
              />

              <MCheckbox
                error={errors.isOngoing}
                name="isOngoing"
                label="I currently work here"
                disabled={isReadonly}
              />
            </div>

            <div>
              <MSearch
                label="Company sector"
                name="companySector"
                options={COMPANY_TYPE_OPTIONS}
                placeholder="Type to search.."
                disabled={isReadonly}
                reset
              />

              <MSelect
                error={errors.stipend}
                label="Stipend"
                name="stipend"
                options={STIPEND_OPTIONS}
                disabled={isReadonly}
              />

              <MSelect
                error={errors.jobType}
                label="Position type"
                name="jobType"
                options={JOB_TYPE}
                disabled={isReadonly}
              />

              {isOngoingVal === false && (
                <MInput
                  error={errors.endedAt}
                  {...register('endedAt')}
                  name="endedAt"
                  label="Ended at"
                  type="date"
                  disabled={isReadonly}
                />
              )}

              <MCheckbox
                error={errors.isCurriculum}
                name="isCurriculum"
                label="Included in curriculam"
                disabled={isReadonly}
              />
            </div>
          </div>

          <MInput
            {...register('notes')}
            error={errors.notes}
            as="textarea"
            label="Description"
            name="notes"
            disabled={isReadonly}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDialog(false)
                resetForm()
              }}
              className="btn-outline btn btn-primary btn-sm mt-5"
            >
              Cancel
            </button>

            {!isReadonly && (
              <button type="submit" className={clsx(['btn btn-primary btn-sm mt-5', isLoading === true && 'loading'])}>
                Save
              </button>
            )}
          </div>
        </MForm>
      </MDialog>
    </div>
  )
}
