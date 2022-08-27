import type { Role } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { getUserHome } from '../../utils'

export function getServerSideAuthGuard(
  role: Role[],
  redirect = '/login',
  /**
   * Should only retunr props
   */
  serverFn?: GetServerSideProps,
): GetServerSideProps {
  return async (ctx) => {
    redirect = redirect ?? '/login'

    const session = await getSession({ req: ctx.req })

    if (session == null || !role.includes(session.user.role)) {
      return {
        redirect: {
          destination: session == null ? redirect : getUserHome(session.user.role),
          permanent: false,
        },
      }
    }

    return await (serverFn?.(ctx) ?? {
      props: {},
    })
  }
}
