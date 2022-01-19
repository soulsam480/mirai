import { AppLayout } from 'components/AppLayout';
import { GetServerSideProps } from 'next';
import { getUser } from 'server/lib/auth';
import { NextPageWithLayout } from '../_app';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = getUser(ctx.req.cookies);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Student: NextPageWithLayout = () => {
  return <div>Student</div>;
};

Student.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Student;
