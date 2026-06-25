import { Car } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';
import { CreateCarInput, UpdateCarInput } from './cars.schema';

export async function getCars(ownerId: string): Promise<Car[]> {
  return prisma.car.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCar(licensePlate: string, ownerId: string): Promise<Car> {
  const car = await prisma.car.findFirst({
    where: { licensePlate, ownerId },
  });

  if (!car) {
    throw ApiError.notFound(`Car with license plate '${licensePlate}' not found`);
  }

  return car;
}

export async function createCar(data: CreateCarInput, ownerId: string): Promise<Car> {
  return prisma.car.create({
    data: {
      ...data,
      ownerId,
    },
  });
}

export async function updateCar(
  licensePlate: string,
  data: UpdateCarInput,
  ownerId: string,
): Promise<Car> {
  const car = await prisma.car.findFirst({
    where: { licensePlate, ownerId },
  });

  if (!car) {
    throw ApiError.notFound(`Car with license plate '${licensePlate}' not found`);
  }

  return prisma.car.update({
    where: { id: car.id },
    data,
  });
}

export async function deleteCar(licensePlate: string, ownerId: string): Promise<void> {
  const car = await prisma.car.findFirst({
    where: { licensePlate, ownerId },
  });

  if (!car) {
    throw ApiError.notFound(`Car with license plate '${licensePlate}' not found`);
  }

  await prisma.car.delete({ where: { id: car.id } });
}
