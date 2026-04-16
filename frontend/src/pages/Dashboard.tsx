import React, { useState } from 'react';
import { Plus, ListTodo, AlertCircle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { Navbar } from '../components/layout/Navbar';

export const Dashboard: React.FC = () => {
    const { data: tasks, isLoading, error } = useTasks();
    const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const filteredTasks = tasks?.filter((t) => filter === 'ALL' || t.status === filter) || [];

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    return (
        <>
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 py-10 min-h-[calc(100vh-64px)] animate-fade-in relative">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-glow rounded-full blur-[120px] pointer-events-none opacity-50" />

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 relative z-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-text-primary mb-2">My Tasks</h1>
                        <p className="text-text-secondary">Manage your personal and assigned tasks.</p>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="flex w-full md:w-auto justify-center md:justify-start items-center gap-2 px-5 py-3 md:py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>
                </header>

                {/* Filters */}
                <div className="w-full overflow-x-auto pb-2 -mb-2 border-b border-transparent mb-6 hide-scrollbar relative z-10">
                    <div className="flex bg-surface-2 p-1 rounded-lg border border-border inline-flex mb-8 relative z-10 shadow-sm min-w-max">
                        {(['ALL', TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-md text-[0.8125rem] sm:text-sm font-semibold transition-all select-none ${filter === status
                                    ? 'bg-surface border border-border shadow-sm text-text-primary'
                                    : 'text-text-muted hover:text-text-primary'
                                    }`}
                            >
                                {status === 'ALL' ? 'All Tasks' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Task Grid State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
                        <div className="spinner mb-4" />
                        <p className="text-text-muted">Loading your tasks...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
                        <div className="w-16 h-16 rounded-full border-2 border-danger-light bg-danger/10 flex items-center justify-center text-danger mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            <AlertCircle size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Failed to load tasks</h3>
                        <p className="text-text-muted">There was an error communicating with the server.</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center bg-surface-2/40 border border-dashed border-border rounded-2xl relative z-10">
                        <div className="w-16 h-16 rounded-full bg-surface-3 flex items-center justify-center text-text-muted mb-5 shadow-inner">
                            <ListTodo size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                            {filter === 'ALL' ? 'No tasks yet' : `No ${filter.toLowerCase()} tasks`}
                        </h3>
                        <p className="text-text-muted max-w-md mx-auto mb-6">
                            {filter === 'ALL'
                                ? "You haven't created or been assigned any tasks. Get started by creating your first task."
                                : "You don't have any tasks with this status."}
                        </p>
                        {filter === 'ALL' && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-text-primary bg-surface-3 border border-border hover:bg-surface-3 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Create your first task</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {filteredTasks.map((task) => (
                            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default Dashboard;
