import { useEffect, useMemo, useState } from 'react'
import { NextPageWithLayout } from '../_app'
import { useResetAtom } from 'jotai/utils'
import { getServerSideAuthGuard } from '../../server/lib/auth'
import { StudentsListingType, useInstituteAssets, useStudents } from '../../contexts'
import { studentFiltersAtom } from '../../stores'
import { Column, MDialog, MTable } from '../../components/lib'
import { GenerateUrlDialog } from '../../components/institute/student/GenerateUrlDialog'
import { StudentFiltersBlock } from '../../components/institute/student/filters'
import { AppLayout } from '../../components/globals/AppLayout'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const InstituteStudents: NextPageWithLayout = () => {
  useInstituteAssets()

  const { isLoading, students } = useStudents()
  const setFilters = useResetAtom(studentFiltersAtom)
  const [isModal, setModal] = useState(false)

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
      <MDialog show={isModal} onClose={setModal}>
        <GenerateUrlDialog onClose={setModal} />
      </MDialog>

      <div className="flex items-center justify-between pb-2">
        <div className="text-xl font-medium">Students</div>

        <button className="btn btn-outline btn-sm" onClick={() => setModal(true)}>
          generate onboarding URL
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm">Filter students</div>
        <StudentFiltersBlock />
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
