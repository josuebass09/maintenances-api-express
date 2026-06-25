import { Request, Response, NextFunction } from 'express';
import * as maintenancesService from './maintenances.service';
import { CreateMaintenanceInput, UpdateMaintenanceInput } from './maintenances.schema';

export async function getMaintenancesHandler(
  req: Request<object, object, object, { carId?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { carId } = req.query;
    const maintenances = await maintenancesService.getMaintenances(req.userId, { carId });
    res.status(200).json({ data: maintenances });
  } catch (err) {
    next(err);
  }
}

export async function getMaintenanceHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const maintenance = await maintenancesService.getMaintenance(req.params.id, req.userId);
    res.status(200).json({ data: maintenance });
  } catch (err) {
    next(err);
  }
}

export async function createMaintenanceHandler(
  req: Request<object, object, CreateMaintenanceInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const maintenance = await maintenancesService.createMaintenance(req.body, req.userId);
    res.status(201).json({ data: maintenance });
  } catch (err) {
    next(err);
  }
}

export async function updateMaintenanceHandler(
  req: Request<{ id: string }, object, UpdateMaintenanceInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const maintenance = await maintenancesService.updateMaintenance(
      req.params.id,
      req.body,
      req.userId,
    );
    res.status(200).json({ data: maintenance });
  } catch (err) {
    next(err);
  }
}

export async function deleteMaintenanceHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await maintenancesService.deleteMaintenance(req.params.id, req.userId);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
