import { AppLayout } from 'components/AppLayout';
import { NextPageWithLayout } from './_app';

const Login: NextPageWithLayout = () => {
  return <div>Login</div>;
};

Login.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Login;
