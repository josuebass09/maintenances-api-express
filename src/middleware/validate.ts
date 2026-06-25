import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ');
        next(ApiError.badRequest(messages));
      } else {
        next(err);
      }
    }
  };
