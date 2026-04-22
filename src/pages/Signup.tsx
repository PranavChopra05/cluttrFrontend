import { useRef, useState } from "react"
import { Button } from "../components/Button"
import api from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { FaBrain, FaUser, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export const Signup = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function signUp(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            toast.error("Please enter both username and password");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/api/v1/signup", {
                username,
                password
            });
            toast.success("Account created successfully!");
            navigate("/signin");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Sign up failed");
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') signUp();
    };

    return (
        <div className='relative flex items-center justify-center min-h-screen w-screen p-4 overflow-hidden'>
            {/* Background effects */}
            <div className="mesh-gradient" />
            <div className="noise-overlay" />

            {/* Floating glow orbs */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-[float_9s_ease-in-out_infinite]" />
            <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-[float_11s_ease-in-out_infinite_3s]" />

            <motion.div 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='relative z-10 w-full max-w-[420px]'
            >
                <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
                    {/* Gradient accent line */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-cyan-500 to-transparent" />
                    
                    <div className="p-9">
                        {/* Branding */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center mb-9"
                        >
                            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 border border-violet-500/10 mb-4 shadow-lg shadow-violet-500/5">
                                <FaBrain className="text-violet-400 text-2xl" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight gradient-text">Join Cluttr</h1>
                            <p className="text-slate-500 mt-1.5 text-sm">Start building your second brain</p>
                        </motion.div>

                        {/* Form */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className='space-y-5'
                            onKeyDown={handleKeyDown}
                        >
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Username</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                                    <input 
                                        ref={usernameRef} 
                                        type="text" 
                                        placeholder="Pick a unique username" 
                                        className="w-full bg-white/[0.03] border border-slate-700/50 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all duration-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                                    <input 
                                        ref={passwordRef} 
                                        type="password" 
                                        placeholder="At least 6 characters" 
                                        className="w-full bg-white/[0.03] border border-slate-700/50 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="pt-1">
                                <Button 
                                    fullWidth 
                                    variant="primary" 
                                    text="Create Account" 
                                    onClick={signUp} 
                                    isLoading={isLoading}
                                />
                            </div>

                            <p className="text-center text-slate-500 text-sm">
                                Already have an account?{" "}
                                <Link to="/signin" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
