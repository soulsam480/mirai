import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NavBar } from './NavBar';

type AppLayoutProps = { children: ReactNode };

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Head>
        <title>Mirai</title>
      </Head>

      <NavBar />
      <main className="p-3">{children}</main>

      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
};
