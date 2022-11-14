export * from './payloads'
export * from './response'
export * from './queueJobs'

export type OverWrite<T, K> = Omit<T, keyof K> & K

export type NotificationSourceType = 'SYSTEM' | 'ADMIN' | 'INSTITUTE' | 'OTHERS'
