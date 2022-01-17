import { Prisma } from '@prisma/client';
import { atom } from 'jotai';

export interface User extends Prisma.AccountSelect {
  accessToken?: string;
  refreshToken?: string;
}

export const userAtom = atom<User>({});

export const isLoggedIn = atom((get) => !!Object.keys(get(userAtom)).length);
