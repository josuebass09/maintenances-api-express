import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { CreateCarSchema, UpdateCarSchema } from './cars.schema';
import {
  getCarsHandler,
  getCarHandler,
  createCarHandler,
  updateCarHandler,
  deleteCarHandler,
} from './cars.controller';

export const carsRouter = Router();

carsRouter.use(authenticate);

carsRouter.get('/', getCarsHandler);
carsRouter.post('/', validate(CreateCarSchema), createCarHandler);
carsRouter.get('/:licensePlate', getCarHandler);
carsRouter.put('/:licensePlate', validate(UpdateCarSchema), updateCarHandler);
carsRouter.delete('/:licensePlate', deleteCarHandler);
