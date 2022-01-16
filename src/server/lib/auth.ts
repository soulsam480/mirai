import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export function createTokens(id: string): { refreshToken: string; accessToken: string } {
  const refreshToken = sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '14d',
  });
  const accessToken = sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15min',
  });

  return { refreshToken, accessToken };
}

export async function comparePassword(password: string, hashedPass: string) {
  return await compare(password, hashedPass);
}

export async function hashPass(password: string) {
  return await hash(password, parseInt(process.env.HASH as string));
}
