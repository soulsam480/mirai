import { AppLayout } from 'components/AppLayout';
import { NextPageWithLayout } from 'pages/_app';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { ManageInstitute } from 'components/institute/ManageInstitute';

export const getServerSideProps = getServerSideAuthGuard(['ADMIN']);

const CreateInstitute: NextPageWithLayout = () => {
  return <ManageInstitute />;
};

CreateInstitute.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default CreateInstitute;
