import { StudentScoreType } from '@prisma/client'
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

export const createStudentBasicsSchema = z.object({
  studentId: z.number().min(1, 'Student ID is required'),
  name: z.string().min(1, 'Student name is required'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => new Date(val) instanceof Date),
  gender: z.string().min(1, 'Gender is required'),
  category: z.string().min(1, 'Category is required'),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  primaryEmail: z.string().min(1, 'Primary email is required'),
  secondaryEmail: z.string(),
  permanentAddress: z.string(),
  currentAddress: z.string(),
})

export const createStudentScoreSchema = z.object({
  studentId: z.number().min(1, 'Student ID is required'),
  aggregatePercentage: z.string().min(1, 'Aggregate percentage is required'),
  currentTerm: z.number().min(1, 'Current term is required'),
  hasGraduated: z.boolean({ required_error: 'Please mention if student has graduated or not' }),
  lateralEntry: z.boolean({ required_error: 'Please mention if student has lateral entry or not' }),
  hasBacklog: z.boolean({ required_error: 'Please mention  if student has backlog or not' }),
  totalBacklogs: z.number().min(1, 'Please mention total backlogs'),
  backlogDetails: z.string().min(1, 'Please mention backlog details'),
  scores: z.string().min(1, 'Scores are required'),
  courseStartedAt: z.date({ required_error: 'Course start date is required' }),
})

export const createStudentEducationSchema = z.object({
  studentId: z.number().min(1, 'Student ID is required'),
  school: z.string().min(1, 'School is required'),
  program: z.string().min(1, 'Program is required'),
  board: z.string().min(1, 'Board is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  type: z
    .string()
    .min(1)
    .refine((val) => ['Full Time', 'Part Time', 'Correspondence', 'Others'].includes(val)),
  notes: z.string().min(1, 'Description is required'),
  score: z.string().min(1, 'Score is required'),
  scorePercentage: z.string().min(1, 'Score percentage is required'),
  scoreType: z.enum(['PERCENTAGE', 'CGPA', 'GRADES']),
  startedAt: z
    .string()
    .min(1, 'Start date is required')
    .transform((val) => dayjs(val).toISOString()),
  endedAt: z
    .string()
    .nullable()
    .transform((val) => (val !== null && val.length > 0 ? dayjs(val).toISOString() : null)),
  isOngoing: z.boolean().optional(),
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
