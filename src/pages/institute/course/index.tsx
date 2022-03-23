import { AppLayout } from 'components/globals/AppLayout';
import { getServerSideAuthGuard } from 'server/lib/auth';
import { NextPageWithLayout } from 'pages/_app';
import { useCourses } from 'contexts/useCourse';
import PageLayout from 'components/globals/PageLayout';
import { Column, MTable } from 'components/lib/MTable';
import { useMemo } from 'react';
import { Course } from '@prisma/client';

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD']);

const ProgramListing: NextPageWithLayout = () => {
  const { courses, isLoading } = useCourses();

  const columns = useMemo<Column<Course & { department: { name: string } }>[]>(
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
        field: 'programLevel',
        label: 'Level',
        headerClasses: '!bg-primary',
        classes: 'bg-amber-100',
      },
    ],
    [],
  );

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
    </PageLayout.PageWrapper>
  );
};

ProgramListing.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ProgramListing;
