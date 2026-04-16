import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { JwtPayload } from '../types/auth.types';
import { AuthRequest } from '../types/express.types';
import { env } from '../config/env';

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];

        let payload: JwtPayload;
        try {
            payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        } catch {
            res.status(401).json({ success: false, message: 'Invalid or expired token' });
            return;
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: payload.userId } });

        if (!user) {
            res.status(401).json({ success: false, message: 'User no longer exists' });
            return;
        }

        req.user = { id: user.id, email: user.email, name: user.name };
        next();
    } catch (error) {
        next(error);
    }
};
