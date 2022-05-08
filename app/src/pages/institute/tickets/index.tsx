import { AppLayout } from 'components/globals/AppLayout'
import { NextPageWithLayout } from 'pages/_app'
import { getServerSideAuthGuard } from 'server/lib/auth'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const TicketListing: NextPageWithLayout = () => {
  return <div>Ticket List</div>
}

TicketListing.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default TicketListing
