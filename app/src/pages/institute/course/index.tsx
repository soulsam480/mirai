import { AppLayout } from '../../../components/globals/AppLayout'
import { getServerSideAuthGuard } from '../../../server/lib/auth'
import { NextPageWithLayout } from '../../../pages/_app'
import { useCourses } from '../../../contexts'
import { ManageCourse } from '../../../components/institute/course/ManageCourse'
import PageLayout from '../../../components/globals/PageLayout'
import { useMemo } from 'react'
import type { Course } from '@prisma/client'
import { useRouter } from 'next/router'
import { Column, MDialog, MLink, MTable } from '../../../components/lib'
import IconPhPencilSimple from '~icons/ph/pencil-simple.jsx'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const ProgramListing: NextPageWithLayout = () => {
  const { courses, isLoading } = useCourses()
  const router = useRouter()

  const columns = useMemo<Array<Column<Course & { department: { name: string } }>>>(
    () => [
      {
        field: 'id',
        label: 'ID',
      },
      {
        field: 'programName',
        label: 'Name',
      },
      {
        field: '',
        label: 'Department',

        format: ({ department }) => <> {department.name} </>,
      },
      {
        field: 'scoreType',
        label: 'Score type',
      },
      {
        field: '',
        label: 'Duration',

        format: ({ programDuration, programDurationType }) => (
          <>
            {programDuration} <span className="text-xs"> ({programDurationType}) </span>{' '}
          </>
        ),
      },
      {
        field: 'programLevel',
        label: 'Level',
      },
      {
        field: 'edit',
        label: 'Edit',
        format: ({ id }) => (
          <MLink href={`/institute/course?courseId=${id}`} as={`/institute/course/${id}`}>
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

      <MDialog show={router.query.courseId !== undefined} onClose={() => null} noEscape>
        <ManageCourse />
      </MDialog>
    </PageLayout.PageWrapper>
  )
}

ProgramListing.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default ProgramListing
