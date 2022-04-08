import { zodResolver } from '@hookform/resolvers/zod'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import React from 'react'
import { useForm } from 'react-hook-form'
import { createStudentBasicsSchema } from 'schemas'
import { z } from 'zod'

interface Props {}

const genderTypes = ['MALE', 'FEMALE', 'OTHER'].map((o) => ({ label: o, value: o }))

export const Basics: React.FC<Props> = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof createStudentBasicsSchema>>({
    resolver: zodResolver(createStudentBasicsSchema.omit({ studentId: true })),
    defaultValues: {
      name: '',
      dob: '',
      category: '',
      gender: '',
      mobileNumber: '',
      primaryEmail: '',
      secondaryEmail: '',
      currentAddress: '',
      permanentAddress: '',
    },
    shouldFocusError: true,
  })

  function submitHandler(val: any) {
    // eslint-disable-next-line no-console
    console.log(val)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-4 text-lg font-medium leading-6 text-gray-900">Student Basics</div>

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
          <MInput {...register('name')} error={errors.name} label="Student name" name="name" placeholder="Alan Stone" />

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

          <MInput
            {...register('gender')}
            name="gender"
            label="Gender"
            // options={genderTypes}
            error={errors.gender}
          />

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
          <button type="submit" className="mt-5 btn btn-sm btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
