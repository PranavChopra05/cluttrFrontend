import type { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  active?: boolean;
  onClick: () => void;
}

export const SidebarItem = ({ text, icon, active, onClick }: SidebarItemProps) => {
  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center gap-4 px-6 py-3 mx-3 my-0.5 rounded-xl cursor-pointer transition-all duration-200 group
        ${active 
          ? 'bg-cyan-500/10 text-cyan-300' 
          : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
        }
      `}
    >
      {/* Active indicator bar */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-cyan-400 to-violet-400 rounded-full" />
      )}

      <div className={`text-lg transition-all duration-200 group-hover:scale-110 
        ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
        {icon}
      </div>
      <div className={`font-medium text-sm ${active ? 'text-cyan-300' : ''}`}>
        {text}
      </div>  
    </div>
  )
}