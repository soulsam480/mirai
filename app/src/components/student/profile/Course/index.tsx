import { useAtomValue } from 'jotai'
import React from 'react'
import { z } from 'zod'
import { useScore } from '../../../../contexts'
import { semUpdateSchema } from '@mirai/schema'
import { studentScoreAtom, useUser } from '../../../../stores'
import { CourseCard } from './CourseCard'

interface Props {}

export const Course: React.FC<Props> = () => {
  const { updateScoreCard } = useScore()
  const userData = useUser()
  const studentScore = useAtomValue(studentScoreAtom)

  function handleSemUpdate(semId: number, data: z.infer<typeof semUpdateSchema>) {
    if (userData.studentId === null) return

    updateScoreCard({
      studentId: userData.studentId,
      data: {
        ...((studentScore?.scores as any) ?? {}),
        [String(semId)]: data,
      },
    })
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-medium leading-6">Course info</div>

      <CourseCard onSemUpdate={handleSemUpdate} />
    </div>
  )
}
