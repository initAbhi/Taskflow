import { apiClient } from './client';
import type { ApiResponse, Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

export const tasksApi = {
    getTasks: () =>
        apiClient.get<ApiResponse<{ tasks: Task[] }>>('/tasks'),

    getTask: (id: string) =>
        apiClient.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`),

    createTask: (data: CreateTaskPayload) =>
        apiClient.post<ApiResponse<{ task: Task }>>('/tasks', data),

    updateTask: (id: string, data: UpdateTaskPayload) =>
        apiClient.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data),

    deleteTask: (id: string) =>
        apiClient.delete<ApiResponse<null>>(`/tasks/${id}`),
};
