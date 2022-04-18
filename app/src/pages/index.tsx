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
  return (
    <div className="hero min-h-screen">
      <div className="absolute top-0 left-0 right-0 ">
        <div className="navbar min-h-12 mb-2 rounded-none text-neutral">
          <div className="mx-2 flex-1">
            <Link href="/">
              <a className="text-lg font-bold">Mirai</a>
            </Link>
          </div>
          <div className="flex-none space-x-2">
            <button className="btn btn-primary btn-ghost btn-sm hover:bg-primary">Contact sales</button>
            <Link href={user === undefined || user === null ? '/login' : getUserHome(user.user.role)}>
              <a className="btn btn-primary btn-ghost btn-sm hover:bg-primary">
                {user === undefined || user === null ? 'Login / Signup' : 'Go to home'}
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <h1 className="mb-6 bg-gradient-to-br from-primary-focus to-secondary bg-clip-text text-4xl font-extrabold text-transparent sm:text-8xl">
            Hiring simplified for humans
          </h1>
          <p className="mb-5 text-xl">
            Mirai makes it simple for both institutes and students with an amazing UI which looks good and esier to
            understand.
          </p>
          <div className="flex justify-center space-x-2">
            <button className="btn btn-primary btn-sm sm:btn-md">Contact sales</button>
            <Link href={user === undefined || user === null ? '/login' : getUserHome(user.user.role)}>
              <a className="btn btn-secondary btn-sm sm:btn-md">
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
