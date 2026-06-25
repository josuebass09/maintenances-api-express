import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';
import { UpdateUserInput } from './users.schema';

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

export async function getMe(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return sanitizeUser(user);
}

export async function updateMe(userId: string, data: UpdateUserInput): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return sanitizeUser(updated);
}
