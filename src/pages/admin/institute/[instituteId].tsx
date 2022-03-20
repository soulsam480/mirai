import { AppLayout } from 'components/globals/AppLayout';
import { NextPageWithLayout } from 'pages/_app';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { ManageInstitute } from 'components/institute/ManageInstitute';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN']);

const Institute: NextPageWithLayout = () => {
  return <ManageInstitute />;
};

Institute.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institute;
