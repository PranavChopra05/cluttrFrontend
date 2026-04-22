import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CreateContentModal } from '../components/CreateContentModal'
import { Sidebar } from '../components/Sidebar'
import { useContent } from '../hooks/useContent'
import { FaPlus, FaShareAlt, FaBrain, FaBars } from 'react-icons/fa'
import { useEffect, useState, useMemo } from 'react'  
import { useAuth } from '../context/AuthContext'
import { CONTENT_TYPE_CONFIG } from '../components/Card'
import api from '../lib/api'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { contents, refresh, isLoading } = useContent();
  const { user } = useAuth();

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  const filteredContents = contents.filter(content => 
    activeTab === "all" || content.type === activeTab
  );

  // Dynamically compute stats from actual content
  const stats = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    contents.forEach(c => {
      typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
    });
    return typeCounts;
  }, [contents]);

  // Get the top types that actually have content (for the stats bar)
  const statBadges = useMemo(() => {
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4) // Show top 4 types
      .map(([type, count]) => {
        const config = CONTENT_TYPE_CONFIG[type as keyof typeof CONTENT_TYPE_CONFIG] || CONTENT_TYPE_CONFIG.other;
        const Icon = config.icon;
        return { type, count, Icon, config };
      });
  }, [stats]);

  const handleShare = async () => {
    try {
      const res = await api.post("/api/v1/brain/share", { share: true });
      const hash = res.data.hash;
      if (hash) {
        const shareUrl = `${window.location.origin}/share/${hash}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      } else {
        toast.error("Failed to get share link");
      }
    } catch (err) {
      toast.error("Failed to generate share link");
    }
  };

  // Get the right empty state emoji/text based on active tab
  const getEmptyState = () => {
    const config = CONTENT_TYPE_CONFIG[activeTab as keyof typeof CONTENT_TYPE_CONFIG];
    if (activeTab === "all") return { emoji: "📭", label: "content" };
    if (config) return { emoji: "🔗", label: config.label.toLowerCase() + " links" };
    return { emoji: "📭", label: "content" };
  };

  return (
    <div className='flex min-h-screen'>
      {/* Background */}
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      
      {/* Main — ml-72 on desktop, full width on mobile */}
      <main className='relative z-10 flex-1 lg:ml-72 p-4 sm:p-6 lg:p-8'>
        {/* Top gradient strip */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-cyan-500/[0.03] to-transparent pointer-events-none" />

        <header className="relative mb-8 lg:mb-10">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between mb-5 lg:mb-0">
            {/* Hamburger — mobile only */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-all"
            >
              <FaBars size={18} />
            </button>

            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/10 border border-cyan-500/10">
                <FaBrain className="text-cyan-400 text-base" />
              </div>
              <span className="font-bold text-slate-100 text-lg tracking-tight">Cluttr</span>
            </div>

            {/* Mobile action buttons */}
            <div className="flex gap-2 lg:hidden">
              <button 
                onClick={handleShare}
                className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
              >
                <FaShareAlt size={16} />
              </button>
              <button 
                onClick={() => setModalOpen(true)}
                className="p-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 rounded-xl shadow-lg shadow-cyan-500/25"
              >
                <FaPlus size={16} />
              </button>
            </div>
          </div>

          {/* Desktop header layout */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-1.5"
              >
                Welcome back, <span className="gradient-text">{user?.username}</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-slate-500 text-sm"
              >
                Manage your second brain and digital clutter.
              </motion.p>

              {/* Dynamic stats badges */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2 mt-4 lg:mt-5"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-slate-800/50 text-xs">
                  <FaBrain className="text-cyan-400 text-[10px]" />
                  <span className="text-slate-400">{contents.length} total</span>
                </div>
                {statBadges.map(({ type, count, Icon, config }) => (
                  <div key={type} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-slate-800/50 text-xs">
                    <Icon className={`${config.accentColor} text-[10px]`} />
                    <span className="text-slate-400">{count} {config.label.toLowerCase()}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Desktop action buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="hidden lg:flex gap-3"
            >
              <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)}/>
              <Button 
                  variant='secondary' 
                  text='Share Brain' 
                  startIcon={<FaShareAlt/>} 
                  onClick={handleShare}
              />
              <Button 
                  variant='primary' 
                  text='Add Content' 
                  startIcon={<FaPlus/>} 
                  onClick={() => setModalOpen(true)}
              />
            </motion.div>

            {/* Mobile modal (rendered separately so it's not inside hidden div) */}
            <div className="lg:hidden">
              <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)}/>
            </div>
          </div>
        </header>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[55vh] gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/10 flex items-center justify-center animate-pulse">
                        <FaBrain className="text-cyan-400 text-xl" />
                    </div>
                    <div className="absolute inset-0 w-12 h-12 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-500 animate-[spin-slow_2s_linear_infinite]" />
                </div>
                <p className="text-slate-500 text-sm animate-pulse">Loading your brain...</p>
            </div>
        ) : (
            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredContents.map((content, index) => (
                        <motion.div
                            key={content._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, delay: index * 0.03 }}
                        >
                            <Card 
                                contentId={content._id}
                                type={content.type} 
                                title={content.title} 
                                link={content.link}
                                onDelete={refresh}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        )}

        {!isLoading && filteredContents.length === 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-[50vh] text-slate-500"
            >
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-slate-800/40 mb-6">
                    <div className="text-5xl opacity-40 animate-[float_4s_ease-in-out_infinite]">
                        {getEmptyState().emoji}
                    </div>
                </div>
                <p className="text-base font-medium text-slate-400 mb-1">
                    No {getEmptyState().label} yet
                </p>
                <p className="text-sm text-slate-600 mb-5">Start curating your second brain</p>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-cyan-500/5"
                >
                    <FaPlus size={10} />
                    Add your first one
                </button>
            </motion.div>
        )}
      </main>
    </div>
  )
}

export default Dashboard;
