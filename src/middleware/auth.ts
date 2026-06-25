import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

interface JwtPayload {
  sub: string;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (!decoded.sub) {
      return next(ApiError.unauthorized('Invalid token payload'));
    }

    req.userId = decoded.sub;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
