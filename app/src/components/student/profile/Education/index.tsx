import dayjs from 'dayjs'
import clsx from 'clsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { StudentEducation } from '@prisma/client'
import { useAtomValue } from 'jotai'
import { omit } from 'lodash'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { EducationCard } from './EducationCard'
import { OverWrite } from '../../../../types'
import { studentEducationAtom, useUser } from '../../../../stores'
import { useEducation } from '../../../../contexts'
import { createStudentEducationSchema } from '../../../../schemas'
import { formatDate, getDiff } from '../../../../utils'
import { MCheckbox, MDialog, MForm, MInput, MSelect } from '../../../lib'
import IconPhPlus from '~icons/ph/plus'

interface Props {}

const SCORE_TYPE = ['PERCENTAGE', 'CGPA', 'GRADES'].map((val) => ({ label: val, value: val }))
const EDUCATION_TYPE = ['Full Time', 'Part Time', 'Correspondence', 'Others'].map((val) => ({ label: val, value: val }))

type StudentEducationDateStrings = Omit<
  OverWrite<StudentEducation, { startedAt: string; endedAt: string | null }>,
  'verified' | 'verifiedBy' | 'verifiedOn'
>

export const Education: React.FC<Props> = () => {
  const education = useAtomValue(studentEducationAtom)
  const { create, update, isLoading } = useEducation()
  const userData = useUser()

  const [selectedEducation, setSelected] = useState<number | null>(null)
  const [isDialog, setDialog] = useState(false)
  const [isReadonly, setReadonly] = useState(false)

  const form = useForm<z.infer<typeof createStudentEducationSchema>>({
    resolver: zodResolver(createStudentEducationSchema.omit({ studentId: true })),
    defaultValues: {
      school: '',
      board: '',
      program: '',
      type: 'Full Time',
      specialization: '',
      scoreType: 'CGPA',
      score: '',
      scorePercentage: '',
      notes: '',
      startedAt: undefined,
      isOngoing: false,
      endedAt: null,
    },
    shouldFocusError: true,
  })

  const { control, handleSubmit, reset, setValue, setError } = form

  const isOngoingVal = useWatch({
    control,
    name: 'isOngoing',
  })

  const [edScoreType, score] = useWatch({
    control,
    name: ['scoreType', 'score'],
  })

  useEffect(() => {
    isOngoingVal === true && setValue('endedAt', '')
  }, [isOngoingVal, setValue])

  useEffect(() => {
    edScoreType === 'PERCENTAGE' && setValue('scorePercentage', score)
  }, [edScoreType, setValue, score])

  function resetForm() {
    reset()
    setSelected(null)
  }

  function validateEndedAt(val: z.infer<typeof createStudentEducationSchema>) {
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

  async function submitHandler(val: z.infer<typeof createStudentEducationSchema>, createEd: boolean) {
    if (!validateEndedAt(val)) return

    if (createEd && userData.studentId !== null) {
      await create({
        ...val,
        studentId: userData.studentId,
      })

      setDialog(false)
      resetForm()
    }

    if (!createEd && selectedEducation !== null) {
      // TODO: simplify setup to only update diff
      let currEd = education.find(({ id }) => id === selectedEducation) as unknown as StudentEducationDateStrings

      currEd = omit(currEd, ['verified', 'verifiedBy', 'verifiedOn', 'studentId', 'id']) as StudentEducationDateStrings

      const diff = getDiff(currEd, val)

      await update({
        ...diff,
        id: selectedEducation,
      })

      setDialog(false)
      resetForm()
    }
  }

  function handleEducationSelection(
    { studentId: _sid, id, verified, verifiedBy, verifiedOn, ...rest }: StudentEducation,
    readonly = false,
  ) {
    setSelected(id)
    setDialog(true)
    readonly && setReadonly(true)

    if (verified || verifiedBy !== null || verifiedOn !== null) return

    const { startedAt, endedAt, ...educationDetails } = rest

    reset({
      ...educationDetails,
      startedAt: formatDate(startedAt, 'YYYY-MM-DD') ?? undefined,
      endedAt: formatDate(endedAt, 'YYYY-MM-DD') ?? undefined,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-6">Education</div>
        <button className="flex-start btn btn-ghost btn-sm gap-2" onClick={() => setDialog(true)}>
          <span>
            <IconPhPlus />
          </span>
          <span>Add new Education</span>
        </button>
      </div>

      {education.length > 0 ? (
        <div className="grid-col-1 grid gap-2 sm:grid-cols-2">
          {education.map((edu) => {
            return <EducationCard education={edu} key={edu.id} onEdit={() => handleEducationSelection(edu)} />
          })}
        </div>
      ) : (
        <h4> You have not added any experience yet !</h4>
      )}

      <MDialog show={isDialog} onClose={() => null}>
        <MForm
          form={form}
          onSubmit={handleSubmit((data) => {
            void submitHandler(data, selectedEducation === null)
          })}
          className="flex flex-col gap-2 sm:w-[700px] sm:max-w-[700px]"
        >
          <div className="text-lg font-medium leading-6">Education</div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <MInput
                label="School / Institute name"
                name="school"
                placeholder="Global Academy"
                disabled={isReadonly}
              />

              <MInput label="Program/ Degree/ Certification" name="program" placeholder="10th" disabled={isReadonly} />

              <MSelect label="Education Type" name="type" options={EDUCATION_TYPE} disabled={isReadonly} />

              <MInput label="Score" name="score" placeholder="8.5 CGPA" disabled={isReadonly} />

              <MInput name="startedAt" label="Started at" type="date" disabled={isReadonly} />

              <MCheckbox name="isOngoing" label="I currently study here" disabled={isReadonly} />
            </div>
            <div>
              <MInput label="Board" name="board" placeholder="CBSE" disabled={isReadonly} />

              <MInput label="Specialization" name="specialization" placeholder="PCMB" disabled={isReadonly} />

              <MSelect label="Score Type" name="scoreType" options={SCORE_TYPE} disabled={isReadonly} />

              <MInput
                label="Score Percentage"
                name="scorePercentage"
                placeholder="78%"
                disabled={isReadonly || edScoreType === 'PERCENTAGE'}
              />

              {isOngoingVal === false && <MInput name="endedAt" label="Ended at" type="date" disabled={isReadonly} />}
            </div>
          </div>

          <MInput as="textarea" label="Description" name="notes" />

          {!isReadonly && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDialog(false)
                  resetForm()
                }}
                className="btn btn-outline btn-sm mt-5"
              >
                Cancel
              </button>

              <button type="submit" className={clsx(['btn btn-sm mt-5', isLoading && 'loading'])}>
                Save
              </button>
            </div>
          )}
        </MForm>
      </MDialog>
    </div>
  )
}
