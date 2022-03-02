import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from 'components/AppLayout';
import { MInput } from 'components/lib/MInput';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { copyToClip } from 'utils/helpers';
import { trpc } from 'utils/trpc';
import { z } from 'zod';
import { useAlerts } from 'components/lib/store/alerts';

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
  const isEditMode = useMemo(() => !!router.query.id && !!router.query.id.length, [router.query]);
  const [_, setAlert] = useAlerts();

  const { error: getInstituteError, data: inistituteData } = trpc.useQuery(
    ['institute.get_institute', (router.query.id && +router.query.id[0]) || 0],
    {
      enabled: isEditMode,
      onSuccess(data) {
        const { code, name, status } = data;

        code && setValue('code', code);
        name && setValue('name', name);
        status && setValue('status', status);
      },
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (!getInstituteError) return;

    if (getInstituteError?.data?.code === 'NOT_FOUND') {
      router.push('/admin/institute');
    }
  }, [getInstituteError]);

  const inputFile = useRef<HTMLInputElement>(null);
  const uploadFile = useRef<File | null>(null);

  const { mutateAsync: createInstituteMut, error } = trpc.useMutation(['account.create_institute']);

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
    try {
      const resp = await createInstituteMut(data);

      setAlert({
        message: 'Institute created successfully !',
        type: 'success',
      });

      router.replace({
        pathname: `/admin/institute/manage/${resp.id}`,
      });
    } catch (_) {}
  }

  function updateInstitute(_data: z.infer<typeof createInstituteSchema>) {
    console.log('TODO update');
    //TODO: call update mutation here
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      uploadFile.current = e.target.files[0];
    }
  }

  function exportSignupLink() {
    if (!inistituteData) return '';

    const { origin } = location;

    const link = `${origin}/signup/${new URLSearchParams({
      instituteId: String(inistituteData.id),
      role: 'INSTITUTE',
      name: inistituteData.name,
    }).toString()}`;

    copyToClip(link);
  }

  useEffect(() => {
    setAlert({
      message: error?.message || '',
      type: 'danger',
    });
  }, [error]);

  return (
    <div>
      <div className="text-xl">Create new Institute</div>
      <div className="grid sm:grid-cols-2 grid-cols-1 sm:space-x-2">
        <form
          className="form-control w-full sm:w-80"
          onSubmit={handleSubmit(isEditMode ? updateInstitute : createInstitute)}
        >
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

          <div className="flex justify-end space-x-2">
            <button type="submit" className="btn btn-sm btn-primary mt-5">
              {isEditMode ? 'Update' : 'Create'}
            </button>
            {isEditMode && !inistituteData?.account && (
              <button
                type="button"
                onClick={exportSignupLink}
                className="btn btn-sm btn-primary mt-5"
                title="Generate Signup link for institute"
              >
                {' '}
                Copy Signup link
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

Institutes.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institutes;
