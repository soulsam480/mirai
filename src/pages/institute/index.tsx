import { AppLayout } from 'components/AppLayout';

import { getServerSideAuthGuard } from 'server/lib/auth';
import { NextPageWithLayout } from '../_app';

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD']);

const Institute: NextPageWithLayout = () => {
  return <div>Institute</div>;
};

Institute.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Institute;
