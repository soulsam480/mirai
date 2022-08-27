import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { BgSvg } from '../components/landing/BgSvg'
import { MIcon } from '../components/lib'
import { getUserHome, useTheme } from '../utils'
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
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (theme === 'dark') {
      setTheme('light')
      localStorage.setItem('mirai-home', 'true')
    }

    return () => {
      localStorage.getItem('mirai-home') === 'true' && setTheme('dark')
      localStorage.removeItem('mirai-home')
    }
  }, [theme, setTheme])

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-secondary/30 to-accent/25">
      <div className="z-1 absolute inset-x-0 top-0">
        <BgSvg />
      </div>

      <div className="z-2 absolute top-0 left-0 right-0">
        <div className="navbar min-h-12 mb-2 rounded-none text-neutral">
          <div className="mx-2 flex-1">
            <Link href="/">
              <a className="text-lg font-bold text-base-100">Mirai</a>
            </Link>
          </div>
          <div className="flex-none gap-2">
            <button className="btn btn-ghost btn-sm flex items-center gap-2 text-base-100">
              <span>Contact sales</span>
              <MIcon>
                <IconPhMegaphone />
              </MIcon>
            </button>

            <Link href={user === undefined || user === null ? '/login' : getUserHome(user.user.role)}>
              <a className="btn btn-ghost btn-sm flex items-center gap-2 text-base-100">
                {user === undefined || user === null ? (
                  'Login / Signup'
                ) : (
                  <>
                    <span>Go to home</span> <IconPhHouse />
                  </>
                )}
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <h1 className="text-shadow-xs mb-6 text-4xl font-bold text-accent-focus sm:text-8xl">
            Hiring simplified for humans
          </h1>
          <p className="mb-5 text-lg font-semibold sm:text-xl">
            Mirai makes it simple for both institutes and students with an amazing UI which looks good and esier to
            understand.
          </p>
          <div className="flex justify-center gap-2">
            {(user === undefined || user === null) && (
              <button className="btn btn-primary btn-sm flex items-center gap-2 !font-bold sm:btn-md">
                <span>Contact sales</span>
                <MIcon>
                  <IconPhMegaphone />
                </MIcon>
              </button>
            )}

            <Link href={user === undefined || user === null ? '/login' : getUserHome(user.user.role)}>
              <a className={clsx(['btn btn-sm  flex items-center gap-2 text-base-100 sm:btn-md'])}>
                {user === undefined || user === null ? (
                  'Login / Signup'
                ) : (
                  <>
                    <span>Go to home</span> <IconPhHouse />
                  </>
                )}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
