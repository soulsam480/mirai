import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NavBar } from './NavBar';
import { SideBar } from './SideBar';

type AppLayoutProps = { children: ReactNode };

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Head>
        <title>Mirai</title>
      </Head>

      <NavBar />

      <SideBar>
        <main className="p-3">{children}</main>
      </SideBar>

      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
};
