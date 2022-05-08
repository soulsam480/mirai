import { AppLayout } from 'components/globals/AppLayout'
import { NextPageWithLayout } from 'pages/_app'
import { getServerSideAuthGuard } from 'server/lib/auth'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const TicketDetails: NextPageWithLayout = () => {
  return <div>Ticket</div>
}

TicketDetails.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default TicketDetails
