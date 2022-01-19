import { AppLayout } from 'components/AppLayout';
import withAuth from 'components/WithAuth';
import { GetServerSideProps } from 'next';
import { NextPageWithLayout } from '../_app';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(ctx.req.rawHeaders);

  return {
    props: {},
  };
};

const Admin: NextPageWithLayout = () => {
  return <div>Admin</div>;
};

Admin.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default withAuth(Admin);
