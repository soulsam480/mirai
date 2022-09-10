import type { AppRouter } from '@mirai/api'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
import { getBaseUrl } from './helpers'
import { createTRPCProxyClient } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
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
})

/**
 * This should be used where we don't need reactQuery state
 * intented to be used with delete mutations
 */
export const trpcClient = createTRPCProxyClient<AppRouter>({
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
})
