import { AppLayout } from 'components/AppLayout';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { NextPageWithLayout } from 'pages/_app';
import { MDialog } from 'components/lib/MDialog';
import { useRouter } from 'next/router';
import { ManageDepartment } from 'components/department/ManageDepartment';
import { useEffect } from 'react';

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD']);

const Department: NextPageWithLayout = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/institute/department');
  }, []);

  return (
    <MDialog show onClose={() => router.push('/institute/department')}>
      <div className="inline-block p-6 my-8 overflow-hidden align-middle transition-all transform bg-amber-50 shadow-lg rounded-lg">
        <ManageDepartment />
      </div>
    </MDialog>
  );
};

Department.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Department;
