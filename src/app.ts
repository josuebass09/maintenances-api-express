import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './modules/auth/auth.routes';
import { carsRouter } from './modules/cars/cars.routes';
import { maintenancesRouter } from './modules/maintenances/maintenances.routes';
import { usersRouter } from './modules/users/users.routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRouter);
  app.use('/cars', carsRouter);
  app.use('/maintenances', maintenancesRouter);
  app.use('/users', usersRouter);

  app.use(errorHandler);

  return app;
};
