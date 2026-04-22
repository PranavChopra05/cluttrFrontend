import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { Card } from "../components/Card";
import { FaBrain } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Content } from "../hooks/useContent";

export const SharedBrain = () => {
    const { hash } = useParams<{ hash: string }>();
    const [contents, setContents] = useState<Content[]>([]);
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSharedContent = async () => {
            try {
                const res = await api.get(`/api/v1/brain/${hash}`);
                setContents(res.data.content);
                setUsername(res.data.username);
            } catch (err) {
                console.error("Failed to fetch shared brain", err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (hash) {
            fetchSharedContent();
        }
    }, [hash]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="mesh-gradient" />
                <div className="noise-overlay" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/10 flex items-center justify-center animate-pulse">
                            <FaBrain className="text-cyan-400 text-2xl" />
                        </div>
                        <div className="absolute inset-0 w-14 h-14 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-500 animate-[spin-slow_2s_linear_infinite]" />
                    </div>
                    <p className="text-slate-500 text-sm animate-pulse">Loading shared brain...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="mesh-gradient" />
                <div className="noise-overlay" />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-slate-800/40 mb-6">
                        <span className="text-5xl animate-[float_4s_ease-in-out_infinite]">🏜️</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-slate-200">Brain Not Found</h1>
                    <p className="text-slate-500 text-sm mb-6 max-w-sm">This shared brain link might have expired or doesn't exist anymore.</p>
                    <Link 
                        to="/signin" 
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium px-5 py-2.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/5"
                    >
                        Go to Cluttr
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mesh-gradient" />
            <div className="noise-overlay" />

            {/* Responsive navbar */}
            <nav className="relative z-10 border-b border-slate-800/40 glass sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/15 to-violet-500/10 border border-cyan-500/10">
                            <FaBrain className="text-cyan-400 text-base sm:text-lg" />
                        </div>
                        <h1 className="font-bold text-base sm:text-lg tracking-tight gradient-text">Cluttr</h1>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.03] border border-slate-800/50 text-[11px] sm:text-xs text-slate-400">
                        <span className="hidden sm:inline">Viewing</span>
                        <span className="text-cyan-400 font-medium">@{username}</span>
                        <span className="hidden sm:inline">brain</span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <motion.header 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 sm:mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold uppercase flex-shrink-0">
                            {username.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 truncate">
                                {username}'s Collection
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm">Curated links and content shared via Cluttr</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                        <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-slate-800/40">
                            {contents.length} {contents.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {contents.map((content, index) => (
                        <motion.div
                            key={content._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card 
                                contentId={content._id}
                                type={content.type} 
                                title={content.title} 
                                link={content.link}
                            />
                        </motion.div>
                    ))}
                </div>

                {contents.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24"
                    >
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-slate-800/40 mb-6">
                            <span className="text-5xl opacity-40">📭</span>
                        </div>
                        <p className="text-slate-400 text-sm">No public content available in this brain.</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
};
