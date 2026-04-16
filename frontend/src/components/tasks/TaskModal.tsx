import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../api/auth.api';
import type { Task } from '../../types';
import { TaskStatus, TaskType } from '../../types';
import { useCreateTask, useUpdateTask, getErrorMessage } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';

const schema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(5000).optional().nullable(),
    status: z.nativeEnum(TaskStatus),
    dueDate: z.string().optional().nullable(),
    assigneeId: z.string().uuid().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface Props {
    task?: Task | null;
    onClose: () => void;
}

export const TaskModal: React.FC<Props> = ({ task, onClose }) => {
    const { user } = useAuth();
    const [serverError, setServerError] = useState('');
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const isEditing = !!task;
    const isAssignee = task?.assigneeId === user?.id && task?.creatorId !== user?.id;
    const isCreator = task?.creatorId === user?.id;

    const { data: usersData } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await authApi.getUsers();
            return res.data.data.users;
        },
    });

    const defaultValues: FormData = {
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? TaskStatus.TODO,
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
        assigneeId: task?.assigneeId ?? null,
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues });

    const currentAssigneeId = watch('assigneeId');

    const onSubmit = async (data: FormData) => {
        setServerError('');
        try {
            if (isEditing && task) {
                if (isAssignee && !isCreator) {
                    await updateTask.mutateAsync({ id: task.id, data: { status: data.status } });
                } else {
                    const patch: Record<string, unknown> = {
                        title: data.title,
                        description: data.description || null,
                        dueDate: data.dueDate || null,
                        assigneeId: data.assigneeId || null,
                    };
                    if (!data.assigneeId) patch.status = data.status;
                    await updateTask.mutateAsync({ id: task.id, data: patch });
                }
            } else {
                await createTask.mutateAsync({
                    title: data.title,
                    description: data.description || null,
                    status: data.status,
                    dueDate: data.dueDate || null,
                    assigneeId: data.assigneeId || null,
                });
            }
            onClose();
        } catch (error) {
            setServerError(getErrorMessage(error));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-xl shadow-2xl animate-scale-in">

                <div className="flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-text-primary">{isEditing ? 'Edit Task' : 'New Task'}</h2>
                    <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-3 rounded-md transition-colors" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
                    {serverError && (
                        <div className="flex items-center gap-2 p-3 bg-danger-light border border-danger/20 rounded-lg text-sm text-danger font-medium">
                            <AlertCircle size={16} />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {isEditing && isAssignee && !isCreator && (
                        <div className="flex items-center gap-2 p-3 bg-info/10 border border-info/20 rounded-lg text-sm text-info font-medium">
                            <AlertCircle size={14} />
                            <span>As assignee, you can only update the status.</span>
                        </div>
                    )}
                    {isEditing && isCreator && task.type === TaskType.ASSIGNED && (
                        <div className="flex items-center gap-2 p-3 bg-info/10 border border-info/20 rounded-lg text-sm text-info font-medium">
                            <AlertCircle size={14} />
                            <span>As assigner, you cannot update the task status.</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary" htmlFor="title">Title *</label>
                        <input
                            id="title"
                            className={`w-full h-11 px-4 bg-surface-2 border ${errors.title ? 'border-danger focus:ring-danger/30' : 'border-border focus:border-primary focus:ring-primary/20'} rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            placeholder="What needs to be done?"
                            disabled={isAssignee && !isCreator}
                            {...register('title')}
                        />
                        {errors.title && <span className="text-xs text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} />{errors.title.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="w-full min-h-[90px] p-3 bg-surface-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Optional details..."
                            disabled={isAssignee && !isCreator}
                            {...register('description')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isEditing && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text-secondary" htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    className="w-full h-11 px-4 pr-10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239491b4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] bg-surface-2 border border-border rounded-lg text-sm text-text-primary focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    disabled={isCreator && !!currentAssigneeId && isEditing}
                                    {...register('status')}
                                >
                                    <option value={TaskStatus.TODO} className="bg-surface-2 text-text-primary">Todo</option>
                                    <option value={TaskStatus.IN_PROGRESS} className="bg-surface-2 text-text-primary">In Progress</option>
                                    <option value={TaskStatus.DONE} className="bg-surface-2 text-text-primary">Done</option>
                                </select>
                            </div>
                        )}

                        <div className={`space-y-1 ${!isEditing ? 'md:col-span-2' : ''}`}>
                            <label className="text-sm font-medium text-text-secondary" htmlFor="dueDate">Due Date</label>
                            <input
                                id="dueDate"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full h-11 px-4 bg-surface-2 border border-border rounded-lg text-sm text-text-primary focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed [color-scheme:dark]"
                                disabled={isAssignee && !isCreator}
                                {...register('dueDate')}
                            />
                        </div>
                    </div>

                    {(!isEditing || isCreator) && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-secondary" htmlFor="assigneeId">Assign to</label>
                            <Controller
                                name="assigneeId"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        id="assigneeId"
                                        className="w-full h-11 px-4 pr-10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239491b4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] bg-surface-2 border border-border rounded-lg text-sm text-text-primary focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value || null)}
                                        disabled={isAssignee && !isCreator}
                                    >
                                        <option value="" className="bg-surface-2 text-text-primary">Personal Task (No assignee)</option>
                                        {usersData?.map((u) => (
                                            <option key={u.id} value={u.id} className="bg-surface-2 text-text-primary">{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text-primary bg-surface-2 border border-border hover:bg-surface-3 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
