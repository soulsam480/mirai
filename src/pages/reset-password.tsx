import { MInput } from 'components/lib/MInput';
import { useAlerts } from 'components/lib/store/alerts';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from 'utils/trpc';
import { NextPageWithLayout } from './_app';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      disabled: !query.accountId || !query.token,
    },
  };
};

interface passwordResetSchema {
  password: string;
  confirmPassword: string;
}

const ResetPassword: NextPageWithLayout<{ disabled: boolean }> = ({ disabled }) => {
  const { register, handleSubmit, formState, getValues } = useForm<passwordResetSchema>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    shouldFocusError: true,
  });

  const { query, push } = useRouter();
  const [_, setAlert] = useAlerts();

  const { mutateAsync: resetPassword } = trpc.useMutation(['auth.reset_password'], {
    onError(e) {
      setAlert({
        type: 'danger',
        message: e.message,
      });
    },
  });

  async function handleResetPassword(val: passwordResetSchema) {
    const { accountId, token } = query;
    if (!accountId || !token) return;

    try {
      await resetPassword({
        password: val.password,
        accountId: parseInt(accountId as string),
        token: token as string,
      });

      setAlert({
        type: 'success',
        message: 'Password reset successful !',
      });

      push('/login');
    } catch (_) {}
  }

  useEffect(() => {
    if (disabled) {
      setAlert({
        type: 'danger',
        message: 'Invalid password reset link',
      });
    }
  }, [disabled]);

  return (
    <div className="flex justify-center min-h-screen py-10">
      <div className="w-full sm:max-w-md">
        <form className="form-control w-full" onSubmit={handleSubmit(handleResetPassword)}>
          <div className="text-xl mb-4">Reset password</div>

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

          <button type="submit" className="btn btn-block btn-primary mt-5" disabled={disabled}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
