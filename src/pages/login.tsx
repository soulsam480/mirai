import { AppLayout } from 'components/AppLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NextPageWithLayout } from './_app';
import { z } from 'zod';
import React from 'react';
import { trpc } from 'utils/trpc';
import { useAtom } from 'jotai';
import { userAtom } from 'stores/user';
import { GetServerSideProps } from 'next';
import { isInstituteRole } from 'utils/helpers';
import { getUser } from 'server/lib/auth';

const schema = z.object({
  email: z.string().email().min(1, 'Email required'),
  password: z.string().min(1, 'Password required'),
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = getUser(ctx.req.cookies);

  if (user) {
    return {
      redirect: {
        destination: user.role === 'ADMIN' ? '/admin' : isInstituteRole(user.role).is ? '/institute' : '/student',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login: NextPageWithLayout = () => {
  const [_, setUser] = useAtom(userAtom);

  const loginMut = trpc.useMutation(['auth.login'], {
    onSuccess(response) {
      setUser(response);
    },
  });

  const { register, handleSubmit, formState } = useForm<{
    email: string;
    password: string;
  }>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    shouldFocusError: true,
  });

  return (
    <div className="min-h-screen flex justify-center mt-16">
      <div className="w-full sm:max-w-md">
        <form className="form-control w-full" onSubmit={handleSubmit((data) => loginMut.mutate({ ...data }))}>
          <div className="text-xl mb-4">Login</div>
          {loginMut.error && (
            <div className="alert alert-error py-2 text-sm">
              <div className="flex-1">
                <label> {loginMut.error?.shape?.message || ''} </label>
              </div>
            </div>
          )}

          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="john@doe.com"
            className="input input-bordered input-primary"
            {...register('email')}
          />
          <label className="label">
            {formState.errors?.email && <span className="label-text-alt"> {formState.errors.email.message} </span>}{' '}
          </label>

          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="pawword"
            placeholder="password"
            className="input input-bordered input-primary"
            {...register('password')}
          />
          <label className="label">
            {formState.errors?.password && (
              <span className="label-text-alt"> {formState.errors.password?.message} </span>
            )}{' '}
          </label>

          <button type="submit" className="btn btn-block btn-primary mt-5">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

Login.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Login;
