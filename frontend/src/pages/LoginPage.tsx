import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../hooks/useTasks';

const schema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setServerError('');
        try {
            await login(data.email, data.password);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            setServerError(getErrorMessage(error));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-primary-glow rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[50%] bg-info-light rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[420px] bg-surface border border-border rounded-xl p-10 shadow-lg shadow-black/40 relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-[54px] h-[54px] rounded-lg bg-primary-light border-primary/20 text-primary mb-4 drop-shadow-[0_0_15px_rgba(108,99,255,0.3)]">
                        <CheckSquare size={28} />
                    </div>
                    <h1 className="text-[1.625rem] font-extrabold text-text-primary mb-1 tracking-tight">Welcome back</h1>
                    <p className="text-sm text-text-muted">Sign in to your TaskFlow account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {serverError && (
                        <div className="flex items-center gap-2 p-3 bg-danger-light border border-danger/20 rounded-lg text-sm font-medium text-danger">
                            <AlertCircle size={16} />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-[0.8125rem] font-medium text-text-secondary tracking-wide flex items-center gap-1" htmlFor="email">
                            <Mail size={13} /> Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            className={`w-full h-11 px-4 bg-surface-2 border ${errors.email ? 'border-danger focus:ring-danger-light' : 'border-border focus:border-primary focus:ring-primary-light'} rounded-lg text-[0.9375rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] transition-all`}
                            {...register('email')}
                        />
                        {errors.email && (
                            <span className="text-[0.78125rem] text-danger flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[0.8125rem] font-medium text-text-secondary tracking-wide flex items-center gap-1" htmlFor="password">
                            <Lock size={13} /> Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className={`w-full h-11 px-4 pr-11 bg-surface-2 border ${errors.password ? 'border-danger focus:ring-danger-light' : 'border-border focus:border-primary focus:ring-primary-light'} rounded-lg text-[0.9375rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] transition-all`}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-[0.78125rem] text-danger flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.password.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 mt-2 inline-flex items-center justify-center gap-2 bg-primary text-white text-[0.9375rem] font-semibold rounded-md shadow-[0_4px_16px_rgba(108,99,255,0.35)] hover:bg-primary-hover hover:shadow-[0_4px_24px_rgba(108,99,255,0.5)] hover:-translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
