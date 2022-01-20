import { AppLayout } from 'components/AppLayout';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { NextPageWithLayout } from '../_app';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession({ req: ctx.req });

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

const Institute: NextPageWithLayout = () => {
  return <div>Institute</div>;
};

Institute.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institute;
