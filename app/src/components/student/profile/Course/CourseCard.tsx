import MFeatureCard from 'components/lib/MFeatureCard'
import { useAtomValue } from 'jotai'
import React from 'react'
import { studentCourseAtom, studentScoreAtom } from 'stores/student'

interface Props {}

export const CourseCard: React.FC<Props> = () => {
  const courseData = useAtomValue(studentCourseAtom)
  const _score = useAtomValue(studentScoreAtom)

  if (courseData === null) return null

  return (
    <MFeatureCard.Parent>
      <MFeatureCard.Body>
        <div className="text-lg">
          {courseData.course.programName}, {courseData.course.branchName}
        </div>

        <div className="text-sm text-base-content/60">
          {courseData.department.name} | {courseData.batch.name} Batch
        </div>
        <div className="text-sm text-base-content/60">{courseData.institute.name} </div>
      </MFeatureCard.Body>
    </MFeatureCard.Parent>
  )
}
