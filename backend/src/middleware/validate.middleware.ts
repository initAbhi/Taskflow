import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: (result.error as any).errors.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            req.body = result.data;
            next();
        };
