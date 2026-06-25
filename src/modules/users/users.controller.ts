import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';
import { UpdateUserInput } from './users.schema';

export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await usersService.getMe(req.userId);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateMeHandler(
  req: Request<object, object, UpdateUserInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await usersService.updateMe(req.userId, req.body);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}
