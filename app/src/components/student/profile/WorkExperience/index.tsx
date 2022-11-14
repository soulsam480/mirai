import { zodResolver } from '@hookform/resolvers/zod'
import type { StudentWorkExperience } from '@prisma/client'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import omit from 'lodash/omit'
import React, { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { useExperience } from '../../../../contexts'
import { createExperienceSchema } from '@mirai/schema'
import { studentExperienceAtom, useUser } from '../../../../stores'
import { OverWrite, StudentProfileIgnore } from '../../../../types'
import { formatDate, getDiff, INDUSTRY_TYPES, STUDENT_PROFILE_IGNORE_KEYS } from '../../../../utils'
import { MCheckbox, MDialog, MForm, MInput, MSearch, MSelect } from '../../../lib'
import { ExperienceCard } from './ExperienceCard'
import IconPhPlus from '~icons/ph/plus'

interface Props {}

const JOB_TYPE = ['Internship', 'Full Time', 'Part Time', 'Others'].map((val) => ({ label: val, value: val }))
const COMPANY_TYPE_OPTIONS = INDUSTRY_TYPES.map((val) => ({ label: val, value: val }))
const STIPEND_OPTIONS = ['0-10K', '10-50K', '50K Plus'].map((value) => ({ label: value, value }))

type StudentWorkExperienceDateStrings = Omit<
  OverWrite<StudentWorkExperience, { startedAt: string; endedAt: string | null }>,
  StudentProfileIgnore
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

  const { control, handleSubmit, reset, setValue, setError } = form

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

      currExp = omit(currExp, [...STUDENT_PROFILE_IGNORE_KEYS, 'studentId', 'id']) as StudentWorkExperienceDateStrings

      const diff = getDiff(currExp, val)

      await update({
        ...diff,
        id: selectedExperience,
      })

      setDialog(false)
      resetForm()
    }
  }

  function handleExperienceSelection(
    { studentId: _sid, id, verified, verifiedBy, verifiedOn, ...rest }: StudentWorkExperience,
    readonly = false,
  ) {
    setSelected(id)
    setDialog(true)
    readonly && setReadonly(true)

    if (verified || verifiedBy !== null || verifiedOn !== null) return

    const { startedAt, endedAt, ...workExpDetails } = rest

    reset({
      ...workExpDetails,
      startedAt: formatDate(startedAt, 'YYYY-MM-DD') ?? undefined,
      endedAt: formatDate(endedAt, 'YYYY-MM-DD') ?? undefined,
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
        <div className="text-lg font-medium leading-6">Work experience</div>
        <button className="flex-start btn-ghost btn-sm btn gap-2" onClick={() => setDialog(true)}>
          <span>
            <IconPhPlus />
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
          <div className="text-lg font-medium leading-6">Work experience</div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <MInput label="Company / Institute name" name="company" placeholder="Acme Inc." disabled={isReadonly} />

              <MInput label="Title / Designation" name="title" placeholder="Business analyst" disabled={isReadonly} />

              <MInput label="Location" name="location" placeholder="Location" disabled={isReadonly} />

              <MInput name="startedAt" label="Started at" type="date" disabled={isReadonly} />

              <MCheckbox name="isOngoing" label="I currently work here" disabled={isReadonly} />
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

              <MSelect label="Stipend" name="stipend" options={STIPEND_OPTIONS} disabled={isReadonly} />

              <MSelect label="Position type" name="jobType" options={JOB_TYPE} disabled={isReadonly} />

              {isOngoingVal === false && <MInput name="endedAt" label="Ended at" type="date" disabled={isReadonly} />}

              <MCheckbox name="isCurriculum" label="Included in curriculam" disabled={isReadonly} />
            </div>
          </div>

          <MInput as="textarea" label="Description" name="notes" disabled={isReadonly} />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDialog(false)
                resetForm()
              }}
              className="btn-outline btn-sm btn mt-5"
            >
              Cancel
            </button>

            {!isReadonly && (
              <button type="submit" className={clsx(['btn-sm btn mt-5', isLoading && 'loading'])}>
                Save
              </button>
            )}
          </div>
        </MForm>
      </MDialog>
    </div>
  )
}
