import { AppLayout } from 'components/AppLayout';
import { NextPageWithLayout } from 'pages/_app';
import { getServerSideAuthGuard } from 'server/lib/auth';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN']);

const Institutes: NextPageWithLayout = () => {
  return <div>Institutes</div>;
};

Institutes.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institutes;
