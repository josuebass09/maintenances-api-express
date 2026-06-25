import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { CreateMaintenanceSchema, UpdateMaintenanceSchema } from './maintenances.schema';
import {
  getMaintenancesHandler,
  getMaintenanceHandler,
  createMaintenanceHandler,
  updateMaintenanceHandler,
  deleteMaintenanceHandler,
} from './maintenances.controller';

export const maintenancesRouter = Router();

maintenancesRouter.use(authenticate);

maintenancesRouter.get('/', getMaintenancesHandler);
maintenancesRouter.post('/', validate(CreateMaintenanceSchema), createMaintenanceHandler);
maintenancesRouter.get('/:id', getMaintenanceHandler);
maintenancesRouter.put('/:id', validate(UpdateMaintenanceSchema), updateMaintenanceHandler);
maintenancesRouter.delete('/:id', deleteMaintenanceHandler);
