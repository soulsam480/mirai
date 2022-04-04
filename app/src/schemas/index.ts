import { z } from 'zod'

const DATE_REGEX = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/

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
  name: z.string().min(1, "Department name shouldn't be empty"),
  instituteId: z.number(),
  duration: z.string(),
  durationType: z.enum(['YEAR', 'MONTH', 'WEEK', 'DAY']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})

export const createStudentBasicsSchema = z.object({
  studentId: z.number().min(1, 'Student ID is required'),
  name: z.string().min(1, 'Student name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
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
  verified: z.boolean({ required_error: 'Please mention if student is verified or not' }),
  verifiedOn: z.date(),
  verifiedBy: z.string(),
})

export const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Type is required'),
  jobType: z.string().min(1, 'Position type is required'),
  companySector: z.string().min(1, 'Company sector is required'),
  stipend: z.string().optional(),
  notes: z.string().optional(),
  startedAt: z.string().regex(DATE_REGEX, 'Must be a valid date').min(1, 'Must be a valid date'),
  endedAt: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val === '' || DATE_REGEX.test(val as string)
      },
      { message: 'Must be a valid date' },
    ),
  isCurriculum: z.boolean(),
  isOngoing: z.boolean().optional(),
  studentId: z.number(),
})
