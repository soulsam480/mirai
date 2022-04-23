import { AppLayout } from 'components/globals/AppLayout'
import { Column, MTable } from 'lib/MTable'
import { StudentsListingType, useStudents } from 'contexts/useStudents'
import { useEffect, useMemo } from 'react'
import { NextPageWithLayout } from '../_app'
import { useStudentFilters } from 'contexts'
import { DepartmentFilter } from 'components/institute/student/DepartmentFilter'
import { BatchFilter } from 'components/institute/student/BatchFilter'
import { CourseFilter } from 'components/institute/student/CourseFilter'
import { useAtomValue } from 'jotai'
import { instituteAssetsLoading } from 'stores/institute'
import MSpinner from 'components/lib/MSpinner'
import { studentFiltersAtom } from 'stores/student'
import { NameFilter } from 'components/institute/student/NameFilter'
import { useResetAtom } from 'jotai/utils'
import { UniIdFilter } from 'components/institute/student/UniIdFilter'

const InstituteStudents: NextPageWithLayout = () => {
  useStudentFilters()

  const filtersLoading = useAtomValue(instituteAssetsLoading)
  const { isLoading, students } = useStudents()
  const setFilters = useResetAtom(studentFiltersAtom)

  const columns = useMemo<Array<Column<StudentsListingType>>>(
    () => [
      {
        field: 'id',
        label: 'ID',
      },
      {
        field: 'name',
        format: (student) => <>{student.basics?.name ?? '-'}</>,
        label: 'Name',
      },
      {
        field: 'uniId',
        label: 'Registration number',
      },
      {
        field: 'batch',
        format: (student) => <>{student.Batch?.name}</>,
        label: 'Batch',
      },
      {
        field: 'department',
        format: (student) => <>{student.Department?.name}</>,
        label: 'Department',
      },
      {
        field: 'course',
        format: (student) => <>{student.course?.programName}</>,
        label: 'Course',
      },
    ],
    [],
  )

  useEffect(() => {
    return () => {
      void setFilters()
    }
  }, [setFilters])

  return (
    <div className="flex flex-col gap-2">
      <div className="border-b border-base-200 pb-2 text-xl font-medium">Students</div>

      <div className="flex flex-col gap-1">
        <div className="text-sm">Filter students</div>

        <div className="flex flex-wrap items-center gap-1">
          {filtersLoading === true ? (
            <div className="flex items-center space-x-2">
              <MSpinner size="20px" /> <span>Loading filters...</span>
            </div>
          ) : (
            <>
              <BatchFilter />
              <DepartmentFilter />
              <CourseFilter />
              <NameFilter />
              <UniIdFilter />
            </>
          )}
        </div>
      </div>

      <MTable
        className="mt-4"
        columns={columns}
        rows={students}
        compact
        noDataLabel={'No students were found !'}
        loading={isLoading}
      />
    </div>
  )
}

InstituteStudents.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default InstituteStudents
