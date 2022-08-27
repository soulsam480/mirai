/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useBasics } from '../../../../contexts'
import { createStudentBasicsSchema } from '../../../../schemas'
import { StudentAddress, studentBasicsAtom, useUser } from '../../../../stores'
import { CATEGORY_TYPES, formatDate, GENDER_TYPES } from '../../../../utils'
import { MDialog, MForm, MInput, MSelect } from '../../../lib'
import { BasicsCard } from './BasicsCard'

interface Props {}

const ADDRES_FIELDS: Array<keyof StudentAddress> = ['address', 'city', 'district', 'state', 'pin', 'country']

const initialAddress = {
  address: '',
  city: '',
  district: '',
  state: '',
  pin: '',
  country: '',
}

const AddressLabels = {
  address: 'Address',
  city: 'City',
  district: 'District',
  state: 'State',
  pin: 'Pin code',
  country: 'Country',
}

export const Basics: React.FC<Props> = () => {
  const studentBasics = useAtomValue(studentBasicsAtom)
  const userData = useUser()
  const { manage, isLoading } = useBasics()

  const [isDialog, setDialog] = useState(false)
  const [dialogMode, setMode] = useState<'contact' | 'basics' | null>(null)
  const [sameAsPermanent, setSameAsPermanent] = useState(false)

  const form = useForm<z.infer<typeof createStudentBasicsSchema>>({
    resolver: zodResolver(createStudentBasicsSchema.omit({ studentId: true })),
    defaultValues: {
      name: '',
      category: '',
      gender: '',
      mobileNumber: '',
      primaryEmail: '',
      secondaryEmail: '',
      currentAddress: initialAddress,
      permanentAddress: initialAddress,
      dob: undefined,
    },
    shouldFocusError: true,
  })

  const { handleSubmit, setValue, getValues, setError, reset } = form

  useEffect(() => {
    if (studentBasics === null) return

    const { dob, currentAddress, permanentAddress } = studentBasics

    reset({
      ...studentBasics,
      dob: formatDate(dob, 'YYYY-MM-DD') ?? undefined,
      currentAddress: currentAddress ?? initialAddress,
      permanentAddress: permanentAddress ?? initialAddress,
    })
  }, [studentBasics, reset])

  function validateAddress(val: z.infer<typeof createStudentBasicsSchema>) {
    const validator = z.string().min(1, 'Field is required')
    let score = 0

    const { currentAddress = {}, permanentAddress = {} } = val

    ADDRES_FIELDS.forEach((field) => {
      if (!validator.safeParse(currentAddress[field]).success) {
        setError(`currentAddress.${field}`, { message: `${field} is required` })
        score++
      }

      if (!validator.safeParse(permanentAddress[field]).success) {
        setError(`permanentAddress.${field}`, { message: `${field} is required` })

        score++
      }
    })

    return score === 0
  }

  async function submitHandler(val: z.infer<typeof createStudentBasicsSchema>) {
    if (userData.studentId === null || !validateAddress(val)) return

    await manage({
      ...val,
      studentId: userData.studentId,
    })

    setDialog(false)
    setSameAsPermanent(false)
  }

  function handleTriggerDialog(mode: 'contact' | 'basics') {
    setMode(mode)
    setDialog(true)
  }

  function handleSameAddress(checked: boolean) {
    if (!checked) {
      ADDRES_FIELDS.forEach((field) => setValue(`currentAddress.${field}`, ''))

      setSameAsPermanent(false)

      return
    }

    const permanentAddress = getValues('permanentAddress')

    permanentAddress !== undefined &&
      ADDRES_FIELDS.forEach((field) => setValue(`currentAddress.${field}`, permanentAddress[field]))

    setSameAsPermanent(true)
  }

  // TODO: realtime sync of addresses

  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-medium leading-6">Basic info</div>

      <BasicsCard studentBasics={studentBasics} onTrigger={handleTriggerDialog} />

      <MDialog show={isDialog} onClose={() => null} noEscape>
        <MForm
          form={form}
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-2 sm:w-[700px] sm:max-w-[700px]"
        >
          <div className="text-lg font-medium leading-6 text-gray-900">Profile basics</div>
          {dialogMode === 'basics' && (
            <>
              <h4 className="text-left">Identity details</h4>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <MInput label="Student name" name="name" placeholder="Alan Stone" />

                <MInput name="dob" label="Date of birth" type="date" />

                <MSelect name="gender" label="Gender" options={GENDER_TYPES} />

                <MSelect name="category" label="Category" options={CATEGORY_TYPES} />
              </div>
            </>
          )}

          {dialogMode === 'contact' && (
            <>
              <h4 className="text-left">Contact details</h4>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <MInput label="Mobile Number" name="mobileNumber" placeholder="+91 XXXXXX2896" />

                <MInput type="email" label="Primary email" name="primaryEmail" placeholder="alanstone@mirai.com" />

                <MInput
                  type="email"
                  label="Secondary email"
                  name="secondaryEmail"
                  placeholder="astone.workspace@mirai.com"
                />
              </div>

              <div className="text-left text-base">Address details</div>

              <div className="text-left text-sm">Permanent address</div>

              <div className="grid grid-cols-1 gap-x-2 gap-y-1 sm:grid-cols-2">
                {ADDRES_FIELDS.map((field) => {
                  return (
                    <MInput
                      key={`permanentAddress.${field}`}
                      label={AddressLabels[field]}
                      name={`permanentAddress.${field}`}
                      placeholder={AddressLabels[field]}
                    />
                  )
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-left text-sm">Current address </div>

                <div className="form-control">
                  <label className="label flex cursor-pointer gap-2">
                    <span className="label-text">Same as permanent address</span>
                    <input
                      type="checkbox"
                      checked={sameAsPermanent}
                      className="checkbox checkbox-primary checkbox-sm"
                      onChange={({ target: { checked } }) => {
                        handleSameAddress(checked)
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-2 gap-y-1 sm:grid-cols-2">
                {ADDRES_FIELDS.map((field) => {
                  return (
                    <MInput
                      key={`currentAddress.${field}`}
                      label={AddressLabels[field]}
                      name={`currentAddress.${field}`}
                      placeholder={AddressLabels[field]}
                    />
                  )
                })}
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDialog(false)
                setSameAsPermanent(false)
              }}
              className="btn btn-outline btn-sm mt-5"
            >
              Cancel
            </button>

            <button type="submit" className={clsx(['btn btn-sm mt-5', isLoading && 'loading'])}>
              Save
            </button>
          </div>
        </MForm>
      </MDialog>
    </div>
  )
}
