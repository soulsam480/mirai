import { zodResolver } from '@hookform/resolvers/zod'
import { onBoardingTokens } from '@mirai/api'
import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { useAlert } from 'components/lib/store/alerts'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { studentOnboardingSchema } from 'schemas'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps: GetServerSideProps<{
  name?: string
  error: string | null
}> = async ({ query }) => {
  const { payload } = query

  if (payload === undefined || typeof payload !== 'string') {
    return {
      props: {
        error: 'Onboarding URL is invalid',
      },
    }
  }

  try {
    const data = onBoardingTokens.decode(payload)

    return {
      props: {
        name: data.name,
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
    } else if (error instanceof JsonWebTokenError) {
      return {
        props: {
          error: 'Onboarding URL is invalid',
        },
      }
    } else {
      return {
        props: {
          error: 'Unable to process Onboarding request',
        },
      }
    }
  }
}

const StudentOnboarding: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  error,
  name,
}) => {
  const setAlert = useAlert()

  const form = useForm({
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
    },
    shouldFocusError: true,
  })

  const { register, handleSubmit, formState } = form

  useEffect(() => {
    if (error !== null) {
      setAlert({
        type: 'danger',
        message: error,
      })
    }
  }, [error, setAlert])

  return (
    <>
      <div className="z-2 absolute top-0 left-0 right-0">
        <div className="navbar min-h-12 mb-2 rounded-none text-neutral">
          <div className="mx-2 flex-1">
            <Link href="/">
              <a className="text-lg font-bold text-base-100">Mirai</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="my-8 flex flex-col items-center justify-center">
        <MForm
          className="dialog-content form-control mt-16 flex w-full sm:w-[700px] sm:max-w-[700px]"
          onSubmit={() => {
            //
          }}
          form={form}
        >
          <span className="p-4 text-center text-center text-2xl font-bold	text-secondary-focus sm:text-3xl">
            <h1>Welcome to Mirai! </h1>
            <h1>You were invited by {name}</h1>
          </span>
          <h2 className="text-center text-center text-lg sm:text-xl">Please fill the form below</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
            <div>
              <MInput label="Name" {...register('name')} placeholder="Sachin Mishra" error={formState.errors.name} />

              <MInput
                label="New Password"
                type="password"
                {...register('password')}
                placeholder="xxxxxxxxxxx"
                error={formState.errors.password}
              />
            </div>
            <div>
              <MInput
                label="Email"
                type="email"
                {...register('email')}
                placeholder="smishra@gmail.com"
                error={formState.errors.email}
              />

              <MInput
                label="Repeat Password"
                type="repassword"
                {...register('repassword')}
                placeholder="xxxxxxxxxxx"
                error={formState.errors.repassword}
              />
            </div>

            <MInput
              label="Category"
              {...register('category')}
              placeholder="General"
              error={formState.errors.category}
            />

            <MInput label="Date of birth" {...register('dob')} placeholder="24/05/2000" error={formState.errors.dob} />

            <MInput label="Gender" {...register('gender')} placeholder="Female" error={formState.errors.gender} />

            <MInput
              label="Mobile number"
              {...register('mobileNumber')}
              placeholder="+91 987356xxxx"
              error={formState.errors.mobileNumber}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              // onClick={async () => await router.push('/institute/course')}
              className="btn btn-outline btn-sm mt-5"
            >
              Cancel
            </button>

            <button type="submit" className="   btn btn-sm mt-5">
              Submit
            </button>
          </div>
        </MForm>
      </div>
    </>
  )
}

export default StudentOnboarding
