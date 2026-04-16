import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import type { CreateTaskPayload, UpdateTaskPayload } from '../types';
import axios from 'axios';

export const TASKS_QUERY_KEY = ['tasks'];

export const useTasks = () => {
    return useQuery({
        queryKey: TASKS_QUERY_KEY,
        queryFn: async () => {
            const res = await tasksApi.getTasks();
            return res.data.data.tasks;
        },
        staleTime: 30_000,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTaskPayload) => tasksApi.createTask(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
            tasksApi.updateTask(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tasksApi.deleteTask(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    });
};

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
            return apiErrors.map((e: { message: string }) => e.message).join(', ');
        }
        return error.response?.data?.message || 'An unexpected error occurred';
    }
    if (error instanceof Error) return error.message;
    return 'An unexpected error occurred';
};
