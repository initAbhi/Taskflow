import { AppDataSource } from '../config/database';
import { Task, TaskStatus, TaskType } from '../entities/Task';
import { User } from '../entities/User';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';
import { createError } from '../middleware/error.middleware';

export class TaskService {
    private taskRepo = AppDataSource.getRepository(Task);
    private userRepo = AppDataSource.getRepository(User);

    /**
     * Get all tasks visible to a user (created by them OR assigned to them)
     */
    async getTasksForUser(userId: string): Promise<Task[]> {
        return this.taskRepo
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.creator', 'creator')
            .leftJoinAndSelect('task.assignee', 'assignee')
            .where('task.creatorId = :userId OR task.assigneeId = :userId', { userId })
            .orderBy('task.createdAt', 'DESC')
            .getMany();
    }

    /**
     * Get a single task by ID, ensuring the user has access
     */
    async getTaskById(taskId: string, userId: string): Promise<Task> {
        const task = await this.taskRepo
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.creator', 'creator')
            .leftJoinAndSelect('task.assignee', 'assignee')
            .where('task.id = :taskId', { taskId })
            .getOne();

        if (!task) {
            throw createError('Task not found', 404);
        }

        if (task.creatorId !== userId && task.assigneeId !== userId) {
            throw createError('You do not have access to this task', 403);
        }

        return task;
    }

    /**
     * Create a new task. If assigneeId is provided, it becomes an assigned task.
     */
    async createTask(input: CreateTaskInput, creatorId: string): Promise<Task> {
        if (input.assigneeId) {
            if (input.assigneeId === creatorId) {
                throw createError('You cannot assign a task to yourself', 400);
            }

            const assignee = await this.userRepo.findOne({ where: { id: input.assigneeId } });
            if (!assignee) {
                throw createError('Assignee not found', 404);
            }
        }

        const task = this.taskRepo.create({
            title: input.title,
            description: input.description ?? null,
            status: input.status ?? TaskStatus.TODO,
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            creatorId,
            assigneeId: input.assigneeId ?? null,
            type: input.assigneeId ? TaskType.ASSIGNED : TaskType.PERSONAL,
        });

        return this.taskRepo.save(task);
    }

    /**
     * Update a task with strict role-based permission enforcement.
     *
     * Assignee:   can ONLY update `status`
     * Creator:    can update title, description, dueDate, assigneeId — but NOT status
     */
    async updateTask(taskId: string, input: UpdateTaskInput, userId: string): Promise<Task> {
        const task = await this.getTaskById(taskId, userId);

        const isCreator = task.creatorId === userId;
        const isAssignee = task.assigneeId === userId;

        if (!isCreator && !isAssignee) {
            throw createError('You do not have permission to update this task', 403);
        }

        if (isAssignee && !isCreator) {
            // Assignee can ONLY change status
            if (
                input.title !== undefined ||
                input.description !== undefined ||
                input.dueDate !== undefined ||
                input.assigneeId !== undefined
            ) {
                throw createError(
                    'As an assignee, you can only update the task status',
                    403
                );
            }

            if (input.status !== undefined) {
                task.status = input.status;
            }
        } else if (isCreator) {
            // Creator can change everything EXCEPT status of an assigned task
            const finalAssigneeId = input.assigneeId !== undefined ? input.assigneeId : task.assigneeId;

            if (input.status !== undefined && finalAssigneeId !== null) {
                throw createError(
                    'As the assigner, you cannot update the task status',
                    403
                );
            }

            if (input.status !== undefined) task.status = input.status;
            if (input.title !== undefined) task.title = input.title;
            if (input.description !== undefined) task.description = input.description ?? null;
            if (input.dueDate !== undefined)
                task.dueDate = input.dueDate ? new Date(input.dueDate) : null;

            if (input.assigneeId !== undefined) {
                if (input.assigneeId === null) {
                    // Removing assignee — reverts to personal task
                    task.assigneeId = null;
                    task.type = TaskType.PERSONAL;
                } else {
                    if (input.assigneeId === userId) {
                        throw createError('You cannot assign a task to yourself', 400);
                    }
                    const assignee = await this.userRepo.findOne({ where: { id: input.assigneeId } });
                    if (!assignee) {
                        throw createError('Assignee not found', 404);
                    }
                    task.assigneeId = input.assigneeId;
                    task.type = TaskType.ASSIGNED;
                }
            }
        }

        return this.taskRepo.save(task);
    }

    /**
     * Delete a task. Only the creator can delete.
     */
    async deleteTask(taskId: string, userId: string): Promise<void> {
        const task = await this.getTaskById(taskId, userId);

        if (task.creatorId !== userId) {
            throw createError('Only the task creator can delete this task', 403);
        }

        await this.taskRepo.remove(task);
    }
}
