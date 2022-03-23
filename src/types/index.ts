import { TRPCClientErrorLike } from '@trpc/client';
import { UseTRPCQueryOptions } from '@trpc/react';
import { AnyRouter, inferProcedureInput, inferProcedureOutput, ProcedureRecord } from '@trpc/server';
import { AppRouter } from 'server/routers/_app';

export type TRPCErrorType = TRPCClientErrorLike<AnyRouter>;

type inferProcedures<TObj extends ProcedureRecord<any, any, any, any>> = {
  [TPath in keyof TObj]: {
    input: inferProcedureInput<TObj[TPath]>;
    output: inferProcedureOutput<TObj[TPath]>;
  };
};

type TQueryValues = inferProcedures<AppRouter['_def']['queries']>;

export type QueryOptions<
  TPath extends keyof TQueryValues & string,
  TError = TRPCClientErrorLike<AppRouter>,
> = UseTRPCQueryOptions<TPath, TQueryValues[TPath]['input'], TQueryValues[TPath]['output'], TError>;
