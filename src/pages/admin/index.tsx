import { AppLayout } from 'components/AppLayout';
import { NextPageWithLayout } from '../_app';

const Admin: NextPageWithLayout = () => {
  return <div>Admin</div>;
};

Admin.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Admin;
