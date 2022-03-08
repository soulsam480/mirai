import { PrismaClient, Role } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { WithExcludeClient } from 'server/context';
import { isInstituteRole } from '../../utils/helpers';

export type JwtPayload = {
  id: number;
  role: Role;
  expiryDate?: number;
};

export async function comparePassword(password: string, hashedPass: string) {
  return await compare(password, hashedPass);
}

export async function hashPass(password: string) {
  return await hash(password, parseInt(process.env.HASH as string));
}

export function prismaQueryHelper(client: WithExcludeClient) {
  return {
    async getAccount(role: 'STUDENT' | 'INSTITUTE' | 'INSTITUTE_MOD' | 'ADMIN', email?: string, id?: number) {
      let account;

      if (role === 'STUDENT') {
        account = await client.account.findFirst({
          where: { email, id },
          include: { tenant: true },
        });
      } else if (isInstituteRole(role).is) {
        account = await client.account.findFirst({
          where: { email, id },
          select: {
            owner: true,
            ...client.$exclude('account', ['password', 'otp', 'otpExpiry', 'emailToken']),
          },
        });
      } else {
        account = await client.account.findFirst({
          where: { email, id },
          select: client.$exclude('account', ['password', 'otp', 'otpExpiry', 'emailToken']),
        });
      }

      return account;
    },
  };
}

export function getServerSideAuthGuard(
  role: Role[],
  redirect = '/login',
  /**
   * Should only retunr props
   */
  serverFn?: GetServerSideProps,
): GetServerSideProps {
  return async (ctx) => {
    redirect = redirect || '/login';

    const user = await getSession({ req: ctx.req });

    if (!user || !role.includes(user.user.role)) {
      return {
        redirect: {
          destination: !user
            ? redirect
            : user.user.role === 'ADMIN'
            ? '/admin'
            : isInstituteRole(user.user.role).is
            ? '/institute'
            : '/student',
          permanent: false,
        },
      };
    }

    return (
      (serverFn && serverFn(ctx)) || {
        props: {},
      }
    );
  };
}
