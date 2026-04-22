import { SidebarItem } from "./SidebarItem"
import { 
  FaTwitter, FaYoutube, FaSignOutAlt, FaBrain, FaRedditAlien, FaGithub, 
  FaNewspaper, FaGlobe, FaInstagram, FaSpotify, FaPinterest, FaStackOverflow,
  FaLinkedin, FaFigma, FaDribbble, FaCode, FaTimes 
} from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { text: "All Content", icon: FaBrain, tab: "all" },
  // Media
  { text: "YouTube", icon: FaYoutube, tab: "youtube" },
  { text: "Spotify", icon: FaSpotify, tab: "spotify" },
  { text: "Instagram", icon: FaInstagram, tab: "instagram" },
  // Social
  { text: "Twitter / X", icon: FaTwitter, tab: "twitter" },
  { text: "Reddit", icon: FaRedditAlien, tab: "reddit" },
  { text: "LinkedIn", icon: FaLinkedin, tab: "linkedin" },
  // Dev
  { text: "GitHub", icon: FaGithub, tab: "github" },
  { text: "Stack Overflow", icon: FaStackOverflow, tab: "stackoverflow" },
  { text: "CodePen", icon: FaCode, tab: "codepen" },
  // Design
  { text: "Figma", icon: FaFigma, tab: "figma" },
  { text: "Dribbble", icon: FaDribbble, tab: "dribbble" },
  { text: "Pinterest", icon: FaPinterest, tab: "pinterest" },
  // Knowledge
  { text: "Articles", icon: FaNewspaper, tab: "article" },
  { text: "Notion", icon: SiNotion, tab: "notion" },
  // Other
  { text: "Other Links", icon: FaGlobe, tab: "other" },
];

export const Sidebar = ({ activeTab, onTabChange, mobileOpen, onMobileClose }: SidebarProps) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    // Close sidebar on mobile after selecting
    onMobileClose?.();
  };

  const sidebarContent = (
    <>
      {/* Gradient accent line at top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-transparent" />
      
      {/* Logo + close button on mobile */}
      <div className="flex px-7 pt-7 pb-6 items-center gap-3 flex-shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/10 border border-cyan-500/10">
            <FaBrain className="text-cyan-400 text-xl" />
          </div>
          <div className="font-bold text-slate-100 text-xl tracking-tight flex-1">Cluttr</div>
          {/* Mobile close */}
          {onMobileClose && (
            <button 
              onClick={onMobileClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all"
            >
              <FaTimes size={16} />
            </button>
          )}
      </div>
      
      {/* Nav label */}
      <div className="px-7 mb-2 flex-shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Filter by type</span>
      </div>

      {/* Nav items — scrollable */}
      <div className="flex-1 space-y-0.5 overflow-y-auto scrollbar-hide pb-2">
          {navItems.map(item => (
            <SidebarItem 
              key={item.tab}
              text={item.text} 
              icon={<item.icon />} 
              active={activeTab === item.tab} 
              onClick={() => handleTabChange(item.tab)} 
            />
          ))}
      </div>

      {/* Bottom section */}
      <div className="flex-shrink-0">
        <div className="border-t border-slate-800/40 mx-4" />
        
        {/* User info */}
        {user && (
          <div className="px-6 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase">
              {user.username.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user.username}</p>
              <p className="text-[11px] text-slate-500">Second brain</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="pb-3">
            <SidebarItem 
              text="Logout" 
              icon={<FaSignOutAlt />} 
              onClick={handleLogout} 
            />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:flex h-screen w-72 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/50 fixed left-0 top-0 flex-col z-20">
        {sidebarContent}
      </div>

      {/* Mobile sidebar — slide-in drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
