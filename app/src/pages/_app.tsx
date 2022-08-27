import '../styles/globals.scss'

import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { AppType } from 'next/dist/shared/lib/utils'
import { ReactElement, ReactNode } from 'react'
import type { AppRouter } from '@mirai/api'
import superjson from 'superjson'
import { DefaultLayout } from '../components/globals/DefaultLayout'
import { AppProviders } from '../contexts'
import { MAlertGroup, MLoader } from '../components/lib'
import { ErrorBoundary, getBaseUrl } from '../utils/helpers'
import { useRouter } from 'next/router'

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

export default withTRPC<AppRouter>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config() {
    return {
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      },
      // url: `${getBaseUrl() as string}/api/trpc`,
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  responseMeta({ clientErrors }) {
    if (clientErrors.length > 0) {
      // propagate http first error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      }
    }

    // for app caching with SSR see https://trpc.io/docs/caching

    return {}
  },
})(MyApp)
