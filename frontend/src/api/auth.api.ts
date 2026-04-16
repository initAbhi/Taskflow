import { apiClient } from './client';
import type { AuthResponse, ApiResponse, User } from '../types';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export const authApi = {
    register: (data: RegisterPayload) =>
        apiClient.post<AuthResponse>('/auth/register', data),

    login: (data: LoginPayload) =>
        apiClient.post<AuthResponse>('/auth/login', data),

    getMe: () =>
        apiClient.get<ApiResponse<{ user: User }>>('/auth/me'),

    getUsers: () =>
        apiClient.get<ApiResponse<{ users: User[] }>>('/auth/users'),
};
