import { AppLayout } from 'components/globals/AppLayout';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { NextPageWithLayout } from 'pages/_app';

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD']);

const Department: NextPageWithLayout = () => {
  return <div>Department info</div>;
};

Department.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Department;
