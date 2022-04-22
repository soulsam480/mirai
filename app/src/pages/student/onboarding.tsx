import { GetServerSideProps } from 'next'
import { NextPageWithLayout } from '../_app'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { payload = '' } = query

  return {
    props: {},
  }
}

const StudentOnboarding: NextPageWithLayout = () => {
  return <div>Student onboarding</div>
}

export default StudentOnboarding
