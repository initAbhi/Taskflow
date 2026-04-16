import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types/express.types';

const authService = new AuthService();

export const register = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { user, token } = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            data: { user: req.user },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await authService.getAllUsers();
        // Exclude the current user from the list (can't assign to yourself)
        const filtered = users.filter((u) => u.id !== req.user?.id);
        res.status(200).json({
            success: true,
            data: { users: filtered },
        });
    } catch (error) {
        next(error);
    }
};
