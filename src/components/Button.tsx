import type { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary" | "danger";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    isLoading?: boolean;
    type?: "button" | "submit";
}

const variantStyles = {
    "primary": "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:from-cyan-400 hover:to-cyan-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30 active:scale-[0.97]",
    "secondary": "bg-slate-800/60 text-slate-200 hover:bg-slate-700/70 border border-slate-700/60 hover:border-slate-600 active:scale-[0.97] backdrop-blur-sm",
    "danger": "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 active:scale-[0.97]"
}

const defaultStyles = "px-5 py-2.5 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 group text-sm tracking-wide"

export const Button = ({ variant, text, startIcon, onClick, fullWidth, isLoading, type = "button" }: ButtonProps) => {
  return (
    <button 
        type={type}
        disabled={isLoading}
        className={`${variantStyles[variant]} ${defaultStyles} ${fullWidth ? "w-full" : ""}`} 
        onClick={onClick}
    >    
        {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
            startIcon && <span className="mr-2 group-hover:scale-110 transition-transform duration-200">{startIcon}</span>
        )}
        <span> 
            {isLoading ? "Loading..." : text}
        </span>
    </button>
  )
}
