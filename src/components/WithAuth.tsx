// HOC/withAuth.jsx
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { useEffect } from 'react';
import { loggedInAtom } from 'stores/user';
import { DefaultLayout } from './DefaultLayout';

const withAuth = (WrappedComponent: NextPageWithLayout) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const [isLoggedIn] = useAtom(loggedInAtom);
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        if (!isLoggedIn) {
          router.push('/login');
        }
      }
    }, [isLoggedIn, router]);

    const getLayout = WrappedComponent.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

    return getLayout(<WrappedComponent {...props} />);
  };
};

export default withAuth;
