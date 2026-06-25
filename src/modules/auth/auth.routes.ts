import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { RegisterSchema, LoginSchema } from './auth.schema';
import { registerHandler, loginHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', validate(RegisterSchema), registerHandler);
authRouter.post('/login', validate(LoginSchema), loginHandler);
