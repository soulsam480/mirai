import type { StudentBasics } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { MDialog } from 'components/lib/MDialog'
import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import { useBasics } from 'contexts/student/basics'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createStudentBasicsSchema } from 'schemas'
import { studentBasicsAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { z } from 'zod'
import { BasicsCard } from './BasicsCard'
import { formatDate } from 'utils/helpers'

interface Props {}

const genderTypes = ['MALE', 'FEMALE', 'OTHER'].map((o) => ({ label: o, value: o }))

export const Basics: React.FC<Props> = () => {
  const studentBasics = useAtomValue(studentBasicsAtom)
  console.log('studentBasics: ', studentBasics)
  const { manage, isLoading } = useBasics()
  const userData = useUser()

  const [isDialog, setDialog] = useState(false)

  const form = useForm<z.infer<typeof createStudentBasicsSchema>>({
    resolver: zodResolver(createStudentBasicsSchema.omit({ studentId: true })),
    defaultValues: {
      name: '',
      dob: undefined,
      category: '', // todo: what should be the values?
      gender: '',
      mobileNumber: '',
      primaryEmail: '',
      secondaryEmail: '',
      currentAddress: '',
      permanentAddress: '',
    },
    shouldFocusError: true,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = form

  async function submitHandler(val: z.infer<typeof createStudentBasicsSchema>) {
    await manage({
      ...val,
      studentId: userData.studentId as number,
    })
    setDialog(false)
    resetForm()
  }

  const editBasics = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, studentId, ...rest } = studentBasics as StudentBasics
    Object.entries(rest).forEach(([key, value]) => {
      setValue(key as any, key === 'dob' ? formatDate(value, 'YYYY-MM-DD') : value)
    })
  }

  function resetForm() {
    reset()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-6 text-gray-900">Student Basics</div>
        <button
          className="gap-2 flex-start btn btn-sm btn-secondary"
          onClick={() => {
            editBasics()
            setDialog(true)
          }}
        >
          <span>
            <IconLaPlusCircle />
          </span>
          <span>Edit student basics</span>
        </button>
      </div>

      {studentBasics !== null && <BasicsCard studentBasics={studentBasics} />}

      <MDialog
        show={isDialog}
        onClose={() => {
          setDialog(false)
          resetForm()
        }}
      >
        <MForm
          form={form}
          onSubmit={handleSubmit((data) => {
            void submitHandler(data)
          })}
          className="flex flex-col gap-2 sm:w-[700px] sm:max-w-[700px]"
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
            <MInput
              {...register('name')}
              error={errors.name}
              label="Student name"
              name="name"
              placeholder="Alan Stone"
            />

            <MInput
              error={errors.dob}
              {...register('dob', {
                validate(val) {
                  return new Date(val) instanceof Date
                },
              })}
              name="dob"
              label="Date of birth"
              type="date"
            />

            <MInput
              {...register('category')}
              error={errors.category}
              label="Category"
              name="category"
              placeholder="General"
            />

            <MSelect name="gender" label="Gender" options={genderTypes} error={errors.gender} />

            <MInput
              {...register('mobileNumber')}
              type="number"
              error={errors.mobileNumber}
              label="Mobile Number"
              name="mobileNumber"
              placeholder="+91 XXXXXX2896"
            />

            <MInput
              {...register('primaryEmail')}
              type="email"
              error={errors.primaryEmail}
              label="Primary email"
              name="primaryEmail"
              placeholder="alanstone@mirai.com"
            />

            <MInput
              {...register('secondaryEmail')}
              type="email"
              error={errors.secondaryEmail}
              label="Secondary email"
              name="secondaryEmail"
              placeholder="astone.workspace@mirai.com"
            />
          </div>

          <MInput
            {...register('currentAddress')}
            as="textarea"
            error={errors.currentAddress}
            label="Current address"
            name="currentAddress"
          />

          <MInput
            {...register('permanentAddress')}
            as="textarea"
            error={errors.permanentAddress}
            label="Permanent address"
            name="permanentAddress"
          />

          <div className="text-right">
            <button type="submit" className={clsx(['mt-5 btn btn-sm btn-primary', isLoading === true && 'loading'])}>
              Save
            </button>
          </div>
        </MForm>
      </MDialog>
    </div>
  )
}
