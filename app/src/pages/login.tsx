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
import { useLoader } from 'components/lib/store/loader'
import { LoginSchema } from 'schemas'

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

  const { register, handleSubmit, formState } = useForm<{
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
    <div className="min-h-screen ">
      <NavBar />
      <div className="flex justify-center px-3">
        <div className="w-full sm:max-w-md">
          <form className="form-control w-full" onSubmit={handleSubmit(userLogin)}>
            <div className="mb-4 text-xl">Login</div>
            {error !== null && (
              <div className="alert alert-error py-2 text-sm">
                <div className="flex-1">
                  <label> {error} </label>
                </div>
              </div>
            )}

            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="john@doe.com"
              className="input-bordered input-primary input"
              {...register('email')}
            />
            <label className="label">
              {formState.errors?.email !== undefined && (
                <span className="label-text-alt"> {formState.errors.email.message} </span>
              )}{' '}
            </label>

            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input-bordered input-primary input"
              {...register('password')}
            />
            <label className="label">
              {formState.errors?.password !== undefined && (
                <span className="label-text-alt"> {formState.errors.password?.message} </span>
              )}{' '}
            </label>

            <button type="submit" className="   btn btn-block mt-5">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
