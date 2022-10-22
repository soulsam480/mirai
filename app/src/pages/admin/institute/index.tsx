import type { Institute } from '@prisma/client'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import IconPhPencilSimple from '~icons/ph/pencil-simple'
import { ManageInstitute } from '../../../components/admin/institute/ManageInstitute'
import { AppLayout } from '../../../components/globals/AppLayout'
import PageLayout from '../../../components/globals/PageLayout'
import { Column, MDialog, MLink, MTable } from '../../../components/lib'
import { useInstitutes } from '../../../contexts'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../_app'

export const getServerSideProps = getServerSideAuthGuard(['ADMIN'])

interface Props {}

function getStatusClass(status: Institute['status']) {
  switch (status) {
    case 'INPROGRESS':
      return 'badge-info'

    case 'ONBOARDED':
      return 'badge-success'

    case 'PENDING':
      return 'badge-error'
  }
}

const Institutes: NextPageWithLayout<Props, any> = () => {
  const router = useRouter()
  const { isLoading, institutes } = useInstitutes()

  const columns = useMemo<Array<Column<Institute>>>(
    () => [
      {
        field: 'id',
        label: 'ID',
      },
      {
        field: 'name',
        label: 'Name',
      },
      {
        field: 'status',
        label: 'Status',
        format: (row) => <span className={clsx([getStatusClass(row.status), 'badge'])}>{row.status}</span>,
      },
      {
        field: 'code',
        label: 'Code',
      },
      {
        field: '',
        label: 'Edit',
        format: ({ id }) => (
          <MLink href={`/admin/institute?instituteId=${id}`} as={`/admin/institute/${id}`}>
            <IconPhPencilSimple className="text-lg" />
          </MLink>
        ),
      },
    ],
    [],
  )

  return (
    <PageLayout.PageWrapper>
      <PageLayout.PageHeader
        headerLabel="Institutes"
        createLabel="Create new"
        createActionUrl="/admin/institute/create"
      />

      <MTable
        className="mt-4"
        columns={columns}
        rows={institutes}
        compact
        noDataLabel={'No institutes were found! Add one to get started'}
        loading={isLoading}
      />

      {/* contextual routing for instant feedback. Reloads will show actual page */}
      <MDialog show={router.query.instituteId !== undefined} onClose={() => null} noEscape>
        <ManageInstitute />
      </MDialog>
    </PageLayout.PageWrapper>
  )
}

Institutes.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Institutes
