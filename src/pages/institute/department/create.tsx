import { AppLayout } from 'components/AppLayout';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { NextPageWithLayout } from 'pages/_app';

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD']);

const Department: NextPageWithLayout = () => {
  return <div>Create department</div>;
};

Department.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Department;
