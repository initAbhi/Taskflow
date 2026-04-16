import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Target, Shield, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg text-text-primary overflow-hidden font-sans selection:bg-primary/30">
            {/* Nav */}
            <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto left-0 right-0">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-light p-1.5 rounded-lg border border-primary/20 text-primary">
                        <CheckSquare size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Sign in
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium bg-surface border border-border px-4 py-2 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all shadow-[0_0_15px_rgba(108,99,255,0.15)]"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>

            {/* Background Glow */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[70%] bg-primary-glow rounded-full blur-[120px] pointer-events-none opacity-50" />

            {/* Hero Section */}
            <main className="relative z-10 pt-44 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
                    Master your workday with{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-info">
                        unrivaled clarity
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-text-muted max-w-2xl mb-10 leading-relaxed">
                    TaskFlow is the ultimate minimalist task management platform. Built for individuals and teams to organize tasks, assign responsibilities, and monitor progress without the clutter.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-base font-semibold rounded-xl shadow-[0_8px_30px_rgba(108,99,255,0.4)] hover:bg-primary-hover hover:-translate-y-1 transition-all"
                    >
                        Get Started for Free <ArrowRight size={18} />
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-2 border border-border text-text-primary text-base font-semibold rounded-xl hover:bg-surface-3 transition-all"
                    >
                        View Dashboard
                    </Link>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-20 w-full max-w-5xl rounded-xl border border-border bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-1000" />
                    <div className="rounded-lg overflow-hidden border border-border/50 bg-surface-2 aspect-video flex items-center justify-center relative">
                        {/* Abstract visual of app structure */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-40">
                            <div className="w-32 h-8 bg-surface-3 rounded-md" />
                            <div className="w-10 h-10 bg-surface-3 rounded-full" />
                        </div>
                        <div className="w-full px-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                            <div className="h-40 bg-surface-3 rounded-xl border border-border/50" />
                            <div className="h-40 bg-surface-3 rounded-xl border border-border/50" />
                            <div className="h-40 bg-surface-3 rounded-xl border border-border/50" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Engineered for pure productivity</h2>
                    <p className="text-text-muted max-w-2xl mx-auto text-lg">Stop managing tools and start managing tasks. Everything you need, completely out of the way.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-surface border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors group">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Focused Execution</h3>
                        <p className="text-text-secondary leading-relaxed">
                            A beautifully responsive interface that puts your active tasks front and center. No distractions, just what needs doing.
                        </p>
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-8 hover:border-info/50 transition-colors group">
                        <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center text-info mb-6 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Team Assignments</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Directly assign tasks to other users in the system. They get notified and you retain control over the core task metadata.
                        </p>
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-8 hover:border-success/50 transition-colors group">
                        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Role-Based Access</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Strict security models mean assignees can update task statuses, but only creators can rename or delete them. Complete safety.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border mt-12 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-sm">
                    <div className="flex items-center gap-2">
                        <CheckSquare size={16} className="text-primary" />
                        <span className="font-semibold text-text-primary">TaskFlow</span>
                    </div>
                    <p>© {new Date().getFullYear()} TaskFlow application. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
