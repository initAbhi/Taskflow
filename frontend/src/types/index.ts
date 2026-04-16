export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export enum TaskStatus {
    TODO = 'Todo',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

export enum TaskType {
    PERSONAL = 'personal',
    ASSIGNED = 'assigned',
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    type: TaskType;
    dueDate: string | null;
    creator: Pick<User, 'id' | 'name' | 'email'>;
    creatorId: string;
    assignee: Pick<User, 'id' | 'name' | 'email'> | null;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface CreateTaskPayload {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: string | null;
    assigneeId?: string | null;
}

export interface UpdateTaskPayload {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: string | null;
    assigneeId?: string | null;
}
