import { Institute } from '@prisma/client';
import clsx from 'clsx';
import { AppLayout } from 'components/globals/AppLayout';
import PageLayout from 'components/globals/PageLayout';
import { ManageInstitute } from 'components/institute/ManageInstitute';
import { MDialog } from 'components/lib/MDialog';
import MLink from 'components/lib/MLink';
import { Column, MTable } from 'components/lib/MTable';
import { useAlerts } from 'components/lib/store/alerts';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { useMemo } from 'react';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { loggedInAtom } from 'stores/user';
import { trpc } from 'utils/trpc';
import IconLaPenSquare from '~icons/la/penSquare.jsx';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN']);

interface Props {}

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

const Institutes: NextPageWithLayout<Props, any> = () => {
  const router = useRouter();
  const [_, setAlert] = useAlerts();
  const [isLoggedIn] = useAtom(loggedInAtom);

  const columns = useMemo<Column<Institute>[]>(
    () => [
      {
        field: 'id',
        label: 'ID',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'name',
        label: 'Name',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'status',
        label: 'Status',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        format: (row) => <span className={clsx([getStatusClass(row.status), 'badge'])}>{row.status}</span>,
      },
      {
        field: 'code',
        label: 'Code',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: '',
        label: 'Edit',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        format: ({ id }) => (
          <MLink href={`/admin/institute?instituteId=${id}`} as={`/admin/institute/${id}`}>
            <IconLaPenSquare className="text-lg" />
          </MLink>
        ),
      },
    ],
    [],
  );

  const { data: institutes = [], isLoading } = trpc.useQuery(['institute.get_all'], {
    //todo: kind of a bug, find ways to fix it
    enabled: isLoggedIn,
    onError(e) {
      setAlert({ type: 'danger', message: e.message });
    },
  });

  return (
    <PageLayout.PageWrapper>
      <PageLayout.PageHeader
        headerLabel="Institutes"
        createLabel="Create new"
        createActionUrl="/admin/institute/create"
      />

      <MTable
        className="mt-4"
        columns={columns}
        rows={institutes}
        compact
        noDataLabel={'No institutes were found! Add one to get started'}
        loading={isLoading}
      />

      {/* contextual routing for instant feedback. Reloads will show actual page */}
      <MDialog show={!!router.query.instituteId} onClose={() => router.push('/admin/institute')}>
        {/* //todo: again this is a bug, fix this */}
        <div className="dialog-content">
          <ManageInstitute />
        </div>
      </MDialog>
    </PageLayout.PageWrapper>
  );
};

Institutes.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institutes;
