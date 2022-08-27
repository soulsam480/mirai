import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MForm, MInput, useAlert } from '../components/lib'
import { trpc } from '../utils'
import { NextPageWithLayout } from './_app'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  function isVal(val?: string | string[]) {
    return val !== undefined && typeof val === 'string' && val.length > 0
  }

  return {
    props: {
      disabled: !isVal(query.accountId) || !isVal(query.token),
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
    resolver: zodResolver(
      z
        .object({
          password: z.string().min(1, 'Required'),
          confirmPassword: z.string().min(1, 'Required'),
        })
        .refine((val) => val.password === val.confirmPassword, {
          message: 'Both passwords should match',
          path: ['confirmPassword'],
        }),
    ),
    shouldFocusError: true,
  })

  const { handleSubmit } = form

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

          <MInput label="Password" type="password" name="password" />

          <MInput label="Confirm password" type="password" name="confirmPassword" />

          <button type="submit" className="btn btn-block mt-5" disabled={disabled}>
            Submit
          </button>
        </MForm>
      </div>
    </div>
  )
}

export default ResetPassword
