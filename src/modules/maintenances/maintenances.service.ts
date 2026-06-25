import { Maintenance, Car } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';
import { getDateInMonths } from '../../utils/dateHelper';
import { CreateMaintenanceInput, UpdateMaintenanceInput } from './maintenances.schema';

export type MaintenanceWithCar = Maintenance & { car: Car };

export async function getMaintenances(
  ownerId: string,
  filters?: { carId?: string },
): Promise<MaintenanceWithCar[]> {
  return prisma.maintenance.findMany({
    where: {
      ownerId,
      ...(filters?.carId ? { carId: filters.carId } : {}),
    },
    include: { car: true },
    orderBy: { nextMaintenance: 'asc' },
  });
}

export async function getMaintenance(id: string, ownerId: string): Promise<MaintenanceWithCar> {
  const maintenance = await prisma.maintenance.findFirst({
    where: { id, ownerId },
    include: { car: true },
  });

  if (!maintenance) {
    throw ApiError.notFound(`Maintenance record '${id}' not found`);
  }

  return maintenance;
}

export async function createMaintenance(
  data: CreateMaintenanceInput,
  ownerId: string,
): Promise<MaintenanceWithCar> {
  // Verify car belongs to this owner
  const car = await prisma.car.findFirst({
    where: { id: data.carId, ownerId },
  });

  if (!car) {
    throw ApiError.notFound(`Car '${data.carId}' not found or does not belong to you`);
  }

  const now = new Date();
  const nextMaintenance = getDateInMonths(now, data.intervalMonths);

  return prisma.maintenance.create({
    data: {
      name: data.name,
      type: data.type,
      product: data.product,
      odometer: data.odometer,
      carId: data.carId,
      intervalMonths: data.intervalMonths,
      currentMaintenance: now,
      nextMaintenance,
      ownerId,
    },
    include: { car: true },
  });
}

export async function updateMaintenance(
  id: string,
  data: UpdateMaintenanceInput,
  ownerId: string,
): Promise<MaintenanceWithCar> {
  const maintenance = await prisma.maintenance.findFirst({
    where: { id, ownerId },
  });

  if (!maintenance) {
    throw ApiError.notFound(`Maintenance record '${id}' not found`);
  }

  // If carId is being updated, verify the new car belongs to this owner
  if (data.carId) {
    const car = await prisma.car.findFirst({
      where: { id: data.carId, ownerId },
    });

    if (!car) {
      throw ApiError.notFound(`Car '${data.carId}' not found or does not belong to you`);
    }
  }

  // Recalculate nextMaintenance if intervalMonths changes
  const updateData: Partial<{
    type: 'engine' | 'transmission' | 'steer' | 'coolant';
    product: string;
    odometer: number;
    carId: string;
    intervalMonths: number;
    nextMaintenance: Date;
  }> = { ...data };

  if (data.intervalMonths) {
    updateData.nextMaintenance = getDateInMonths(
      maintenance.currentMaintenance,
      data.intervalMonths,
    );
  }

  return prisma.maintenance.update({
    where: { id },
    data: updateData,
    include: { car: true },
  });
}

export async function deleteMaintenance(id: string, ownerId: string): Promise<void> {
  const maintenance = await prisma.maintenance.findFirst({
    where: { id, ownerId },
  });

  if (!maintenance) {
    throw ApiError.notFound(`Maintenance record '${id}' not found`);
  }

  await prisma.maintenance.delete({ where: { id } });
}
