import { PrismaClient, Role } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { isInstituteRole } from '../../utils/helpers';

export type JwtPayload = {
  id: number;
  role: Role;
};

export function createTokens(payload: JwtPayload): { refreshToken: string; accessToken: string } {
  const refreshToken = sign({ ...payload }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '14d',
  });
  const accessToken = sign({ ...payload }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15min',
  });

  return {
    refreshToken: `refresh-token=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
    accessToken,
  };
}

export async function comparePassword(password: string, hashedPass: string) {
  return await compare(password, hashedPass);
}

export async function hashPass(password: string) {
  return await hash(password, parseInt(process.env.HASH as string));
}

export function prismaQueryHelper(
  client: PrismaClient<
    {
      log: ('query' | 'warn' | 'error')[];
    },
    never,
    false
  >,
) {
  return {
    async getAccount(role: 'STUDENT' | 'INSTITUTE' | 'INSTITUTE_MOD' | 'ADMIN', email?: string, id?: number) {
      let account;

      if (role === 'STUDENT') {
        account = await client.account.findFirst({
          where: { email, id },
          include: { tenant: true },
        });
      } else if (isInstituteRole(role).is) {
        account = await client.account.findFirst({ where: { email, id }, include: { owner: true } });
      } else {
        account = await client.account.findFirst({ where: { email, id } });
      }

      account?.password && (account.password = undefined as any);

      return account;
    },
  };
}
