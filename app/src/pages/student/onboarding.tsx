import { onBoardingTokens } from '@mirai/api'
import { useAlert } from 'components/lib/store/alerts'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps: GetServerSideProps<{
  name?: string
  error: string | null
}> = async ({ query }) => {
  const { payload } = query

  if (payload === undefined || typeof payload !== 'string') {
    return {
      props: {
        error: 'Onboarding URL is invalid',
      },
    }
  }

  try {
    const data = onBoardingTokens.decode(payload)

    return {
      props: {
        name: data.name,
        error: null,
      },
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        props: {
          error: 'Onboarding URL has expired',
        },
      }
    } else if (error instanceof JsonWebTokenError) {
      return {
        props: {
          error: 'Onboarding URL is invalid',
        },
      }
    } else {
      return {
        props: {
          error: 'Unable to process Onboarding request',
        },
      }
    }
  }
}

const StudentOnboarding: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  error,
  name,
}) => {
  const setAlert = useAlert()

  useEffect(() => {
    if (error !== null) {
      setAlert({
        type: 'danger',
        message: error,
      })
    }
  }, [error, setAlert])

  return <div>{name ?? 'some error'}</div>
}

export default StudentOnboarding
