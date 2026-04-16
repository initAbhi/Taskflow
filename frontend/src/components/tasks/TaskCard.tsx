import React from 'react';
import { format } from 'date-fns';
import { Calendar, User, Edit2, Trash2, Clock } from 'lucide-react';
import type { Task } from '../../types';
import { TaskStatus, TaskType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useDeleteTask } from '../../hooks/useTasks';

interface Props {
    task: Task;
    onEdit: (task: Task) => void;
}

const statusLabel: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'Todo',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
};

const statusClass: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'bg-surface-3 text-text-muted',
    [TaskStatus.IN_PROGRESS]: 'bg-warning/10 text-warning',
    [TaskStatus.DONE]: 'bg-success/10 text-success',
};

export const TaskCard: React.FC<Props> = ({ task, onEdit }) => {
    const { user } = useAuth();
    const deleteTask = useDeleteTask();

    const isCreator = task.creatorId === user?.id;
    const isAssignee = task.assigneeId === user?.id;

    const isDueSoon =
        task.dueDate &&
        task.status !== TaskStatus.DONE &&
        new Date(task.dueDate) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    const isPastDue =
        task.dueDate &&
        task.status !== TaskStatus.DONE &&
        new Date(task.dueDate) < new Date();

    const isDone = task.status === TaskStatus.DONE;

    const handleDelete = async () => {
        if (!confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
        await deleteTask.mutateAsync(task.id);
    };

    return (
        <article className={`p-5 rounded-xl border ${isDone ? 'bg-surface-2/50 border-border/50 opacity-75' : 'bg-surface border-border'} shadow-md transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 relative group`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${statusClass[task.status]}`}>
                        {statusLabel[task.status]}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${task.type === TaskType.PERSONAL ? 'bg-info/10 text-info' : 'bg-primary/10 text-primary'}`}>
                        {task.type === TaskType.PERSONAL ? 'Personal' : 'Assigned'}
                    </span>
                </div>

                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {(isCreator || (isAssignee && !isCreator)) && (
                        <button
                            onClick={() => onEdit(task)}
                            title={isCreator ? 'Edit task' : 'Update status'}
                            className="p-1.5 rounded bg-surface-3 text-text-secondary hover:bg-primary hover:text-white transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                    )}
                    {isCreator && (
                        <button
                            onClick={handleDelete}
                            disabled={deleteTask.isPending}
                            title="Delete task"
                            className="p-1.5 rounded bg-surface-3 text-text-secondary hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            <h3 className={`text-lg font-bold text-text-primary leading-snug mb-2 ${isDone ? 'line-through text-text-muted' : ''}`}>
                {task.title}
            </h3>

            {task.description && (
                <p className={`text-sm text-text-secondary line-clamp-3 mb-4 ${isDone ? 'opacity-70' : ''}`}>
                    {task.description}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto pt-4 border-t border-border/50 text-xs font-medium">
                {task.dueDate && (
                    <span className={`flex items-center gap-1.5 ${isPastDue ? 'text-danger' : isDueSoon ? 'text-warning' : 'text-text-muted'}`}>
                        {isPastDue ? <Clock size={12} /> : <Calendar size={12} />}
                        {isPastDue ? 'Overdue · ' : ''}
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                )}

                {task.assignee ? (
                    <span className="flex items-center gap-1.5 text-text-muted bg-surface-3 px-2 py-1 rounded-md">
                        <User size={12} className={isCreator ? 'text-primary' : 'text-info'} />
                        {isCreator ? `→ ${task.assignee.name}` : `From ${task.creator.name}`}
                    </span>
                ) : !isCreator && (
                    <span className="flex items-center gap-1.5 text-text-muted bg-surface-3 px-2 py-1 rounded-md">
                        <User size={12} />
                        From {task.creator.name}
                    </span>
                )}
            </div>
        </article>
    );
};
