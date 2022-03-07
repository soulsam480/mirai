import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NextPageWithLayout } from './_app';
import { z } from 'zod';
import React, { useState } from 'react';
import { trpc } from 'utils/trpc';
import { GetServerSideProps } from 'next';
import { getUserHome, isInstituteRole } from 'utils/helpers';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NavBar } from 'components/NavBar';

export const LoginSchema = z.object({
  email: z.string().email().min(1, 'Email required'),
  password: z.string().min(1, 'Password required'),
});

export const signupSchema = z.object({
  email: z.string().email(),
  role: z.enum(['STUDENT', 'INSTITUTE', 'INSTITUTE_MOD', 'ADMIN']),
  instituteId: z.number().optional(),
  studentId: z.number().optional(),
  name: z.string().optional(),
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession({ req: ctx.req });

  if (user) {
    return {
      redirect: {
        destination: getUserHome(user.user.role),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<{
    email: string;
    password: string;
  }>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    shouldFocusError: true,
  });

  async function userLogin(data: { email: string; password: string }) {
    setError(null);

    const status = await signIn('credentials', {
      redirect: false,
      ...data,
    });

    //@ts-expect-error bad lib types
    if (status && status.error) {
      //@ts-expect-error bad lib types
      setError(status.error);

      return;
    }

    utils.invalidateQueries(['auth.account']);
    router.push('/admin');
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="flex justify-center">
        <div className="w-full sm:max-w-md">
          <form className="form-control w-full" onSubmit={handleSubmit(userLogin)}>
            <div className="text-xl mb-4">Login</div>
            {error && (
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
    </div>
  );
};

export default Login;
