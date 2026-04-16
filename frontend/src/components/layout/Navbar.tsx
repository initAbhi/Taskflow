import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-[100] bg-surface/85 backdrop-blur-xl border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

                <Link to="/dashboard" className="flex items-center gap-2 group text-decoration-none">
                    <CheckSquare size={22} className="text-primary drop-shadow-[0_0_8px_rgba(108,99,255,0.3)] transition-transform group-hover:scale-110" />
                    <span className="text-[1.125rem] font-extrabold text-text-primary tracking-[-0.03em] bg-gradient-to-br from-white to-primary bg-clip-text text-transparent">
                        TaskFlow
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 max-w-[150px] sm:max-w-none">
                        <div className="w-[30px] h-[30px] shrink-0 rounded-full bg-primary-light border border-primary/30 flex items-center justify-center text-primary">
                            <User size={14} />
                        </div>
                        <span className="text-[0.875rem] hidden sm:block font-medium text-text-secondary truncate">{user?.name}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-md bg-transparent text-text-muted text-[0.8125rem] font-medium border border-transparent hover:bg-danger-light hover:text-danger hover:border-danger/20 transition-all cursor-pointer"
                        title="Logout"
                    >
                        <LogOut size={18} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

            </div>
        </nav>
    );
};
