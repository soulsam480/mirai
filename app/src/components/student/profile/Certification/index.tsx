import { zodResolver } from '@hookform/resolvers/zod'
import type { StudentCertification } from '@prisma/client'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import omit from 'lodash/omit'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCertification } from '../../../../contexts'
import { createCertificationSchema } from '../../../../schemas'
import { studentCertificationsAtom, useUser } from '../../../../stores'
import { OverWrite, StudentProfileIgnore } from '../../../../types'
import { formatDate, getDiff, STUDENT_PROFILE_IGNORE_KEYS } from '../../../../utils'
import { MDialog, MForm, MInput, MSelect } from '../../../lib'
import { CertificationCard } from './CertificationCard'
import IconPhPlus from '~icons/ph/plus'

interface Props {}

const SCORE_TYPE = ['PERCENTAGE', 'CGPA', 'GRADES'].map((val) => ({ label: val, value: val }))

type StudentCertificationDateStrings = Omit<
  OverWrite<StudentCertification, { date: string | null; expiresAt: string | null }>,
  StudentProfileIgnore
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

  const { handleSubmit, reset, setError } = form

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

      currExp = omit(currExp, [...STUDENT_PROFILE_IGNORE_KEYS, 'studentId', 'id']) as StudentCertificationDateStrings

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

    const { date, expiresAt, identificationNumber, ...certificationDetails } = rest

    reset({
      ...certificationDetails,
      identificationNumber: identificationNumber ?? undefined,
      date: formatDate(date, 'YYYY-MM-DD') ?? undefined,
      expiresAt: formatDate(expiresAt, 'YYYY-MM-DD') ?? undefined,
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
        <div className="text-lg font-medium leading-6    ">Certifications</div>
        <button className="flex-start btn btn-ghost btn-sm gap-2" onClick={() => setDialog(true)}>
          <span>
            <IconPhPlus />
          </span>
          <span>Add new certification</span>
        </button>
      </div>

      {certifications.length > 0 ? (
        <div className="grid-col-1 grid gap-2 sm:grid-cols-2">
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
          <div className="text-lg font-medium leading-6">Certification</div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <MInput label="Certification name" name="name" placeholder="Intermediate course" disabled={isReadonly} />

              <MInput label="Subject" name="subject" placeholder="Machine design" disabled={isReadonly} />

              <MSelect label="Score type" name="scoreType" options={SCORE_TYPE} disabled={isReadonly} reset />

              <MInput name="date" label="Issued at" type="date" disabled={isReadonly} />
            </div>

            <div>
              <MInput label="Institute name" name="institute" placeholder="Institute name" disabled={isReadonly} />

              <MInput label="Identification number" name="identificationNumber" disabled={isReadonly} />

              <MInput label="Score" name="score" disabled={isReadonly} />

              <MInput name="expiresAt" label="Expires at" type="date" disabled={isReadonly} />
            </div>
          </div>

          <MInput as="textarea" label="Description" name="description" disabled={isReadonly} />

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

            {!isReadonly && (
              <button type="submit" className={clsx(['btn btn-sm mt-5', isLoading && 'loading'])}>
                Save
              </button>
            )}
          </div>
        </MForm>
      </MDialog>
    </div>
  )
}
