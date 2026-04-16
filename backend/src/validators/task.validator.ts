import { z } from 'zod';
import { TaskStatus } from '../entities/Task';

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title must not exceed 255 characters')
        .trim(),
    description: z.string().max(5000).trim().optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.TODO),
    dueDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
        .optional()
        .nullable(),
    assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(255).trim().optional(),
    description: z.string().max(5000).trim().optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional(),
    dueDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
        .optional()
        .nullable(),
    assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
