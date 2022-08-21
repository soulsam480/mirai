import { createTicketSchema, studentOnboardingSchema } from './../schemas/index'
import { TRPCClientErrorLike } from '@trpc/client'
import { UseTRPCQueryOptions } from '@trpc/react'
import { inferProcedureInput, inferProcedureOutput, ProcedureRecord } from '@trpc/server'
import type { AppRouter } from '@mirai/api'
import { MLinkProps } from '../components/lib'
import React from 'react'
import type { z } from 'zod'

export type TRPCErrorType = TRPCClientErrorLike<AppRouter>

type inferProcedures<TObj extends ProcedureRecord<any, any, any, any>> = {
  [TPath in keyof TObj]: {
    input: inferProcedureInput<TObj[TPath]>
    output: inferProcedureOutput<TObj[TPath]>
  }
}

type TQueryValues = inferProcedures<AppRouter['_def']['queries']>

export type QueryOptions<
  TPath extends keyof TQueryValues & string,
  TError = TRPCClientErrorLike<AppRouter>,
> = UseTRPCQueryOptions<
  TPath,
  TQueryValues[TPath]['input'],
  TQueryValues[TPath]['output'],
  TQueryValues[TPath]['output'],
  TError
>

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
