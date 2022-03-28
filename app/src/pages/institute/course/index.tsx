import { AppLayout } from 'components/globals/AppLayout'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { NextPageWithLayout } from 'pages/_app'
import { useCourses } from 'contexts'
import PageLayout from 'components/globals/PageLayout'
import { Column, MTable } from 'components/lib/MTable'
import { useMemo } from 'react'
import { Course } from '@prisma/client'
import MLink from 'components/lib/MLink'
import { MDialog } from 'components/lib/MDialog'
import { useRouter } from 'next/router'
import { ManageCourse } from 'components/course/ManageCourse'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const ProgramListing: NextPageWithLayout = () => {
  const { courses, isLoading } = useCourses()
  const router = useRouter()

  const columns = useMemo<Array<Column<Course & { department: { name: string } }>>>(
    () => [
      {
        field: 'id',
        label: 'ID',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'programName',
        label: 'Name',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: '',
        label: 'Department',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        format: ({ department }) => <> {department.name} </>,
      },
      {
        field: 'scoreType',
        label: 'Score type',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: '',
        label: 'Duration',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        format: ({ programDuration, programDurationType }) => (
          <>
            {programDuration} <span className="text-xs"> ({programDurationType}) </span>{' '}
          </>
        ),
      },
      {
        field: 'programLevel',
        label: 'Level',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
      {
        field: 'edit',
        label: 'Edit',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
        format: ({ id }) => (
          <MLink href={`/institute/course?courseId=${id}`} as={`/institute/course/${id}`}>
            <IconLaPenSquare className="text-lg" />
          </MLink>
        ),
      },
    ],
    [],
  )

  return (
    <PageLayout.PageWrapper>
      <PageLayout.PageHeader
        createActionUrl="/institute/course/create"
        createLabel="Create new"
        headerLabel="Courses"
      />

      <MTable
        className="mt-4"
        columns={columns}
        rows={courses}
        compact
        noDataLabel={'No courses were found !'}
        loading={isLoading}
      />

      {/* contextual routing for instant feedback. Reloads will show actual page */}
      <MDialog show={router.query.courseId !== undefined} onClose={async () => await router.push('/institute/course')}>
        {/* //todo: again this is a bug, fix this */}
        <div className="dialog-content">
          <ManageCourse />
        </div>
      </MDialog>
    </PageLayout.PageWrapper>
  )
}

ProgramListing.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default ProgramListing
