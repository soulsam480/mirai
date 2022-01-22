import { AppLayout } from 'components/AppLayout';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { NextPageWithLayout } from '../_app';

export const getServerSideProps = getServerSideAuthGuard(['STUDENT']);

const Student: NextPageWithLayout = () => {
  return <div>Student</div>;
};

Student.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Student;
