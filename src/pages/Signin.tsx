import { Button } from "../components/Button"
import { useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";
import { FaBrain, FaUser, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export const Signin = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function signIn(){
        const username = usernameRef.current?.value; 
        const password = passwordRef.current?.value;
        
        if (!username || !password) {
            toast.error("Please enter both username and password");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post("/api/v1/signin", {
                username,
                password
            });
            
            if (response.data.token) {
                login(response.data.token);
                toast.success("Welcome back!");
                navigate("/dashboard");
            } else {
                toast.error(response.data.message || "Invalid credentials");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Sign in failed");
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') signIn();
    };
    
    return (
        <div className='relative flex items-center justify-center min-h-screen w-screen p-4 overflow-hidden'>
            {/* Background effects */}
            <div className="mesh-gradient" />
            <div className="noise-overlay" />

            {/* Floating glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />

            <motion.div 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='relative z-10 w-full max-w-[420px]'
            >
                <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
                    {/* Gradient accent line */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-transparent" />
                    
                    <div className="p-9">
                        {/* Branding */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center mb-9"
                        >
                            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-violet-500/10 border border-cyan-500/10 mb-4 shadow-lg shadow-cyan-500/5">
                                <FaBrain className="text-cyan-400 text-2xl" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight gradient-text">Cluttr</h1>
                            <p className="text-slate-500 mt-1.5 text-sm">Sign in to your second brain</p>
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
                                        placeholder="Enter your username" 
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
                                        placeholder="••••••••" 
                                        className="w-full bg-white/[0.03] border border-slate-700/50 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="pt-1">
                                <Button 
                                    fullWidth 
                                    variant="primary" 
                                    text="Sign In" 
                                    onClick={signIn} 
                                    isLoading={isLoading}
                                />
                            </div>

                            <p className="text-center text-slate-500 text-sm">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
