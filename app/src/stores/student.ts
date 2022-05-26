import type {
  StudentBasics,
  StudentScore,
  StudentEducation,
  StudentWorkExperience,
  StudentProject,
  StudentCertification,
  Student,
  Course,
  Batch,
  Department,
  Institute,
} from '@prisma/client'
import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { studentsQuerySchema } from 'schemas'
import type { OverWrite } from 'types'
import { z } from 'zod'

export interface StudentSemScore {
  ongoingBacklogs?: number
  cummScore?: number
  semScore?: number
  totalBacklogs?: number
  verified?: boolean
  verifiedBy?: string
  verifiedOn?: Date
  fileUrl?: string
}

export type StudentScoreType = Record<string, StudentSemScore | undefined>

export interface StudentValueType {
  basics: StudentBasicsOverwrite | null
  score: OverWrite<StudentScore, { scores: StudentScoreType }> | null
  education: StudentEducation[]
  experience: StudentWorkExperience[]
  skills: StudentSkill[]
  projects: StudentProject[]
  certifications: StudentCertification[]
  base: Student | null
  course: StduentCourseComposed | null
}

export type StudentSkillScore = 'Beginner' | 'Intermediate' | 'Expert'

export interface StudentSkill {
  name: string
  score: StudentSkillScore
}

export interface StudentAddress {
  address?: string
  city?: string
  district?: string
  state?: string
  pin?: string
  country?: string
}

export interface StduentCourseComposed {
  course: Pick<Course, 'branchName' | 'programName' | 'programDuration' | 'scoreType'>
  batch: Pick<Batch, 'name' | 'startsAt' | 'endsAt'>
  department: Pick<Department, 'name'>
  institute: Pick<Institute, 'name'>
}

export interface StudentBasicsOverwrite
  extends OverWrite<StudentBasics, { permanentAddress: StudentAddress; currentAddress: StudentAddress }> {}

export const studentBasicsAtom = atom<StudentBasicsOverwrite | null>(null)
studentBasicsAtom.debugLabel = 'studentBasicsAtom'

export const studentScoreAtom = atom<StudentValueType['score'] | null>(null)
studentScoreAtom.debugLabel = 'studentScoreAtom'

export const studentEducationAtom = atom<StudentEducation[]>([])
studentEducationAtom.debugLabel = 'studentEducationAtom'

export const studentExperienceAtom = atom<StudentWorkExperience[]>([])
studentExperienceAtom.debugLabel = 'studentExperienceAtom'

export const studentSkillsAtom = atom<StudentSkill[]>([])
studentSkillsAtom.debugLabel = 'studentSkillsAtom'

export const studentProjectsAtom = atom<StudentProject[]>([])
studentProjectsAtom.debugLabel = 'studentProjectsAtom'

export const studentCertificationsAtom = atom<StudentCertification[]>([])
studentCertificationsAtom.debugLabel = 'StudentCertificationsAtom'

export const studentBaseAtom = atom<Student | null>(null)
studentBaseAtom.debugLabel = 'studentBaseAtom'

export const studentCourseAtom = atom<StduentCourseComposed | null>(null)
studentCourseAtom.debugLabel = 'studentCourseAtom'

export const studentAtom = atom<StudentValueType, OverWrite<StudentValueType, { skills: string | StudentSkill[] }>>(
  (get) => {
    return {
      basics: get(studentBasicsAtom),
      score: get(studentScoreAtom),
      education: get(studentEducationAtom),
      experience: get(studentExperienceAtom),
      skills: get(studentSkillsAtom),
      projects: get(studentProjectsAtom),
      certifications: get(studentCertificationsAtom),
      base: get(studentBaseAtom),
      course: get(studentCourseAtom),
    }
  },
  (_get, set, update) => {
    const { basics, score, education, experience, skills, projects, certifications, base, course } = update

    set(studentBasicsAtom, basics)
    set(studentScoreAtom, score)
    set(studentEducationAtom, education)
    set(studentExperienceAtom, experience)
    set(studentSkillsAtom, Array.isArray(skills) ? skills : JSON.parse(skills))
    set(studentProjectsAtom, projects)
    set(studentCertificationsAtom, certifications)
    set(studentBaseAtom, base)
    set(studentCourseAtom, course)
  },
)
studentAtom.debugLabel = 'studentAtom'

export type StudentQueryType = Omit<z.infer<typeof studentsQuerySchema>, 'instituteId'>

export const studentFiltersAtom = atomWithReset<StudentQueryType>({ name: '', uniId: '' })
studentFiltersAtom.debugLabel = 'studentFiltersAtom'
