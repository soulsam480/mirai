import { zodResolver } from '@hookform/resolvers/zod';
import { MInput } from 'components/lib/MInput';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { copyToClip } from 'utils/helpers';
import { trpc } from 'utils/trpc';
import { z } from 'zod';
import { useAlerts } from 'components/lib/store/alerts';
import { TRPCErrorType } from 'types';
import { signupSchema } from 'pages/login';

const instituteStatus = ['ONBOARDED', 'INPROGRESS', 'PENDING'];

export const createInstituteSchema = z.object({
  code: z.string().min(1, "Code shouldn't be empty"),
  name: z.string().min(1, "Name shouldn't be empty"),
  status: z.enum(['ONBOARDED', 'INPROGRESS', 'PENDING']),
  logo: z.string().optional(),
});

const manageInstituteSchema = createInstituteSchema.merge(
  signupSchema.pick({
    email: true,
  }),
);

export const ManageInstitute: React.FC<{}> = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const isEditMode = useMemo(() => !!router.query.instituteId && !!router.query.instituteId.length, [router.query]);
  const [_, setAlert] = useAlerts();
  const [globalError, setError] = useState<TRPCErrorType | null>(null);

  const { data: inistituteData } = trpc.useQuery(
    ['institute.get_institute', (router.query.instituteId && +router.query.instituteId) || 0],
    {
      enabled: isEditMode,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess(data) {
        const { code, name, status, account } = data;

        code && setValue('code', code);
        name && setValue('name', name);
        status && setValue('status', status);
        account && account.email && setValue('email', account.email);
      },
      onError(e) {
        setError(e);

        if (e?.data?.code === 'NOT_FOUND') {
          router.push('/admin/institute');
        }
      },
    },
  );

  const inputFile = useRef<HTMLInputElement>(null);
  const uploadFile = useRef<File | null>(null);

  const { mutateAsync: createInstituteMut } = trpc.useMutation(['account.create_institute'], {
    onError: setError,
  });
  const { mutateAsync: updateInstituteMut } = trpc.useMutation(['account.update_institute'], {
    onError: setError,
    onSuccess() {
      // refetch stale query
      utils.invalidateQueries(['institute.get_institute']);
    },
  });
  const { mutateAsync: createInstituteAccount } = trpc.useMutation(['auth.sign_up'], {
    onError: setError,
  });

  const { register, handleSubmit, formState, setValue } = useForm<z.infer<typeof manageInstituteSchema>>({
    resolver: zodResolver(manageInstituteSchema),
    defaultValues: {
      code: '',
      logo: '',
      name: '',
      status: 'PENDING',
    },
    shouldFocusError: true,
  });

  async function createInstitute({ email, ...rest }: z.infer<typeof manageInstituteSchema>) {
    try {
      const resp = await createInstituteMut(rest);

      await createInstituteAccount({ role: 'INSTITUTE', email, instituteId: resp.id, name: rest.name });

      setAlert({
        message: 'Institute created successfully !',
        type: 'success',
      });

      router.replace({
        pathname: `/admin/institute/${resp.id}`,
      });
    } catch (_) {}
  }

  async function updateInstitute(data: z.infer<typeof manageInstituteSchema>) {
    //TODO: add logo upload here
    try {
      await updateInstituteMut({ ...data, instituteId: Number(router.query.instituteId) });

      setAlert({
        message: 'Institute updated successfully !',
        type: 'success',
      });
    } catch (_) {}
  }

  //TODO: logo upload
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      uploadFile.current = e.target.files[0];
    }
  }

  function exportSignupLink() {
    if (!inistituteData) return '';

    const { origin } = location;
    const { account } = inistituteData;

    if (!account) return;

    const link = `${origin}/reset-password?${new URLSearchParams({
      accountId: String(account.id),
      token: account.accountToken || '',
    }).toString()}`;

    copyToClip(link).then(() => setAlert({ message: 'Signup link copied to clipboard !', type: 'success' }));
  }

  useEffect(() => {
    if (!globalError) return;

    setAlert({
      message: globalError.message,
      type: 'danger',
    });

    setError(null);
  }, [globalError]);

  return (
    <>
      {' '}
      <div className="text-lg font-medium leading-6 text-gray-900">
        {isEditMode ? (
          <>
            Manage <span className="text-primary font-bold">{inistituteData?.name}</span>
          </>
        ) : (
          'Create new institute'
        )}
      </div>
      <form
        className="form-control w-full sm:w-80 flex"
        onSubmit={handleSubmit(isEditMode ? updateInstitute : createInstitute)}
      >
        <MInput label="Name" {...register('name')} placeholder="Institute name" error={formState.errors.name} />
        <MInput
          disabled={inistituteData && inistituteData.status !== 'PENDING'}
          label="Email"
          {...register('email')}
          placeholder="Institute Email"
          error={formState.errors.email}
        />
        <MInput
          disabled={inistituteData && !!inistituteData.status}
          label="Code"
          {...register('code')}
          placeholder="Institute code"
          error={formState.errors.code}
        />

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
          <button
            type="button"
            onClick={() => router.push('/admin/institute')}
            className="btn btn-sm btn-secondary mt-5"
          >
            Cancel{' '}
          </button>

          <button type="submit" className="btn btn-sm btn-primary mt-5">
            {isEditMode ? 'Update' : 'Create'}
          </button>
          {isEditMode && inistituteData?.status === 'PENDING' && (
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
    </>
  );
};
