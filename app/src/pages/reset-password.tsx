import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { useAlert } from 'components/lib/store/alerts'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { trpc } from 'utils/trpc'
import { NextPageWithLayout } from './_app'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      disabled: query.accountId === undefined || query.token === undefined,
    },
  }
}

interface passwordResetSchema {
  password: string
  confirmPassword: string
}

const ResetPassword: NextPageWithLayout<{ disabled: boolean }> = ({ disabled }) => {
  const form = useForm<passwordResetSchema>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    shouldFocusError: true,
  })

  const { register, handleSubmit, formState, getValues } = form

  const { query, push } = useRouter()
  const setAlert = useAlert()

  const { mutateAsync: resetPassword } = trpc.useMutation(['auth.reset_password'], {
    onError(e) {
      setAlert({
        type: 'danger',
        message: e.message,
      })
    },
  })

  async function handleResetPassword(val: passwordResetSchema) {
    const { accountId, token } = query
    if (accountId === undefined || token === undefined) return

    try {
      await resetPassword({
        password: val.password,
        accountId: parseInt(accountId as string),
        token: token as string,
      })

      setAlert({
        type: 'success',
        message: 'Password reset successful !',
      })

      void push('/login')
    } catch (_) {}
  }

  useEffect(() => {
    if (disabled) {
      setAlert({
        type: 'danger',
        message: 'Invalid password reset link',
      })
    }
  }, [disabled, setAlert])

  return (
    <div className="flex min-h-screen justify-center py-10">
      <div className="w-full sm:max-w-md">
        <MForm form={form} className="form-control w-full" onSubmit={handleSubmit(handleResetPassword)}>
          <div className="mb-4 text-xl">Reset password</div>

          <MInput
            label="Password"
            type="password"
            {...register('password', {
              disabled,
              required: 'Password is required',
              minLength: {
                value: 1,
                message: 'Password is required',
              },
            })}
            error={formState.errors.password}
          />

          <MInput
            label="Confirm password"
            type="password"
            {...register('confirmPassword', {
              disabled,
              required: 'Confirm password is required',
              minLength: {
                value: 1,
                message: 'Confirm password is required',
              },
              validate: (value) => getValues('password') === value || 'Passwords should be the same',
            })}
            error={formState.errors.confirmPassword}
          />

          <button type="submit" className="btn btn-block mt-5" disabled={disabled}>
            Submit
          </button>
        </MForm>
      </div>
    </div>
  )
}

export default ResetPassword
