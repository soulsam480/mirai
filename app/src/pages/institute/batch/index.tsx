import { Batch } from '@prisma/client'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { AppLayout } from '../../../components/globals/AppLayout'
import PageLayout from '../../../components/globals/PageLayout'
import ManageBatch from '../../../components/institute/batch/ManageBatch'
import { Column, MDialog, MLink, MTable } from '../../../components/lib'
import { useBatches } from '../../../contexts'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../_app'
import IconPhPencilSimple from '~icons/ph/pencil-simple'

// TODO: add support for admin view
export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Batches: NextPageWithLayout = () => {
  const router = useRouter()
  const { batches, isLoading } = useBatches()

  const columns = useMemo<Array<Column<Batch>>>(
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
        field: 'duration',
        label: 'Duration',
        format: ({ duration, durationType }) => (
          <>
            {duration} <span className="text-xs"> ({durationType}) </span>{' '}
          </>
        ),
      },
      {
        field: 'status',
        label: 'Status',
        // format: ({ inCharge }) => <>{inCharge ?? '-'}</>,
      },
      {
        field: 'edit',
        label: 'Edit',
        format: ({ id }) => (
          <MLink href={`/institute/batch?batchId=${id}`} as={`/institute/batch/${id}`}>
            <IconPhPencilSimple className="text-lg" />
          </MLink>
        ),
      },
    ],
    [],
  )

  return (
    <PageLayout.PageWrapper>
      <PageLayout.PageHeader createActionUrl="/institute/batch/create" createLabel="Create new" headerLabel="Batch" />

      <MTable
        className="mt-4"
        columns={columns}
        rows={batches}
        compact
        noDataLabel={'No batches were found !'}
        loading={isLoading}
      />

      <MDialog show={router.query.batchId !== undefined} onClose={() => null} noEscape>
        <ManageBatch />
      </MDialog>
    </PageLayout.PageWrapper>
  )
}

Batches.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Batches
