import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../hooks/useTasks';

const schema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(100),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setServerError('');
        try {
            await registerUser(data.name, data.email, data.password);
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

            <div className="w-full max-w-[420px] bg-surface border border-border rounded-xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_80px_rgba(108,99,255,0.06)] relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-[54px] h-[54px] rounded-lg bg-primary-light border border-primary/20 text-primary mb-4 drop-shadow-[0_0_20px_rgba(108,99,255,0.3)]">
                        <CheckSquare size={28} />
                    </div>
                    <h1 className="text-[1.625rem] font-extrabold text-text-primary mb-1 tracking-tight">Create account</h1>
                    <p className="text-sm text-text-muted">Join TaskFlow and get organized</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {serverError && (
                        <div className="flex items-center gap-2 p-3 bg-danger-light border border-danger/20 rounded-lg text-sm font-medium text-danger">
                            <AlertCircle size={16} />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[0.8125rem] font-medium text-text-secondary flex items-center gap-1" htmlFor="name">
                            <User size={13} /> Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            placeholder="John Doe"
                            className={`w-full h-11 px-4 bg-surface-2 border ${errors.name ? 'border-danger focus:ring-danger-light' : 'border-border focus:border-primary focus:ring-primary-light'} rounded-lg text-[0.9375rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] transition-all`}
                            {...register('name')}
                        />
                        {errors.name && <span className="text-[0.78125rem] text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} />{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[0.8125rem] font-medium text-text-secondary flex items-center gap-1" htmlFor="email">
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
                        {errors.email && <span className="text-[0.78125rem] text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} />{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[0.8125rem] font-medium text-text-secondary flex items-center gap-1" htmlFor="password">
                            <Lock size={13} /> Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Min. 6 characters"
                            className={`w-full h-11 px-4 bg-surface-2 border ${errors.password ? 'border-danger focus:ring-danger-light' : 'border-border focus:border-primary focus:ring-primary-light'} rounded-lg text-[0.9375rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] transition-all`}
                            {...register('password')}
                        />
                        {errors.password && <span className="text-[0.78125rem] text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} />{errors.password.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[0.8125rem] font-medium text-text-secondary flex items-center gap-1" htmlFor="confirmPassword">
                            <Lock size={13} /> Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Re-enter password"
                            className={`w-full h-11 px-4 bg-surface-2 border ${errors.confirmPassword ? 'border-danger focus:ring-danger-light' : 'border-border focus:border-primary focus:ring-primary-light'} rounded-lg text-[0.9375rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] transition-all`}
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <span className="text-[0.78125rem] text-danger flex items-center gap-1 mt-1"><AlertCircle size={12} />{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 mt-2 inline-flex items-center justify-center gap-2 bg-primary text-white text-[0.9375rem] font-semibold rounded-md shadow-[0_4px_16px_rgba(108,99,255,0.35)] hover:bg-primary-hover hover:shadow-[0_4px_24px_rgba(108,99,255,0.5)] hover:-translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                        {isSubmitting ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
