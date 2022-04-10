import { TRPCClientErrorLike } from '@trpc/client'
import { UseTRPCQueryOptions } from '@trpc/react'
import { AnyRouter, inferProcedureInput, inferProcedureOutput, ProcedureRecord } from '@trpc/server'
import type { AppRouter } from '@mirai/api'

export type TRPCErrorType = TRPCClientErrorLike<AnyRouter>

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
> = UseTRPCQueryOptions<TPath, TQueryValues[TPath]['input'], TQueryValues[TPath]['output'], TError>

export type OverWrite<T, K> = Omit<T, keyof K> & K
export type NullToUndefined<T> = T extends null ? undefined : T

export interface Option {
  label: string
  value: any
  meta?: any
}
