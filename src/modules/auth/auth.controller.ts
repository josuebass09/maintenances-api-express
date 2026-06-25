import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { RegisterInput, LoginInput } from './auth.schema';

export async function registerHandler(
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ data: user, message: 'Account created' });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}
