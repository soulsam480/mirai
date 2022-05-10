import { AppLayout } from 'components/globals/AppLayout'
import { Column, MTable } from 'lib/MTable'
import { StudentsListingType, useStudents } from 'contexts/useStudents'
import { useEffect, useMemo } from 'react'
import { NextPageWithLayout } from '../_app'
import { useStudentFilters } from 'contexts'
import { studentFiltersAtom } from 'stores/student'
import { useResetAtom } from 'jotai/utils'
import { useUser } from 'stores/user'
import { trpcClient } from 'utils/trpc'
import { copyToClip } from 'utils/helpers'
import { useAlert } from 'components/lib/store/alerts'
import { getServerSideAuthGuard } from 'server/lib/auth'
import { StudentFiltersBlock } from 'components/institute/student/filters'

export const getServerSideProps = getServerSideAuthGuard(['INSTITUTE', 'INSTITUTE_MOD'])

const InstituteStudents: NextPageWithLayout = () => {
  useStudentFilters()

  const { isLoading, students } = useStudents()
  const setFilters = useResetAtom(studentFiltersAtom)
  const userData = useUser()
  const setAlert = useAlert()

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

  async function generateUrl() {
    try {
      const payload = await trpcClient.mutation('institute.gen_onboarding_token', {
        instituteId: Number(userData.instituteId),
        name: userData.owner?.name ?? '',
      })

      const { origin } = location

      const url = `${origin}/student/onboarding?${new URLSearchParams({ payload }).toString()}`

      void copyToClip(url).then(() => setAlert({ message: 'Signup link copied to clipboard !', type: 'success' }))
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Unable to generate URL',
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between pb-2">
        <div className="text-xl font-medium">Students</div>

        <button className="btn btn-outline btn-sm" onClick={generateUrl}>
          Copy onboarding link
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
