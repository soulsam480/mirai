import '../styles/globals.scss'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { AppType } from 'next/dist/shared/lib/utils'
import { ReactElement, ReactNode } from 'react'
import { DefaultLayout } from '../components/globals/DefaultLayout'
import { AppProviders } from '../contexts'
import { MAlertGroup, MLoader } from '../components/lib'
import { ErrorBoundary } from '../utils/helpers'
import { useRouter } from 'next/router'
import { trpc } from '../utils'

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  const { push } = useRouter()

  return (
    <ErrorBoundary
      onError={async (error) => {
        // eslint-disable-next-line no-console
        console.error(error)

        return process.env.NODE_ENV === 'development' ? null : await push('/500')
      }}
    >
      <AppProviders pageProps={pageProps}>
        {getLayout(
          <>
            <Component {...pageProps} />
            {typeof window !== 'undefined' && (
              <>
                <MLoader />
                <MAlertGroup />
              </>
            )}
          </>,
        )}
      </AppProviders>
    </ErrorBoundary>
  )
}) as AppType

export default trpc.withTRPC(MyApp)
