import { createTicketSchema, studentOnboardingSchema } from './../schemas/index'
import { MLinkProps } from '../components/lib'
import React from 'react'
import type { z } from 'zod'
import { TRPCClientError } from '@trpc/client'
import { AppRouter } from '@mirai/api'

export type QueryOptions<Fn extends (...args: any[]) => any, RT = ReturnType<Fn>> = Fn extends (
  a: infer _A,
  b: infer B,
) => RT
  ? B
  : Fn extends (a: infer A) => RT
  ? A
  : never

export type TRPCErrorType = TRPCClientError<AppRouter>

export type OverWrite<T, K> = Omit<T, keyof K> & K
export type NullToUndefined<T> = T extends null ? undefined : T

export interface Option<T = any> {
  label: string
  value: T
  meta?: any
}

export interface SidebarItem {
  path: string
  label: string
  active?: MLinkProps['active']
  icon?: React.ReactNode
  id?: string
}

export type StudentTicketShape = OverWrite<
  z.infer<typeof createTicketSchema>['meta'],
  { data: z.infer<typeof studentOnboardingSchema> }
>

export type StudentProfileIgnore = 'verified' | 'verifiedBy' | 'verifiedOn' | 'createdAt' | 'updatedAt'

export type AnyObject = Record<string, any>
