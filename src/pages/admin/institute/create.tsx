import { AppLayout } from 'components/AppLayout';
import { NextPageWithLayout } from 'pages/_app';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { ManageInstitute } from 'components/institute/ManageInstitute';
import { useRouter } from 'next/router';
import { MDialog } from 'components/lib/MDialog';
import { useEffect } from 'react';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN']);

const CreateInstitute: NextPageWithLayout = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/admin/institute');
  }, []);

  return (
    <MDialog show onClose={() => router.push('/admin/institute')}>
      <div className="inline-block p-6 my-8 overflow-hidden align-middle transition-all transform bg-amber-50 shadow-lg rounded-lg">
        <ManageInstitute />
      </div>
    </MDialog>
  );
};

CreateInstitute.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default CreateInstitute;