import dayjs from 'dayjs'
import { z } from 'zod'

export const createInstituteSchema = z.object({
  code: z.string().min(1, "Code shouldn't be empty"),
  name: z.string().min(1, "Name shouldn't be empty"),
  status: z.enum(['ONBOARDED', 'INPROGRESS', 'PENDING']),
  logo: z.string().optional(),
})

export const manageInstituteSchema = createInstituteSchema.extend({ email: z.string().email() })

export const LoginSchema = z.object({
  email: z.string().email().min(1, 'Email required'),
  password: z.string().min(1, 'Password required'),
})

export const signupSchema = z.object({
  email: z.string().email(),
  role: z.enum(['STUDENT', 'INSTITUTE', 'INSTITUTE_MOD', 'ADMIN']),
  instituteId: z.number().optional(),
  studentId: z.number().optional(),
  name: z.string().optional(),
})

export const createCourseSchema = z.object({
  instituteId: z.number(),
  departmentId: z.number(),
  programDuration: z.number(),
  branchName: z.string().min(1),
  branchCode: z.string().min(1),
  programName: z.string().min(1),
  scoreType: z.enum(['CGPA', 'PERCENTAGE']),
  programDurationType: z.enum(['SEMESTER', 'YEAR']),
  programLevel: z.enum(['UG', 'PG', 'PHD']),
})

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name shouldn't be empty"),
  inCharge: z.string().optional(),
  instituteId: z.number(),
})

export const createBatchSchema = z.object({
  name: z.string().min(1, "Batch name shouldn't be empty"),
  instituteId: z.number(),
  duration: z.string().min(1, "Batch duration name shouldn't be empty"),
  durationType: z.enum(['YEAR', 'MONTH', 'WEEK', 'DAY']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})

export const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Type is required'),
  jobType: z.string().min(1, 'Position type is required'),
  companySector: z.string().min(1, 'Company sector is required'),
  stipend: z.string().nullable(),
  notes: z.string().nullable(),
  startedAt: z
    .string()
    .min(1, 'Started at is required')
    .transform((val) => dayjs(val).toISOString()),
  endedAt: z
    .string()
    .nullable()
    .transform((val) => (val !== null && val.length > 0 ? dayjs(val).toISOString() : null)),
  isCurriculum: z.boolean(),
  isOngoing: z.boolean().optional(),
  studentId: z.number(),
})
