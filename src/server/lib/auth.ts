import { createHmac } from 'crypto';
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

export function comparePassword(password: string, hashedPass: string) {
  return hashPass(password) === hashedPass;
}

export function hashPass(password: string) {
  return createHmac(password, process.env.HASH).update(password).digest('hex');
}
