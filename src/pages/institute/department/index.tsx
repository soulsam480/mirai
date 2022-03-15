import { AppLayout } from 'components/AppLayout';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { NextPageWithLayout } from 'pages/_app';
import { miraiClient } from 'server/context';
import { Department } from '@prisma/client';
import { Column, MTable } from 'components/lib/MTable';
import Link from 'next/link';

//TODO: add support for admin view
export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'], undefined, async () => {
  const departments = await miraiClient.department.findMany();

  return {
    props: {
      departments: departments || [],
    },
  };
});

const columns: Column<Department>[] = [
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
    key: 'inCharge',
    label: 'In charge',
    headerClasses: '!bg-primary',
    classes: 'bg-amber-100',
    format: ({ inCharge }) => <>{inCharge || '-'}</>,
  },
  //TODO: add edit setup
  //   {
  //     key: '',
  //     label: 'Edit',
  //     headerClasses: '!bg-primary',
  //     classes: 'bg-amber-100',
  //     format: ({ id }) => (
  //       <MLink href={`/admin/institute?instituteId=${id}`} as={`/admin/institute/${id}`}>
  //         <IconLaPenSquare className="text-lg" />
  //       </MLink>
  //     ),
  //   },
];

const Departments: NextPageWithLayout<{ departments: Department[] }, any> = ({ departments = [] }) => {
  return (
    <div>
      <div className="flex justify-end">
        <Link href={'/institute/department/create'}>
          <a className="btn btn-primary btn-sm">Create new</a>
        </Link>
      </div>

      <MTable
        className="mt-4"
        columns={columns}
        rows={departments}
        compact
        noDataLabel={'No departments were found !'}
      />
    </div>
  );
};

Departments.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Departments;
