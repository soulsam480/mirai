import React from 'react'
import { semUpdateSchema } from 'schemas'
import { z } from 'zod'
import { CourseCard } from './CourseCard'

interface Props {}

export const Course: React.FC<Props> = () => {
  function handleSemUpdate(semId: number, data: z.infer<typeof semUpdateSchema>) {
    console.log(semId, data)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-medium leading-6">Course info</div>

      <CourseCard onSemUpdate={handleSemUpdate} />
    </div>
  )
}
