import { GetServerSideProps } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { getUserHome } from 'utils/helpers'
import { NextPageWithLayout } from './_app'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession({ req: ctx.req })

  return {
    props: {
      user,
    },
  }
}

interface Props {
  user: Session | undefined
}

const IndexPage: NextPageWithLayout<Props> = ({ user }) => {
  console.log(user)
  return (
    <div className="min-h-screen hero">
      <div className="absolute top-0 left-0 right-0 ">
        <div className="mb-2 rounded-none navbar min-h-12 text-neutral">
          <div className="flex-1 mx-2">
            <Link href="/">
              <a className="text-lg font-bold">Mirai</a>
            </Link>
          </div>
          <div className="flex-none space-x-2">
            <button className="btn btn-sm btn-ghost hover:bg-primary btn-primary">Contact sales</button>
            <Link href={user === undefined || user === null ? '/login' : getUserHome(user.user.role)}>
              <a className="btn btn-sm btn-ghost hover:bg-primary btn-primary">
                {user === undefined || user === null ? 'Login / Signup' : 'Go to home'}
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center hero-content">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-4xl font-extrabold text-transparent sm:text-8xl bg-clip-text bg-gradient-to-br from-primary-focus to-secondary">
            Hiring simplified for humans
          </h1>
          <p className="mb-5 text-xl">
            Mirai makes it simple for both institutes and students with an amazing UI which looks good and esier to
            understand.
          </p>
          <div className="flex justify-center space-x-2">
            <button className="btn btn-sm sm:btn-md btn-primary">Contact sales</button>
            <Link href={user === undefined || user === null ? '/login' : getUserHome(user.user.role)}>
              <a className="btn btn-sm sm:btn-md btn-secondary">
                {user === undefined || user === null ? 'Login / Signup' : 'Go to home'}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @Link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
