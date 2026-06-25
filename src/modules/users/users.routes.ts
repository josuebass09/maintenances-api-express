import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { UpdateUserSchema } from './users.schema';
import { getMeHandler, updateMeHandler } from './users.controller';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', getMeHandler);
usersRouter.put('/me', validate(UpdateUserSchema), updateMeHandler);
