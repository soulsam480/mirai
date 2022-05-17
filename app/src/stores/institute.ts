import { Department, Course, Batch } from '@prisma/client'
import { atom } from 'jotai'

export const instituteDepartments = atom<Department[]>([])
instituteDepartments.debugLabel = 'instituteDepartments'

export const instituteCourses = atom<Course[]>([])
instituteCourses.debugLabel = 'instituteCourses'

export const instituteBatches = atom<Batch[]>([])
instituteBatches.debugLabel = 'instituteBatches'

export const instituteAssetsLoading = atom(false)
instituteAssetsLoading.debugLabel = 'instituteAssetsLoading'
