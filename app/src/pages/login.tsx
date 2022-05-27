import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NextPageWithLayout } from './_app'
import React, { useState } from 'react'
import { trpc } from 'utils/trpc'
import { GetServerSideProps } from 'next'
import { getUserHome } from 'utils/helpers'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NavBar } from 'components/globals/NavBar'
import { useLoader } from 'lib/store/loader'
import { LoginSchema } from 'schemas'
import { MForm } from 'lib/MForm'
import { MInput } from 'components/lib/MInput'
import { MIcon } from 'components/lib/MIcon'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession({ req: ctx.req })

  if (user?.user !== undefined) {
    return {
      redirect: {
        destination: getUserHome(user?.user.role),
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const Login: NextPageWithLayout = () => {
  const utils = trpc.useContext()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const loader = useLoader()

  const form = useForm<{
    email: string
    password: string
  }>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    shouldFocusError: true,
  })

  const { register, handleSubmit, formState } = form

  async function userLogin(data: { email: string; password: string }) {
    setError(null)

    loader.show()

    const status = await signIn('credentials', {
      redirect: false,
      ...data,
    })

    // @ts-expect-error bad lib types
    // eslint-disable-next-line
    if (status && status.error) {
      loader.hide()

      // @ts-expect-error bad lib types
      return setError(status.error)
    }

    void utils.invalidateQueries(['auth.account'])

    loader.hide()

    // TODO: find a better way to do this LOL
    router.reload()
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="flex justify-center px-3">
        <div className="w-full sm:max-w-md">
          <MForm form={form} className="form-control w-full" onSubmit={handleSubmit(userLogin)}>
            <div className="mb-4 text-xl">Login</div>
            {error !== null && (
              <div className="alert alert-error py-2 text-sm">
                <MIcon className="flex-none">
                  <IconPhWarningCircle />
                </MIcon>

                <span className="flex-grow">{error}</span>
              </div>
            )}

            <MInput
              type="email"
              placeholder="Email"
              label="Email"
              error={formState.errors.email}
              {...register('email')}
            />

            <MInput
              label="Password"
              type="password"
              placeholder="password"
              {...register('password')}
              error={formState.errors.password}
            />

            <button type="submit" className="btn btn-sm btn-block mt-5">
              Submit
            </button>
          </MForm>
        </div>
      </div>
    </div>
  )
}

export default Login
