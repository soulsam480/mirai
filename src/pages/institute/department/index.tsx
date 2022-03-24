import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { Department } from '@prisma/client'
import { Column, MTable } from 'components/lib/MTable'
import PageLayout from 'components/globals/PageLayout'
import { useMemo } from 'react'
import { trpc } from 'utils/trpc'
import { loggedInAtom, useUser } from 'stores/user'
import { useAtomValue } from 'jotai'

// TODO: add support for admin view
export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const Departments: NextPageWithLayout = () => {
  const userData = useUser()
  const isLoggedIn = useAtomValue(loggedInAtom)

  const { data: departments = [] } = trpc.useQuery(['department.getAll', userData.instituteId as number], {
    enabled: isLoggedIn,
  })

  const columns = useMemo<Array<Column<Department>>>(
    () => [
      {
        field: 'id',
        label: 'ID',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'name',
        label: 'Name',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'inCharge',
        label: 'In charge',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        format: ({ inCharge }) => <>{inCharge ?? '-'}</>,
      },
      // TODO: add edit setup
      //   {
      //     key: '',
      //     label: 'Edit',
      //     headerClasses: '!bg-primary',
      //     classes: 'bg-amber-100',
      //     format: ({ id }) => (
      //       <MLink href={`/admin/institute?instituteId=${id}`} as={`/admin/institute/${id}`}>
      //         <IconLaPenSquare className="text-lg" />
      //       </MLink>
      //     ),
      //   },
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
      />
    </PageLayout.PageWrapper>
  )
}

Departments.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default Departments
