/* eslint-disable no-console */

/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient } from '@prisma/client'
import { hashPass } from '../api/src/lib'

const prisma = new PrismaClient()

async function main() {
  const password = await hashPass('sambit')
  console.log('seed-password', password)

  console.log('Setting up admin account')
  await prisma.account.upsert({
    where: {
      id: 1,
    },
    create: {
      role: 'ADMIN',
      email: 'soulsam480@gmail.com',
      password: await hashPass('sambit'),
      name: 'Sambit Sahoo',
    },
    update: {},
  })

  const institute = await instituteSeed()

  await studentSeed(institute)
}

async function instituteSeed() {
  console.log('Setting up institute')

  const { id, name } = await prisma.institute.upsert({
    where: {
      id: 1,
    },
    create: {
      name: 'IGIT Sarang',
      code: 'igit_sarang',
      status: 'ONBOARDED',
    },
    update: {},
  })

  await prisma.account.upsert({
    where: {
      id: 2,
    },
    create: {
      name,
      email: 'igit@gmail.com',
      password: await hashPass('sambit'),
      role: 'INSTITUTE',
      instituteId: id,
      isOwner: true,
      studentId: null,
      emailVerified: false,
    },
    update: {},
  })

  console.log('setting up department')

  const { id: departmentId } = await prisma.department.upsert({
    where: {
      id: 1,
    },
    create: {
      name: 'Mechanical Engg. Dept',
      instituteId: id,
    },
    update: {},
  })

  console.log('setting up course')

  const { id: courseId } = await prisma.course.upsert({
    where: { id: 1 },
    create: {
      instituteId: id,
      departmentId,
      programDuration: 8,
      branchName: 'ME',
      branchCode: 'ME',
      programName: 'BTech',
      scoreType: 'CGPA',
      programDurationType: 'SEMESTER',
      programLevel: 'UG',
    },
    update: {},
  })

  console.log('setting up batch')

  const { id: batchId } = await prisma.batch.upsert({
    where: {
      id: 1,
    },
    create: {
      name: '2018-2022',
      duration: '4 Years',
      durationType: 'YEAR',
      status: 'ACTIVE',
      instituteId: id,
    },
    update: {},
  })

  return {
    instituteId: id,
    departmentId,
    courseId,
    batchId,
  }
}

async function studentSeed({
  batchId,
  courseId,
  departmentId,
  instituteId,
}: {
  instituteId: number
  departmentId: number
  courseId: number
  batchId: number
}) {
  console.log('Setting up student')

  const { id: studentId } = await prisma.student.upsert({
    where: {
      id: 1,
    },
    create: {
      instituteId,
      batchId,
      departmentId,
      courseId,
      code: 'igit_sarang_1701105535',
      uniId: '1701105535',
    },
    update: {},
  })

  await prisma.account.upsert({
    where: { studentId },
    create: {
      email: 'sambit@gmail.com',
      password: await hashPass('sambit'),
      role: 'STUDENT',
      instituteId: null,
      studentId,
      emailVerified: false,
    },
    update: {},
  })

  return {
    studentId,
  }
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()

    process.exit(0)
  })
