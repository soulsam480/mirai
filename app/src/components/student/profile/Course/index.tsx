import React from 'react'
import { CourseCard } from './CourseCard'

interface Props {}

export const Course: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-medium leading-6">Course</div>

      <CourseCard />
    </div>
  )
}
