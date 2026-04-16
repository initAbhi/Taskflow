import { Request } from 'express';
import { AuthenticatedUser } from './auth.types';

export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}
