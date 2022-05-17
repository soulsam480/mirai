import Head from 'next/head'
import { ReactNode } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'

interface DefaultLayoutProps {
  children: ReactNode
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Mirai | Hiring simplified for humans</title>
      </Head>

      <main>{children}</main>

      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  )
}
