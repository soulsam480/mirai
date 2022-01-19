import { Prisma } from '@prisma/client';
import { atom } from 'jotai';

// export interface User extends Prisma.AccountGetPayload {
//   accessToken?: string;
// }

type User = Prisma.AccountGetPayload<{
  include: { owner: true; tenant: true };
}>;

export const userAtom = atom<Partial<User>>({});

export const loggedInAtom = atom((get) => !!Object.keys(get(userAtom)).length);
