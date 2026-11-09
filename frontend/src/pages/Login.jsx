
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { login } from '../services/api';

import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    GraduationCap,
    ShieldCheck,
    Sparkles,
    BookOpen,
    Trophy,
    Users
} from 'lucide-react';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setError('');

        try {

            const response = await login(username, password);

            if (!response || !response.token) {
                throw new Error(
                    response?.message || 'Authentication token not received.'
                );
            }

            const role = String(response.role || '').toUpperCase();

            if (!['ADMIN', 'FACULTY', 'STUDENT'].includes(role)) {
                throw new Error('Invalid user role.');
            }

            localStorage.setItem('token', response.token);
            localStorage.setItem('role', role);
            localStorage.setItem(
                'username',
                response.username || username.trim()
            );

            navigate('/dashboard', { replace: true });

        } catch (err) {

            console.error('LOGIN ERROR:', err);

            setError(
                err.message ||
                'Login failed. Please check your credentials.'
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen w-full bg-[#080d1b] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

            {/* Background effects */}

            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-6xl min-h-[650px] grid grid-cols-1 lg:grid-cols-2 bg-[#111a2e]/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
            >

                {/* LEFT PANEL */}

                <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden bg-gradient-to-br from-[#14264a] via-[#172044] to-[#25184b]">

                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />

                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-[100px]" />

                    {/* Logo */}

                    <div className="relative z-10 flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center shadow-lg">

                            <GraduationCap size={27} />

                        </div>

                        <div>

                            <h1 className="text-xl font-bold tracking-wide">
                                CAMPUS<span className="text-blue-400">X</span>
                            </h1>

                            <p className="text-[10px] text-blue-200/60 tracking-[3px]">
                                LEARN. COMPETE. EXCEL.
                            </p>

                        </div>

                    </div>

                    {/* Main content */}

                    <div className="relative z-10 max-w-lg">

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-300/20 bg-blue-300/10 text-blue-200 text-xs mb-8">

                            <Sparkles size={14} />

                            YOUR CAMPUS. YOUR POTENTIAL.

                        </div>

                        <h2 className="text-5xl xl:text-6xl font-bold leading-[1.15] mb-6">

                            Turn Your

                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300">
                                Potential
                            </span>

                            Into Performance.

                        </h2>

                        <p className="text-slate-300/80 text-base leading-8 max-w-md">

                            Learn new skills, participate in competitions,
                            track your progress and benchmark yourself against
                            the best students on campus.

                        </p>

                        {/* Features */}

                        <div className="grid grid-cols-3 gap-3 mt-12">

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                                <Trophy size={22} className="text-yellow-300 mb-3" />

                                <p className="text-sm font-semibold">Compete</p>

                                <p className="text-[11px] text-slate-400 mt-1">
                                    Challenge yourself
                                </p>

                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                                <BookOpen size={22} className="text-blue-300 mb-3" />

                                <p className="text-sm font-semibold">Learn</p>

                                <p className="text-[11px] text-slate-400 mt-1">
                                    Build new skills
                                </p>

                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

                                <Users size={22} className="text-violet-300 mb-3" />

                                <p className="text-sm font-semibold">Connect</p>

                                <p className="text-[11px] text-slate-400 mt-1">
                                    Grow together
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="relative z-10 flex items-center justify-between text-xs text-slate-400/70">

                        <span>© 2026 CampusX</span>

                        <span className="flex items-center gap-2">

                            <ShieldCheck size={15} />

                            Secure Campus Portal

                        </span>

                    </div>

                </div>

                {/* RIGHT LOGIN PANEL */}

                <div className="flex items-center justify-center p-7 sm:p-12 lg:p-14">

                    <div className="w-full max-w-md">

                        {/* Mobile logo */}

                        <div className="flex lg:hidden items-center gap-3 mb-12">

                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">

                                <GraduationCap size={25} />

                            </div>

                            <div>

                                <h1 className="font-bold text-lg">
                                    CAMPUS<span className="text-blue-400">X</span>
                                </h1>

                                <p className="text-[10px] text-slate-400 tracking-widest">
                                    CAMPUS PORTAL
                                </p>

                            </div>

                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                        >

                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-7">

                                <LockKeyhole size={27} className="text-blue-400" />

                            </div>

                            <p className="text-blue-400 text-sm font-semibold tracking-wider mb-3">
                                WELCOME BACK
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">

                                Sign in to your

                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                                    Campus Account
                                </span>

                            </h2>

                            <p className="text-slate-400 text-sm leading-6 mb-5">

                                Enter your assigned credentials to access
                                your learning dashboard.

                            </p>

                            <div className="mb-7 rounded-xl border border-blue-400/20 bg-blue-400/5 p-4 text-xs text-slate-300">
                                <p className="mb-2 font-semibold text-blue-300">Demo student account</p>
                                <p>Username: <strong className="text-white">student1</strong></p>
                                <p>Password: <strong className="text-white">Student@123</strong></p>
                                <p className="mt-2 text-slate-400">Faculty: faculty1 / Faculty@123 · Admin: admin / Admin@123</p>
                            </div>

                            {/* Error */}

                            {error && (

                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm break-words"
                                >

                                    {error}

                                </motion.div>

                            )}

                            {/* Login form */}

                            <form
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >

                                <div>

                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full px-4 py-4 rounded-xl bg-[#1b2942] border border-white/10 text-white placeholder:text-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    />

                                </div>

                                <div>

                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-4 pr-12 rounded-xl bg-[#1b2942] border border-white/10 text-white placeholder:text-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                            aria-label="Toggle password visibility"
                                        >

                                            {showPassword
                                                ? <EyeOff size={19} />
                                                : <Eye size={19} />
                                            }

                                        </button>

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 py-4 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5"
                                >

                                    {loading ? (

                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing you in...
                                        </>

                                    ) : (

                                        <>
                                            Sign In
                                            <ArrowRight size={19} />
                                        </>

                                    )}

                                </button>

                            </form>

                            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-500">

                                <ShieldCheck size={15} className="text-emerald-400" />

                                Your account is protected with secure authentication.

                            </div>

                        </motion.div>

                    </div>

                </div>

            </motion.div>

        </div>

    );
};

export default Login;
