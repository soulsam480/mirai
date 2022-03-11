import { Institute } from '@prisma/client';
import clsx from 'clsx';
import { AppLayout } from 'components/AppLayout';
import { ManageInstitute } from 'components/institute/ManageInstitute';
import { MDialog } from 'components/lib/MDialog';
import MLink from 'components/lib/MLink';
import { Column, MTable } from 'components/lib/MTable';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { miraiClient } from 'server/context';
import { getServerSideAuthGuard } from 'server/lib/auth';
import IconLaPenSquare from '~icons/la/penSquare.jsx';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'], undefined, async () => {
  const institutes = await miraiClient.institute.findMany();

  return {
    props: {
      institutes: institutes || [],
    },
  };
});

interface Props {
  institutes: Institute[];
}

function getStatusClass(status: Institute['status']) {
  switch (status) {
    case 'INPROGRESS':
      return 'badge-info';

    case 'ONBOARDED':
      return 'badge-success';

    case 'PENDING':
      return 'badge-error';
  }
}

const columns: Column<Institute>[] = [
  {
    key: 'id',
    label: 'ID',
    headerClasses: '!bg-primary',
    classes: 'bg-amber-100',
  },
  {
    key: 'name',
    label: 'Name',
    headerClasses: '!bg-primary',
    classes: 'bg-amber-100',
  },
  {
    key: 'status',
    label: 'Status',
    headerClasses: '!bg-primary',
    classes: 'bg-amber-100',
    format: (row) => <span className={clsx([getStatusClass(row.status), 'badge'])}> {row.status} </span>,
  },
  {
    key: 'code',
    label: 'Code',
    headerClasses: '!bg-primary',
    classes: 'bg-amber-100',
  },
  {
    key: '',
    label: 'Edit',
    headerClasses: '!bg-primary',
    classes: 'bg-amber-100',
    format: ({ id }) => (
      <MLink href={`/admin/institute?instituteId=${id}`} as={`/admin/institute/${id}`}>
        <IconLaPenSquare className="text-lg" />
      </MLink>
    ),
  },
];

const Institutes: NextPageWithLayout<Props, any> = ({ institutes = [] }) => {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-end">
        <Link href={'/admin/institute/create'}>
          <a className="btn btn-primary btn-sm">Create new</a>
        </Link>
      </div>

      <MTable
        className="mt-4"
        columns={columns}
        rows={institutes}
        compact
        noDataLabel={'No institutes were found! Add one to get started'}
      />

      {/* contextual routing for instant feedback. Reloads will show actual page */}
      <MDialog show={!!router.query.instituteId} onClose={() => router.push('/admin/institute')}>
        <div className="inline-block p-6 my-8 overflow-hidden align-middle transition-all transform bg-amber-50 shadow-lg rounded-lg">
          <ManageInstitute />
        </div>
      </MDialog>
    </div>
  );
};

Institutes.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institutes;
