import type {
  StudentBasics,
  StudentScore,
  StudentEducation,
  StudentWorkExperience,
  StudentProject,
  StudentCertification,
  Student,
} from '@prisma/client'
import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { studentsQuerySchema } from 'schemas'
import type { OverWrite } from 'types'
import { z } from 'zod'

export interface StudentValueType {
  basics: StudentBasics | null
  score: StudentScore | null
  education: StudentEducation[]
  experience: StudentWorkExperience[]
  skills: StudentSkill[]
  projects: StudentProject[]
  certifications: StudentCertification[]
  base: Student | null
}

export type StudentSkillScore = 'Beginner' | 'Intermediate' | 'Expert'

export interface StudentSkill {
  name: string
  score: StudentSkillScore
}

export const studentBasicsAtom = atom<StudentBasics | null>(null)
studentBasicsAtom.debugLabel = 'studentBasicsAtom'

export const studentScoreAtom = atom<StudentScore | null>(null)
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
    }
  },
  (_get, set, update) => {
    const { basics, score, education, experience, skills, projects, certifications, base } = update

    set(studentBasicsAtom, basics)
    set(studentScoreAtom, score)
    set(studentEducationAtom, education)
    set(studentExperienceAtom, experience)
    set(studentSkillsAtom, Array.isArray(skills) ? skills : JSON.parse(skills))
    set(studentProjectsAtom, projects)
    set(studentCertificationsAtom, certifications)
    set(studentBaseAtom, base)
  },
)
studentAtom.debugLabel = 'studentAtom'

export type StudentQueryType = Omit<z.infer<typeof studentsQuerySchema>, 'instituteId'>

export const studentFiltersAtom = atomWithReset<StudentQueryType>({ name: '', uniId: '' })
studentFiltersAtom.debugLabel = 'studentFiltersAtom'
