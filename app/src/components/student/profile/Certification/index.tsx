import { zodResolver } from '@hookform/resolvers/zod'
import type { StudentCertification } from '@prisma/client'
import clsx from 'clsx'
import { MDialog } from 'components/lib/MDialog'
import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import { useCertification } from 'contexts/student'
import { useAtomValue } from 'jotai'
import omit from 'lodash/omit'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createCertificationSchema } from 'schemas'
import { studentCertificationsAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { OverWrite } from 'types'
import { formatDate, getDiff } from 'utils/helpers'
import { z } from 'zod'
import { CertificationCard } from './CertificationCard'

interface Props {}

const SCORE_TYPE = ['PERCENTAGE', 'CGPA', 'GRADES'].map((val) => ({ label: val, value: val }))

type StudentCertificationDateStrings = Omit<
  OverWrite<StudentCertification, { date: string | null; expiresAt: string | null }>,
  'verified' | 'verifiedBy' | 'verifiedOn'
>

export const Certifications: React.FC<Props> = () => {
  const certifications = useAtomValue(studentCertificationsAtom)
  const { create, update, isLoading } = useCertification()
  const userData = useUser()

  const [selectedCert, setSelected] = useState<number | null>(null)
  const [isDialog, setDialog] = useState(false)
  const [isReadonly, setReadonly] = useState(false)

  const form = useForm<z.infer<typeof createCertificationSchema>>({
    resolver: zodResolver(createCertificationSchema.omit({ studentId: true })),
    defaultValues: {
      name: '',
      subject: '',
      institute: '',
      documentName: 'NA',
      identificationNumber: '',
      score: '',
      description: '',
      scoreType: null,
    },
    shouldFocusError: true,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    setError,
  } = form

  function validateNullable(val: z.infer<typeof createCertificationSchema>) {
    const { score, scoreType } = val

    let valScore = 0

    if (z.string().min(1).safeParse(score).success && (scoreType === null || scoreType?.length === 0)) {
      setError('scoreType', { message: 'Score type is required !' })
      valScore++
    }

    if (z.string().min(1).safeParse(scoreType).success && (score === null || score?.length === 0)) {
      setError('score', { message: 'Score is required !' })
      valScore++
    }

    return valScore === 0
  }

  async function submitHandler(val: z.infer<typeof createCertificationSchema>, createExp: boolean) {
    if (!validateNullable(val)) return

    if (createExp && userData.studentId !== null) {
      await create({
        ...val,
        studentId: userData.studentId,
      })

      setDialog(false)
      resetForm()
    }

    if (!createExp && selectedCert !== null) {
      // TODO: simplify setup to only update diff
      let currExp = certifications.find(({ id }) => id === selectedCert) as unknown as StudentCertificationDateStrings

      currExp = omit(currExp, [
        'verified',
        'verifiedBy',
        'verifiedOn',
        'studentId',
        'id',
      ]) as StudentCertificationDateStrings

      const diff = getDiff(currExp, val)

      await update({
        ...diff,
        id: selectedCert,
      })

      setDialog(false)
      resetForm()
    }
  }

  function handleCertSelection({ studentId: _sid, id, ...rest }: StudentCertification, readonly = false) {
    setSelected(id)
    setDialog(true)
    readonly && setReadonly(true)

    Object.entries(rest).forEach(([key, value]) => {
      if (['verified', 'verifiedBy', 'verifiedOn'].includes(key)) return

      // ! This is an issue with native date input
      // ! The element expects an output/input in the format YYYY-MM-DD but it shows as MM/DD/YYYY inside the element
      setValue(key as any, ['date', 'expiresAt'].includes(key) ? formatDate(value, 'YYYY-MM-DD') : value)
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
        <div className="text-lg font-medium leading-6 text-gray-900">Certifications</div>
        <button className="gap-2 flex-start btn btn-sm btn-secondary" onClick={() => setDialog(true)}>
          <span>
            <IconLaPlusCircle />
          </span>
          <span>Add new certification</span>
        </button>
      </div>

      {certifications.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 grid-col-1">
          {certifications.map((cert) => {
            return (
              <CertificationCard
                certification={cert}
                key={cert.id}
                onEdit={(readOnly) => handleCertSelection(cert, readOnly)}
              />
            )
          })}
        </div>
      ) : (
        <h4> You have not added any certification yet !</h4>
      )}

      <MDialog show={isDialog} onClose={() => null} noEscape>
        <MForm
          form={form}
          onSubmit={handleSubmit((data) => {
            void submitHandler(data, selectedCert === null)
          })}
          className="flex flex-col gap-2 md:w-[700px] md:max-w-[700px]"
        >
          <div className="text-lg font-medium leading-6 text-gray-900">Certification</div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <MInput
                {...register('name')}
                error={errors.name}
                label="Certification name"
                name="name"
                placeholder="Intermediate course"
                disabled={isReadonly}
              />

              <MInput
                {...register('subject')}
                error={errors.subject}
                label="Subject"
                name="subject"
                placeholder="Machine design"
                disabled={isReadonly}
              />

              <MSelect
                error={errors.scoreType}
                label="Score type"
                name="scoreType"
                options={SCORE_TYPE}
                disabled={isReadonly}
                reset
              />

              <MInput
                error={errors.date}
                {...register('date')}
                name="date"
                label="Issued at"
                type="date"
                disabled={isReadonly}
              />
            </div>

            <div>
              <MInput
                {...register('institute')}
                error={errors.institute}
                label="Institute name"
                name="institute"
                placeholder="Institute name"
                disabled={isReadonly}
              />

              <MInput
                {...register('identificationNumber')}
                error={errors.identificationNumber}
                label="Identification number"
                name="identificationNumber"
                placeholder="WKBR2J3BJB234JR3"
                disabled={isReadonly}
              />

              <MInput {...register('score')} error={errors.score} label="Score" name="score" disabled={isReadonly} />

              <MInput
                error={errors.expiresAt}
                {...register('expiresAt')}
                name="expiresAt"
                label="Expires at"
                type="date"
                disabled={isReadonly}
              />
            </div>
          </div>

          <MInput
            {...register('description')}
            error={errors.description}
            as="textarea"
            label="Description"
            name="description"
            disabled={isReadonly}
          />

          {!isReadonly && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDialog(false)
                  resetForm()
                }}
                className="mt-5 btn btn-sm btn-primary btn-outline"
              >
                Cancel
              </button>

              <button type="submit" className={clsx(['mt-5 btn btn-sm btn-primary', isLoading === true && 'loading'])}>
                Save
              </button>
            </div>
          )}
        </MForm>
      </MDialog>
    </div>
  )
}
