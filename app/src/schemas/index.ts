import { StudentScoreType } from '@prisma/client'
import dayjs from 'dayjs'
import { z } from 'zod'
import { MOBILE_REGEX, PASSWORD_REGEX } from './regex'

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

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Required'),
  domain: z.string().min(1, 'Required'),
  description: z.string().nullable(),
  startedAt: z
    .string()
    .min(1, 'Started at is required')
    .transform((val) => dayjs(val).toISOString()),
  endedAt: z
    .string()
    .nullable()
    .transform((val) => (val !== null && val.length > 0 ? dayjs(val).toISOString() : null)),
  studentId: z.number(),
  isOngoing: z.boolean().default(false).optional(),
})

export const createCertificationSchema = z.object({
  name: z.string().min(1, 'Required'),
  institute: z.string().min(1, 'Required'),
  documentName: z.string().min(1),
  subject: z.string().nullable(),
  identificationNumber: z.string(),
  score: z.string().nullable(),
  description: z.string().nullable(),
  scoreType: z
    .string()
    .nullable()
    .transform((val) => (val !== null && val.trim()?.length === 0 ? null : (val as StudentScoreType | null)))
    .refine(
      (val) => (val !== null && val.length > 0 ? ['PERCENTAGE', 'CGPA', 'GRADES'].includes(val) : true),
      'Score type is required !',
    ),
  date: z
    .string()
    .nullable()
    .transform((val) => (val !== null && val.length > 0 ? dayjs(val).toISOString() : null)),
  expiresAt: z
    .string()
    .nullable()
    .transform((val) => (val !== null && val.length > 0 ? dayjs(val).toISOString() : null)),
  studentId: z.number(),
})

export const createSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  score: z.enum(['Beginner', 'Intermediate', 'Expert']),
})

export const studentsQuerySchema = z.object({
  instituteId: z.number(),
  departmentId: z.number().optional(),
  courseId: z.number().optional(),
  batchId: z.number().optional(),
  uniId: z
    .string()
    .optional()
    .transform((val) => (val !== undefined && val?.length > 0 ? val : undefined)),
  name: z
    .string()
    .optional()
    .transform((val) => (val !== undefined && val?.length > 0 ? val : undefined)),
})

const ticketType = z.enum(['STUDENT_ONBOARDING', 'STUDENT_UPDATE_DATA', 'STUDENT_SUPPORT'])
export type TicketType = z.infer<typeof ticketType>
const ticketStatus = z.enum(['OPEN', 'INPROGRESS', 'CLOSED', 'RESOLVED'])

export const createTicketSchema = z.object({
  instituteId: z.number(),
  meta: z.object({
    data: z.any(),
    type: ticketType,
  }),
  status: ticketStatus,
  notes: z.string().optional(),
})

export const studentOnboardingSchema = z
  .object({
    name: z.string().min(1, 'Required'),
    email: z.string().min(1, 'Required'),
    password: z
      .string()
      .min(1, 'Required')
      .regex(
        PASSWORD_REGEX,
        'password must be atleast eight characters including one uppercase letter, one special character and alphanumeric characters',
      ),
    repassword: z.string().min(1, 'Required'),
    category: z.string().min(1, 'Required'),
    dob: z
      .string()
      .min(1, 'Required')
      .transform((val) => (val.length > 0 ? dayjs(val).toISOString() : '')),
    gender: z.string().min(1, 'Required'),
    mobileNumber: z.string().min(1, 'Required').regex(MOBILE_REGEX, 'Invalid phone number'),
    uniId: z.string().min(1, 'Required'),
    departmentId: z.number(),
    courseId: z.number(),
    batchId: z.number(),
  })
  .refine((val) => val.password === val.repassword, {
    message: 'Both passwords should match',
    path: ['repassword'],
  })

export const tourSchema = z.object({
  id: z.number(),
  showTour: z.boolean(),
})

export const ticketListingInput = z.object({
  type: ticketType.optional(),
  status: ticketStatus.optional(),
  instituteId: z.number().optional(),
  createdAt: z.object({
    type: z.enum(['gte', 'lt']),
    value: z.string().transform((val) => {
      return val.length > 0 ? dayjs(val).toISOString() : ''
    }),
  }),
  sort: z.enum(['asc', 'desc']),
})

export const generateOnboardingUrlSchema = z.object({
  departmentId: z.number(),
  courseId: z.number(),
  batchId: z.number(),
  instituteId: z.number(),
  name: z.string().optional(),
})
