import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../types/express.types';

const taskService = new TaskService();

export const getTasks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const tasks = await taskService.getTasksForUser(req.user!.id);
        res.status(200).json({ success: true, data: { tasks } });
    } catch (error) {
        next(error);
    }
};

export const getTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const task = await taskService.getTaskById(req.params.id as string, req.user!.id);
        res.status(200).json({ success: true, data: { task } });
    } catch (error) {
        next(error);
    }
};

export const createTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const task = await taskService.createTask(req.body, req.user!.id);
        // Re-fetch to return populated relations
        const populated = await taskService.getTaskById(task.id, req.user!.id);
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task: populated },
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const task = await taskService.updateTask(req.params.id as string, req.body, req.user!.id);
        const populated = await taskService.getTaskById(task.id, req.user!.id);
        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: { task: populated },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await taskService.deleteTask(req.params.id as string, req.user!.id);
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};
