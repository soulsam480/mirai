import { AppLayout } from 'components/AppLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NextPageWithLayout } from './_app';
import { z } from 'zod';
import React from 'react';
import { trpc } from 'utils/trpc';

const schema = z.object({
  email: z.string().email().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

const Login: NextPageWithLayout = () => {
  const loginMut = trpc.useMutation(['auth.login']);

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
          <input type="email" placeholder="john@doe.com" className="input input-bordered " {...register('email')} />
          <label className="label">
            {formState.errors?.email && <span className="label-text-alt"> {formState.errors.email.message} </span>}{' '}
          </label>

          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="pawword" placeholder="password" className="input input-bordered " {...register('password')} />
          <label className="label">
            {formState.errors?.password && <span className="label-text-alt"> {formState.errors.email?.message} </span>}{' '}
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
