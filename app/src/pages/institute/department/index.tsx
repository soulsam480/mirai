import { AppLayout } from '../../../components/globals/AppLayout'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../../pages/_app'
import { useDepartments } from '../../../contexts'
import type { Department } from '@prisma/client'
import PageLayout from '../../../components/globals/PageLayout'
import { Column, MTable, MLink, MDialog } from '../../../components/lib'
import { ManageDepartment } from '../../../components/institute/department/ManageDepartment'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import IconPhPencilSimple from '~icons/ph/pencil-simple'

// TODO: add support for admin view
export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Departments: NextPageWithLayout = () => {
  const router = useRouter()
  const { departments, isLoading } = useDepartments()

  const columns = useMemo<Array<Column<Department>>>(
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
        field: 'inCharge',
        label: 'In charge',
        format: ({ inCharge }) => <>{inCharge ?? '-'}</>,
      },
      {
        field: 'edit',
        label: 'Edit',
        format: ({ id }) => (
          <MLink href={`/institute/department?departmentId=${id}`} as={`/institute/department/${id}`}>
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
        createActionUrl="/institute/department/create"
        createLabel="Create new"
        headerLabel="Departments"
      />

      <MTable
        className="mt-4"
        columns={columns}
        rows={departments}
        compact
        noDataLabel={'No departments were found !'}
        loading={isLoading}
      />

      <MDialog show={router.query.departmentId !== undefined} onClose={() => null} noEscape>
        <ManageDepartment />
      </MDialog>
    </PageLayout.PageWrapper>
  )
}

Departments.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Departments
