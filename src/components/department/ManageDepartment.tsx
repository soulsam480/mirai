import { useAlerts } from 'components/lib/store/alerts';
import { useRouter } from 'next/router';
import { useState, useMemo, useEffect } from 'react';
import { TRPCErrorType } from 'types';
import { z } from 'zod';
import { MInput } from 'components/lib/MInput';
import { trpc } from 'utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name shouldn't be empty"),
  inCharge: z.string().optional(),
  instituteId: z.number().optional(),
});

const manageDepartmentSchema = createDepartmentSchema.extend({ id: z.number() });

export const ManageDepartment: React.FC<{}> = () => {
  const router = useRouter();
  const [_, setAlert] = useAlerts();
  const isEditMode = useMemo(() => !!router.query.departmentId && !!router.query.departmentId.length, [router.query]);
  const [globalError, setError] = useState<TRPCErrorType | null>(null);
  const utils = trpc.useContext();

  const { data: departmentData } = trpc.useQuery(
    [
      'department.get',
      {
        departmentId: (router.query.departmentId && +router.query.departmentId) || 0,
        instituteId: (router.query.instituteId && +router.query.instituteId) || 0,
      },
    ],
    {
      enabled: isEditMode,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess(data) {
        const { instituteId, inCharge, name } = data;

        instituteId && setValue('instituteId', instituteId);
        name && setValue('name', name);
        inCharge && setValue('inCharge', inCharge);
      },
      onError(e) {
        setError(e);

        if (e?.data?.code === 'NOT_FOUND') {
          router.push('/institute/department');
        }
      },
    },
  );

  const { mutateAsync: createDepartmentMut } = trpc.useMutation(['department.create'], {
    onError: setError,
  });

  const { mutateAsync: updateDepartmentMut } = trpc.useMutation(['department.update'], {
    onError: setError,
    onSuccess() {
      utils.invalidateQueries(['department.get']);
    },
  });

  const { register, handleSubmit, formState, setValue } = useForm<z.infer<typeof manageDepartmentSchema>>({
    resolver: zodResolver(manageDepartmentSchema),
    defaultValues: {
      name: '',
      inCharge: '',
      instituteId: undefined,
    },
    shouldFocusError: true,
  });

  async function createDepartment(data: z.infer<typeof manageDepartmentSchema>) {
    try {
      const resp = await createDepartmentMut(data);

      setAlert({
        message: 'Department created successfully !',
        type: 'success',
      });
      router.replace({
        pathname: `/institute/department/${resp.id}`,
      });
    } catch (_) {}
  }

  async function updateDepartment() {}

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
      <div className="text-lg font-medium leading-6 text-gray-900">
        {isEditMode ? (
          <>
            Manage <span className="text-primary font-bold">{''}</span>
          </>
        ) : (
          'Create new department'
        )}
      </div>
      <form
        className="form-control w-full sm:w-80 flex"
        onSubmit={() => handleSubmit(isEditMode ? updateDepartment : createDepartment)}
      >
        <MInput label="Name" {...register('name')} placeholder="Department name" error={formState.errors.name} />
        <label className="label">
          {formState.errors.name && <span className="label-text-alt"> {formState.errors.name} </span>}{' '}
        </label>{' '}
        <MInput
          label="In charge"
          {...register('inCharge')}
          placeholder="Department incharge"
          error={formState.errors.inCharge}
        />
        <label className="label">
          {formState.errors.inCharge && <span className="label-text-alt"> {formState.errors.inCharge} </span>}{' '}
        </label>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push('/institute/department')}
            className="btn btn-sm btn-secondary mt-5"
          >
            Cancel{' '}
          </button>

          <button type="submit" className="btn btn-sm btn-primary mt-5">
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </>
  );
};
