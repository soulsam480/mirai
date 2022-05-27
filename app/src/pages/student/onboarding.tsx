import { zodResolver } from '@hookform/resolvers/zod'
import { OnboardingPayload, onBoardingTokens } from '@mirai/api'
import { MBadge } from 'components/lib/MBadge'
import { MForm } from 'components/lib/MForm'
import { MIcon } from 'components/lib/MIcon'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import { useAlert } from 'components/lib/store/alerts'
import { useTicket } from 'contexts/useTicket'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { studentOnboardingSchema } from 'schemas'
import { CATEGORY_TYPES, GENDER_TYPES } from 'utils/constnts'
import { z } from 'zod'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps: GetServerSideProps<
  {
    error: string | null
  } & Partial<OnboardingPayload>
> = async ({ query }) => {
  const { payload } = query

  if (payload === undefined || typeof payload !== 'string') {
    return {
      props: {
        error: 'Onboarding URL is invalid. Please use correct onboarding URL',
      },
    }
  }

  try {
    const data = onBoardingTokens.decode(payload)

    return {
      props: {
        ...data,
        error: null,
      },
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        props: {
          error: 'Onboarding URL has expired',
        },
      }
    }

    if (error instanceof JsonWebTokenError) {
      return {
        props: {
          error: 'Onboarding URL is invalid. Please use correct onboarding URL',
        },
      }
    }

    return {
      props: {
        error: 'Unable to process Onboarding request',
      },
    }
  }
}

const StudentOnboarding: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  error,
  name,
  instituteId,
  ...rest
}) => {
  const [isSubmitted, setSubmitted] = useState<boolean>(false)
  const [tokenId, setTokenId] = useState<number | null>(null)
  const setAlert = useAlert()
  const { create } = useTicket()

  const form = useForm<z.infer<typeof studentOnboardingSchema>>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repassword: '',
      category: '',
      dob: '',
      gender: '',
      mobileNumber: '',
      batchId: rest.batchId,
      courseId: rest.courseId,
      departmentId: rest.departmentId,
    },
    shouldFocusError: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  useEffect(() => {
    if (error !== null) {
      setAlert({
        type: 'danger',
        message: error,
      })
    }
  }, [error, setAlert])

  async function submitOnboarding(data: z.infer<typeof studentOnboardingSchema>) {
    const { repassword: _repassword, ...studentDetails } = data

    try {
      const response = await create.mutateAsync({
        instituteId: Number(instituteId),
        meta: {
          data: studentDetails,
          type: 'STUDENT_ONBOARDING',
        },
        status: 'OPEN',
      })

      setTokenId(response.id)

      setSubmitted(true)
    } catch (_error) {}
  }

  if (error !== null) {
    return (
      <div className="my-10 mx-4 flex flex-col items-center">
        <div className="alert alert-error font-semibold shadow-lg sm:max-w-[600px]">
          <div>
            <MIcon>
              <IconPhWarningCircle />
            </MIcon>
            <span>{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <MForm
        className="form-control m-2 flex rounded-xl bg-base-200 p-8 shadow md:w-[700px]"
        onSubmit={handleSubmit(submitOnboarding)}
        form={form}
      >
        {!isSubmitted ? (
          <>
            <span className="p-4 text-center text-2xl font-bold	text-secondary-focus sm:text-3xl">
              <div>Welcome to Mirai! </div>
              <div>You were invited by {name}</div>
            </span>
            <div className="text-center text-lg">Please fill the form below</div>

            <div className="grid grid-cols-1 gap-x-2 gap-y-1 sm:grid-cols-2 ">
              <MInput label="Name" {...register('name')} placeholder="Sachin Mishra" error={errors.name} />

              <MInput
                label="Email"
                type="email"
                {...register('email')}
                placeholder="smishra@gmail.com"
                error={errors.email}
              />

              <MInput error={errors.dob} {...register('dob')} name="dob" label="Date of birth" type="date" />

              <MInput
                error={errors.uniId}
                {...register('uniId')}
                name="uniId"
                label="University ID"
                placeholder="23f32r23rf2r3r"
                hint="Make sure the ID is correct and belongs to you !"
              />

              <MInput
                label="Password"
                type="password"
                {...register('password')}
                placeholder="xxxxxxxxxxx"
                error={errors.password}
                hint="Don't worry, you password is encrypted and safe !"
              />

              <MInput
                label="Repeat Password"
                type="password"
                {...register('repassword')}
                placeholder="xxxxxxxxxxx"
                error={errors.repassword}
              />

              <MSelect name="gender" label="Gender" options={GENDER_TYPES} error={errors.gender} />

              <MInput
                label="Mobile number"
                {...register('mobileNumber')}
                placeholder="+91 873566556"
                error={errors.mobileNumber}
              />

              <MSelect name="category" label="Category" options={CATEGORY_TYPES} error={errors.category} />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button type="submit" className="btn btn-sm mt-5">
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="text-lg">
              Congrats ! your registration was successful with reference number{' '}
              <MBadge className="rounded-full font-bold">{tokenId}</MBadge>
            </div>

            <div className="text-sm">
              Please save it for further reference and wait for a confirmation email from your institute to get started
              on Mirai.
            </div>
          </div>
        )}
      </MForm>
    </div>
  )
}

export default StudentOnboarding
