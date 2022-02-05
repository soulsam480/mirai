import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from 'components/AppLayout';
import { MInput } from 'components/lib/MInput';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { trpc } from 'utils/trpc';
import { z } from 'zod';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'], undefined, async (ctx) => {
  return {
    props: {},
  };
});

const instituteStatus = ['ONBOARDED', 'INPROGRESS', 'PENDING'];

export const createInstituteSchema = z.object({
  code: z.string(),
  name: z.string(),
  status: z.enum(['ONBOARDED', 'INPROGRESS', 'PENDING']),
  logo: z.string().optional(),
});

const Institutes: NextPageWithLayout = () => {
  const router = useRouter();

  trpc.useQuery(['institute.get_institute', (router.query.id && +router.query.id[0]) || 0], {
    enabled: !!router.query.id && !!router.query.id.length,
    onSuccess(data) {
      const { code, name, status } = data;

      code && setValue('code', code);
      name && setValue('name', name);
      status && setValue('status', status);
    },
    refetchOnWindowFocus: false,
  });

  const [error, setError] = useState<string | null>(null);

  const inputFile = useRef<HTMLInputElement>(null);
  const uploadFile = useRef<File | null>(null);

  const { mutateAsync: createInstituteMut } = trpc.useMutation(['account.create_institute']);

  const { register, handleSubmit, formState, setValue } = useForm<z.infer<typeof createInstituteSchema>>({
    resolver: zodResolver(createInstituteSchema),
    defaultValues: {
      code: '',
      logo: '',
      name: '',
      status: 'PENDING',
    },
    shouldFocusError: true,
  });

  async function createInstitute(data: z.infer<typeof createInstituteSchema>) {
    // async action
    // get ID from response

    try {
      const resp = await createInstituteMut(data);

      router.replace({
        pathname: `/admin/institute/manage/${resp.id}`,
      });
    } catch (error) {
      // setError(error.)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      uploadFile.current = e.target.files[0];
    }
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
          <input type="file" className="file-input" multiple={false} onChange={handleFileChange} ref={inputFile} />
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
