import { Request } from 'express';
import { JwtPayload } from '../utils/jwt.util.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: number };
    }
  }
}

export interface AuthRequest extends Request {
  user?: JwtPayload & { id: number };
}

export {};
