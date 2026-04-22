import { useRef, useState, useEffect } from "react"
import { FaTimes, FaTag, FaLink, FaChevronDown } from "react-icons/fa"
import { Button } from "./Button"
import api from "../lib/api"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import type { ContentType } from "../hooks/useContent"
import { CONTENT_TYPE_CONFIG } from "./Card"

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
}

const contentTypes: { value: ContentType; label: string; group: string }[] = [
    // Media
    { value: "youtube", label: "YouTube", group: "Media" },
    { value: "spotify", label: "Spotify", group: "Media" },
    { value: "instagram", label: "Instagram", group: "Media" },
    { value: "pinterest", label: "Pinterest", group: "Media" },
    // Social
    { value: "twitter", label: "Twitter / X", group: "Social" },
    { value: "reddit", label: "Reddit", group: "Social" },
    { value: "linkedin", label: "LinkedIn", group: "Social" },
    // Dev
    { value: "github", label: "GitHub", group: "Dev" },
    { value: "stackoverflow", label: "Stack Overflow", group: "Dev" },
    { value: "codepen", label: "CodePen", group: "Dev" },
    // Design
    { value: "figma", label: "Figma", group: "Design" },
    { value: "dribbble", label: "Dribbble", group: "Design" },
    // Knowledge
    { value: "article", label: "Article / Blog", group: "Knowledge" },
    { value: "document", label: "Document", group: "Knowledge" },
    { value: "notion", label: "Notion", group: "Knowledge" },
    // General
    { value: "other", label: "Other Link", group: "General" },
];

/** Auto-detect content type from URL */
function detectType(url: string): ContentType {
    try {
        const hostname = new URL(url).hostname.toLowerCase();
        const path = new URL(url).pathname.toLowerCase();
        
        // Video / Media
        if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "youtube";
        if (hostname.includes("open.spotify.com") || hostname.includes("spotify.com")) return "spotify";
        if (hostname.includes("instagram.com")) return "instagram";
        if (hostname.includes("pinterest.com") || hostname.includes("pin.it")) return "pinterest";
        
        // Social
        if (hostname.includes("twitter.com") || hostname.includes("x.com")) return "twitter";
        if (hostname.includes("reddit.com")) return "reddit";
        if (hostname.includes("linkedin.com")) return "linkedin";
        
        // Dev
        if (hostname.includes("github.com") || hostname.includes("gist.github.com")) return "github";
        if (hostname.includes("stackoverflow.com") || hostname.includes("stackexchange.com")) return "stackoverflow";
        if (hostname.includes("codepen.io")) return "codepen";
        
        // Design
        if (hostname.includes("figma.com")) return "figma";
        if (hostname.includes("dribbble.com")) return "dribbble";
        
        // Knowledge / Docs
        if (hostname.includes("notion.so") || hostname.includes("notion.site")) return "notion";
        if (hostname.includes("docs.google.com") || hostname.includes("drive.google.com")) return "document";
        if (hostname.includes("medium.com") || hostname.includes("dev.to") || hostname.includes("hashnode.dev") || hostname.includes("substack.com")) return "article";
        
        // Heuristic: if path has /blog, /article, /post
        if (path.includes("/blog") || path.includes("/article") || path.includes("/post")) return "article";
    } catch {
        // invalid URL, ignore
    }
    return "other";
}

export const CreateContentModal = ({ open, onClose }: CreateContentModalProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentType>("other");
    const [isLoading, setIsLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                if (dropdownOpen) {
                    setDropdownOpen(false);
                } else {
                    onClose();
                }
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onClose, dropdownOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClick = () => setDropdownOpen(false);
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [dropdownOpen]);

    // Auto-detect type when link changes
    const handleLinkChange = () => {
        const link = linkRef.current?.value || "";
        if (link.length > 8) {
            const detected = detectType(link);
            setType(detected);
        }
    };

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        if (!title || !link) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/api/v1/content", {
                link,
                type,
                title
            });
            toast.success("Content added successfully!");
            onClose();
            // Clear inputs
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            setType("other");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add content");
        } finally {
            setIsLoading(false);
        }
    }

    const selectedConfig = CONTENT_TYPE_CONFIG[type];
    const SelectedIcon = selectedConfig.icon;

    // Group content types for the dropdown
    const groups = contentTypes.reduce((acc, ct) => {
        if (!acc[ct.group]) acc[ct.group] = [];
        acc[ct.group].push(ct);
        return acc;
    }, {} as Record<string, typeof contentTypes>);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-md glass-strong rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Gradient top accent */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500" />

                        <div className="p-7">
                            <div className="flex justify-between items-center mb-7">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">Add Content</h2>
                                    <p className="text-xs text-slate-500 mt-1">Save any link to your second brain</p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all duration-200"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Link input — first so auto-detect works */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Link</label>
                                    <div className="relative">
                                        <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                                        <input 
                                            ref={linkRef} 
                                            placeholder="Paste any URL here..." 
                                            onChange={handleLinkChange}
                                            className="w-full bg-white/[0.03] border border-slate-700/50 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all duration-200"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-600 mt-1.5 ml-1">Type is auto-detected from the URL</p>
                                </div>

                                {/* Title input */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Title</label>
                                    <div className="relative">
                                        <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                                        <input 
                                            ref={titleRef} 
                                            placeholder="Give it a name..." 
                                            className="w-full bg-white/[0.03] border border-slate-700/50 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Type dropdown */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Content Type</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer text-sm
                                                ${dropdownOpen 
                                                    ? 'border-cyan-500/40 bg-cyan-500/5 ring-2 ring-cyan-500/20' 
                                                    : 'border-slate-700/50 bg-white/[0.03] hover:border-slate-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <SelectedIcon className={`${selectedConfig.accentColor} text-base`} />
                                                <span className="text-slate-200 font-medium">{contentTypes.find(t => t.value === type)?.label}</span>
                                            </div>
                                            <FaChevronDown className={`text-slate-500 text-[10px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Centered overlay dropdown */}
                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute inset-0 z-50 flex items-center justify-center p-5"
                                                    style={{ top: '-5.5rem', bottom: '0.5rem', left: '-1rem', right: '-1rem' }}
                                                    onClick={(e) => { e.stopPropagation(); setDropdownOpen(false); }}
                                                >
                                                    {/* Backdrop */}
                                                    <div className="absolute inset-0 bg-black/40 rounded-2xl" />
                                                    
                                                    {/* Menu panel */}
                                                    <motion.div
                                                        initial={{ scale: 0.95, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.95, opacity: 0 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="relative w-full max-w-[320px] glass-strong rounded-xl border border-slate-700/50 shadow-2xl max-h-[300px] overflow-y-auto scrollbar-hide"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {/* Header */}
                                                        <div className="sticky top-0 z-10 px-4 py-3 border-b border-slate-800/40 bg-slate-900/90 backdrop-blur-md rounded-t-xl">
                                                            <p className="text-xs font-semibold text-slate-300 tracking-wide">Select Content Type</p>
                                                        </div>

                                                        {Object.entries(groups).map(([groupName, items], groupIdx) => (
                                                            <div key={groupName}>
                                                                {groupIdx > 0 && <div className="h-px bg-slate-800/40 mx-3" />}
                                                                <div className="px-4 pt-2.5 pb-1">
                                                                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">{groupName}</span>
                                                                </div>
                                                                {items.map((ct) => {
                                                                    const ctConfig = CONTENT_TYPE_CONFIG[ct.value];
                                                                    const CtIcon = ctConfig.icon;
                                                                    const isActive = type === ct.value;
                                                                    return (
                                                                        <button
                                                                            key={ct.value}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setType(ct.value);
                                                                                setDropdownOpen(false);
                                                                            }}
                                                                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-150 cursor-pointer
                                                                                ${isActive 
                                                                                    ? 'bg-cyan-500/10 text-cyan-300' 
                                                                                    : 'text-slate-300 hover:bg-white/[0.04] hover:text-slate-100'
                                                                                }`}
                                                                        >
                                                                            <CtIcon className={`${isActive ? ctConfig.accentColor : 'text-slate-500'} text-sm`} />
                                                                            <span className="text-[13px]">{ct.label}</span>
                                                                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button 
                                        variant="primary" 
                                        text="Save Content" 
                                        fullWidth 
                                        onClick={addContent} 
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}