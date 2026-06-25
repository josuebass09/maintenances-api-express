import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/prisma';
import { config } from '../../config';
import { ApiError } from '../../utils/ApiError';
import { RegisterInput, LoginInput } from './auth.schema';

export type SafeUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  emailEnabled: boolean;
  daysBeforeReminder: number[];
  createdAt: Date;
  updatedAt: Date;
};

function sanitizeUser(user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string | null;
  address: string | null;
  emailEnabled: boolean;
  daysBeforeReminder: number[];
  createdAt: Date;
  updatedAt: Date;
}): SafeUser {
  const { passwordHash: _pw, ...safe } = user;
  return safe;
}

export async function register(data: RegisterInput): Promise<SafeUser> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
    },
  });

  return sanitizeUser(user);
}

export async function login(data: LoginInput): Promise<{ token: string; user: SafeUser }> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);

  if (!passwordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  return { token, user: sanitizeUser(user) };
}
