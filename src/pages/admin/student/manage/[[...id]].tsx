import { zodResolver } from '@hookform/resolvers/zod';
import { AppLayout } from 'components/AppLayout';
import { MInput } from 'components/lib/MInput';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { trpc } from 'utils/trpc';
import { z } from 'zod';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'], undefined, async (ctx) => {
  console.log(ctx.query);

  return {
    props: {},
  };
});

const studentStatus = ['ONBOARDED', 'INPROGRESS', 'PENDING'];

export const createStudentSchema = z.object({
  code: z.string(),
  batchId: z.number(),
  instituteId: z.number(),
  accountId: z.number(),
  name: z.string(),
  dob: z.string(),
  gender: z.string(),
  category: z.string(),
  mobileNumber: z.string(),
  primaryEmail: z.string(),
  secondaryEmail: z.string().optional(),
  permanentAddress: z.string(),
  currentAddress: z.string(),
});

const Student: NextPageWithLayout = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const inputFile = useRef<HTMLInputElement>(null);
  const uploadFile = useRef<File | null>(null);

  const { mutateAsync: createInstituteMut } = trpc.useMutation(['account.create_institute']);

  const { register, handleSubmit, formState } = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      code: '',
      name: '',
      dob: '',
      gender: '',
      category: '',
      mobileNumber: '',
      primaryEmail: '',
      secondaryEmail: '',
      permanentAddress: '',
      currentAddress: '',
    },
    shouldFocusError: true,
  });

  async function createInstitute(data: z.infer<typeof createStudentSchema>) {
    // async action
    // get ID from response

    try {
      const resp = await createInstituteMut(data);

      router.replace({
        pathname: `/admin/manage/${resp.id}`,
      });
    } catch (error) {
      // setError(error.)
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
        {/* <select className="select select-bordered select-primary select-sm" {...register('status')}>
          {instituteStatus.map((val, key) => {
            return (
              <option key={key} value={val}>
                {' '}
                {val}{' '}
              </option>
            );
          })}
        </select> */}
        <label className="label">
          {formState.errors.status && <span className="label-text-alt"> {formState.errors.status.message} </span>}{' '}
        </label>

        <label className="label">
          <span className="label-text">Logo</span>
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

Student.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Student;
