import { TRPCClientErrorLike } from '@trpc/client';
import { AnyRouter } from '@trpc/server';

export type TRPCErrorType = TRPCClientErrorLike<AnyRouter>;
