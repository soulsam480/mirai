import { studentOnboardingSchema } from '@mirai/schema'
import { z } from 'zod'
import miraiClient from '../db'
import snakeCase from 'lodash/snakeCase'

interface CreateStudentParams extends z.infer<typeof studentOnboardingSchema> {
  instituteId: number
}

export async function isUniqueId(id: string, instituteId: number) {
  const student = await miraiClient.student.findFirst({
    where: { uniId: id, instituteId },
    select: { uniId: true, instituteId: true },
  })

  return student === null
}

export async function createStudent({
  batchId,
  departmentId,
  courseId,
  instituteId,
  uniId,
  email,
  password,
  ...rest
}: CreateStudentParams) {
  if (!(await isUniqueId(uniId, instituteId)))
    return {
      success: false,
      message: 'Non-unique university ID',
    }

  const institute = await miraiClient.institute.findFirst({
    where: { id: instituteId },
    select: { code: true, name: true, id: true },
  })

  if (institute === null)
    return {
      success: false,
      message: 'Institute doesn"t exist',
    }

  const { code, name } = institute

  // create student
  const { id: studentId } = await miraiClient.student.create({
    data: {
      instituteId,
      batchId,
      departmentId,
      courseId,
      // TODO: fix the code generation
      code: [code ?? name.toLowerCase(), uniId].map(snakeCase).join('_'),
      uniId,
    },
  })

  // add basics
  await miraiClient.studentBasics.create({
    data: {
      ...rest,
      studentId,
      primaryEmail: email,
    },
  })

  const batch = await miraiClient.batch.findFirst({
    where: { id: batchId },
    select: { id: true, startsAt: true },
  })

  if (batch === null) return

  await miraiClient.studentScore.create({
    data: {
      studentId,
      courseStartedAt: batch.startsAt,
      currentTerm: 0,
      lateralEntry: false,
      scores: '{}',
    },
  })

  // create and link account
  await miraiClient.account.create({
    data: {
      email,
      password,
      studentId,
      role: 'STUDENT',
      emailVerified: false,
    },
  })

  return {
    success: true,
    message: 'Student created',
    studentId,
  }
}
