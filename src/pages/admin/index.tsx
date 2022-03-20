import { AppLayout } from 'components/globals/AppLayout';
import { NextPageWithLayout } from 'pages/_app';
import { getServerSideAuthGuard } from 'server/lib/auth';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN']);

const Admin: NextPageWithLayout = () => {
  return <div>Admin</div>;
};

Admin.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Admin;
