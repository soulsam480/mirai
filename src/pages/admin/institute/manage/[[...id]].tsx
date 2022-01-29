import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from 'components/AppLayout';
import { MInput } from 'components/lib/MInput';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { z } from 'zod';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN']);

const instituteStatus = ['ONBOARDED', 'INPROGRESS', 'PENDING'];

export const createInstituteSchema = z.object({
  code: z.string(),
  name: z.string(),
  status: z.enum(['ONBOARDED', 'INPROGRESS', 'PENDING']),
  logo: z.string().optional(),
});

const Institutes: NextPageWithLayout = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<z.infer<typeof createInstituteSchema>>({
    resolver: zodResolver(createInstituteSchema),
    defaultValues: {
      code: '',
      logo: '',
      name: '',
      status: 'PENDING',
    },
    shouldFocusError: true,
  });

  function createInstitute() {
    //
  }

  return (
    <div>
      <div className="text-xl">Create new Institute</div>
      <form className="form-control w-full sm:w-80" onSubmit={handleSubmit(createInstitute)}>
        {error && (
          <div className="alert alert-error py-2 text-sm">
            <div className="flex-1">
              <label> {error} </label>
            </div>
          </div>
        )}

        <MInput label="Name" {...register('name')} placeholder="Institute name" error={formState.errors.name} />
        <MInput label="Code" {...register('code')} placeholder="Institute code" error={formState.errors.code} />

        <label className="label">
          <span className="label-text">Onboarding status</span>
        </label>
        <select className="select select-bordered select-primary select-sm" {...register('status')}>
          {instituteStatus.map((val, key) => {
            return (
              <option key={key} value={val}>
                {' '}
                {val}{' '}
              </option>
            );
          })}
        </select>
        <label className="label">
          {formState.errors.status && <span className="label-text-alt"> {formState.errors.status.message} </span>}{' '}
        </label>

        <label className="label">
          <span className="label-text">Logo</span>
        </label>
        <label className="block">
          <span className="sr-only">Choose institute logo</span>
          <input type="file" className="file-input" />
        </label>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-sm btn-primary mt-5">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

Institutes.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institutes;
