import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { MDialog } from 'components/lib/MDialog'
import MFeatureCard from 'components/lib/MFeatureCard'
import { MForm } from 'components/lib/MForm'
import { MIcon } from 'components/lib/MIcon'
import { MInput } from 'components/lib/MInput'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { semUpdateSchema } from 'schemas'
import { studentCourseAtom, studentScoreAtom, StudentSemScore } from 'stores/student'
import { formatDate, interpolate } from 'utils/helpers'
import { z } from 'zod'

interface Props {
  onSemUpdate: (semId: number, data: z.infer<typeof semUpdateSchema>) => void
}

const SCORE_RENDER_COLS: Record<string, string> = {
  semScore: 'Semester score ({{ scoreType }})',
  cummScore: 'Total score ({{ scoreType }})',
  ongoingBacklogs: 'Ongoing backlogs',
  totalBacklogs: 'Total backlogs',
  fileUrl: 'Mark sheet link',
  _update: 'update',
}

export const CourseCard: React.FC<Props> = ({ onSemUpdate }) => {
  const courseData = useAtomValue(studentCourseAtom)
  const studentScore = useAtomValue(studentScoreAtom)

  const [showDialog, setDialog] = useState(false)
  const [selectedSem, setSelectedSem] = useState<number | null>(null)

  const form = useForm<z.infer<typeof semUpdateSchema>>({
    resolver: zodResolver(semUpdateSchema),
    defaultValues: {
      backlogDetails: '',
      cummScore: '0',
      semScore: '0',
      ongoingBacklogs: '0',
      totalBacklogs: '0',
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = form

  if (courseData === null) return null

  return (
    <MFeatureCard.Parent>
      <MDialog show={showDialog} onClose={() => null} noEscape>
        <MForm
          form={form}
          onSubmit={handleSubmit((data) => {
            if (selectedSem === null) return
            onSemUpdate(selectedSem, data)
            setSelectedSem(null)
            reset()
            setDialog(false)
          })}
          className="flex flex-col gap-2 sm:w-[400px] sm:max-w-[400px]"
        >
          <div className="text-lg font-medium leading-6">
            Updating semester {'#'}
            {selectedSem}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.keys(SCORE_RENDER_COLS).map((key) => {
              if (key === '_update') return null

              return (
                <MInput
                  {...register(key as any)}
                  error={errors[key as keyof typeof errors]}
                  label={interpolate(SCORE_RENDER_COLS[key], courseData.course)}
                  name={key}
                  key={key}
                  type={!['backlogDetails', 'fileUrl'].includes(key) ? 'number' : 'string'}
                />
              )
            })}
          </div>

          <MInput
            {...register('backlogDetails')}
            error={errors.backlogDetails}
            label="Backlog details"
            name="backlogDetails"
            as="textarea"
          />

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setDialog(false)
                setSelectedSem(null)
              }}
              type="button"
            >
              Cancel
            </button>

            <button className="btn btn-sm" type="submit">
              Save
            </button>
          </div>
        </MForm>
      </MDialog>

      <MFeatureCard.Body>
        <div className="text-lg">
          {courseData.course.programName}, {courseData.course.branchName}
        </div>

        <div className="text-sm text-base-content/60">
          {courseData.department.name} | {courseData.batch.name} Batch (
          {formatDate(courseData.batch.startsAt, 'MMM YYYY')} - {formatDate(courseData.batch.endsAt, 'MMM YYYY')})
        </div>
        <div className="text-sm text-base-content/60">{courseData.institute.name}</div>

        <div className="mt-3">Score card</div>

        <div className="flex rounded-md border border-base-300 text-sm">
          <div className="flex flex-none flex-col border-r border-base-300">
            <div className="border-b border-base-300 p-2 last:border-0">Semester</div>

            {Object.keys(SCORE_RENDER_COLS).map((key) => (
              <div key={key} className="border-b border-base-300 p-2 last:border-0">
                {key === '_update' ? '' : interpolate(SCORE_RENDER_COLS[key], courseData.course)}
              </div>
            ))}
          </div>

          <div className="grid flex-grow auto-cols-auto grid-flow-col">
            {/* semesters */}
            {Array.from(Array(courseData.course.programDuration)).map((_, idx) => {
              const semId = idx + 1

              return (
                <div key={idx} className="flex flex-col border-r border-base-300 last:border-none">
                  <div className="border-b border-base-300 p-2 text-center">{semId}</div>

                  {/* score columns */}
                  {Object.keys(SCORE_RENDER_COLS).map((key) => (
                    <div
                      key={key}
                      className={clsx([
                        'flex justify-center border-b border-base-300 last:border-0',
                        key !== '_update' ? 'p-2' : 'p-0.5',
                      ])}
                    >
                      {key === '_update' ? (
                        <button
                          className="btn btn-ghost btn-circle btn-sm"
                          onClick={() => {
                            setSelectedSem(semId)
                            reset(studentScore?.scores?.[String(semId)])
                            setDialog(true)
                          }}
                        >
                          <MIcon data-tip={`Update semester ${semId} score`} className="tooltip-top tooltip">
                            <IconLaPenSquare />
                          </MIcon>
                        </button>
                      ) : (
                        studentScore?.scores?.[String(semId)]?.[key as keyof StudentSemScore] ?? '-'
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </MFeatureCard.Body>
    </MFeatureCard.Parent>
  )
}
