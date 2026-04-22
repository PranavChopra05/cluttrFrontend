import { useEffect, useState } from "react";
import { 
  FaYoutube, FaTwitter, FaTrash, FaExternalLinkAlt, FaRedditAlien, 
  FaGithub, FaNewspaper, FaFileAlt, FaGlobe, FaInstagram, FaSpotify,
  FaPinterest, FaStackOverflow, FaLinkedin, FaFigma, FaDribbble, FaCode
} from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import api from "../lib/api";
import { toast } from "sonner";
import type { ContentType } from "../hooks/useContent";
import type { IconType } from "react-icons";

interface CardProps {
  contentId: string;
  title: string;
  link: string;
  type: ContentType;
  onDelete?: () => void;
}

interface TypeConfigEntry {
  icon: IconType;
  label: string;
  accentColor: string;
  badgeBg: string;
  glowHover: string;
  gradient: string;
}

export const CONTENT_TYPE_CONFIG: Record<ContentType, TypeConfigEntry> = {
  youtube: {
    icon: FaYoutube,
    label: "YouTube",
    accentColor: "text-red-400",
    badgeBg: "bg-red-500/10 border-red-500/20 text-red-400",
    glowHover: "hover:border-red-500/20 hover:shadow-red-500/5",
    gradient: "bg-gradient-to-r from-red-500 to-orange-400",
  },
  twitter: {
    icon: FaTwitter,
    label: "Twitter",
    accentColor: "text-sky-400",
    badgeBg: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    glowHover: "hover:border-sky-500/20 hover:shadow-sky-500/5",
    gradient: "bg-gradient-to-r from-sky-500 to-blue-400",
  },
  reddit: {
    icon: FaRedditAlien,
    label: "Reddit",
    accentColor: "text-orange-400",
    badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    glowHover: "hover:border-orange-500/20 hover:shadow-orange-500/5",
    gradient: "bg-gradient-to-r from-orange-500 to-red-400",
  },
  github: {
    icon: FaGithub,
    label: "GitHub",
    accentColor: "text-purple-400",
    badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    glowHover: "hover:border-purple-500/20 hover:shadow-purple-500/5",
    gradient: "bg-gradient-to-r from-purple-500 to-violet-400",
  },
  article: {
    icon: FaNewspaper,
    label: "Article",
    accentColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    glowHover: "hover:border-emerald-500/20 hover:shadow-emerald-500/5",
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-400",
  },
  document: {
    icon: FaFileAlt,
    label: "Document",
    accentColor: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    glowHover: "hover:border-amber-500/20 hover:shadow-amber-500/5",
    gradient: "bg-gradient-to-r from-amber-500 to-yellow-400",
  },
  instagram: {
    icon: FaInstagram,
    label: "Instagram",
    accentColor: "text-pink-400",
    badgeBg: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    glowHover: "hover:border-pink-500/20 hover:shadow-pink-500/5",
    gradient: "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400",
  },
  spotify: {
    icon: FaSpotify,
    label: "Spotify",
    accentColor: "text-green-400",
    badgeBg: "bg-green-500/10 border-green-500/20 text-green-400",
    glowHover: "hover:border-green-500/20 hover:shadow-green-500/5",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-400",
  },
  pinterest: {
    icon: FaPinterest,
    label: "Pinterest",
    accentColor: "text-red-400",
    badgeBg: "bg-red-500/10 border-red-500/20 text-red-400",
    glowHover: "hover:border-red-500/20 hover:shadow-red-500/5",
    gradient: "bg-gradient-to-r from-red-600 to-red-400",
  },
  stackoverflow: {
    icon: FaStackOverflow,
    label: "Stack Overflow",
    accentColor: "text-orange-400",
    badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    glowHover: "hover:border-orange-500/20 hover:shadow-orange-500/5",
    gradient: "bg-gradient-to-r from-orange-500 to-amber-400",
  },
  linkedin: {
    icon: FaLinkedin,
    label: "LinkedIn",
    accentColor: "text-blue-400",
    badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    glowHover: "hover:border-blue-500/20 hover:shadow-blue-500/5",
    gradient: "bg-gradient-to-r from-blue-600 to-blue-400",
  },
  notion: {
    icon: SiNotion,
    label: "Notion",
    accentColor: "text-slate-300",
    badgeBg: "bg-slate-500/10 border-slate-500/20 text-slate-300",
    glowHover: "hover:border-slate-500/20 hover:shadow-slate-500/5",
    gradient: "bg-gradient-to-r from-slate-400 to-slate-600",
  },
  figma: {
    icon: FaFigma,
    label: "Figma",
    accentColor: "text-violet-400",
    badgeBg: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    glowHover: "hover:border-violet-500/20 hover:shadow-violet-500/5",
    gradient: "bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400",
  },
  dribbble: {
    icon: FaDribbble,
    label: "Dribbble",
    accentColor: "text-pink-400",
    badgeBg: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    glowHover: "hover:border-pink-500/20 hover:shadow-pink-500/5",
    gradient: "bg-gradient-to-r from-pink-500 to-rose-400",
  },
  codepen: {
    icon: FaCode,
    label: "CodePen",
    accentColor: "text-slate-300",
    badgeBg: "bg-slate-500/10 border-slate-500/20 text-slate-300",
    glowHover: "hover:border-slate-500/20 hover:shadow-slate-500/5",
    gradient: "bg-gradient-to-r from-slate-500 to-slate-400",
  },
  other: {
    icon: FaGlobe,
    label: "Link",
    accentColor: "text-cyan-400",
    badgeBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    glowHover: "hover:border-cyan-500/20 hover:shadow-cyan-500/5",
    gradient: "bg-gradient-to-r from-cyan-500 to-blue-400",
  },
};

/** Get config for any type string, falling back to 'other' */
function getConfig(type: string): TypeConfigEntry {
  return CONTENT_TYPE_CONFIG[type as ContentType] || CONTENT_TYPE_CONFIG.other;
}

export const Card = ({ contentId, title, link, type, onDelete }: CardProps) => {
  const config = getConfig(type);
  const Icon = config.icon;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (type === "twitter") {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [type]);

  function normalizeYouTubeLink(link: string) {
    if (link.includes("watch?v=")) {
      return link.replace("watch?v=", "embed/").split("&")[0];
    }
    if (link.includes("youtu.be/")) {
      const videoId = link.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (link.includes("/shorts/")) {
      const videoId = link.split("/shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return link;
  }

  /** Convert Spotify URL to embed URL */
  function normalizeSpotifyLink(link: string): string | null {
    try {
      const url = new URL(link);
      if (url.hostname.includes("spotify.com")) {
        // e.g. https://open.spotify.com/track/xxx → https://open.spotify.com/embed/track/xxx
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2) {
          return `https://open.spotify.com/embed/${pathParts.join("/")}?theme=0`;
        }
      }
    } catch { /* ignore */ }
    return null;
  }

  /** Convert Pinterest URL to embed URL */
  function normalizePinterestLink(link: string): string | null {
    try {
      const url = new URL(link);
      if (url.hostname.includes("pinterest.com") && url.pathname.includes("/pin/")) {
        const pinId = url.pathname.split("/pin/")[1]?.replace("/", "");
        if (pinId) return `https://assets.pinterest.com/ext/embed.html?id=${pinId}`;
      }
    } catch { /* ignore */ }
    return null;
  }

  /** Convert CodePen URL to embed URL */  
  function normalizeCodePenLink(link: string): string | null {
    try {
      const url = new URL(link);
      if (url.hostname.includes("codepen.io")) {
        // codepen.io/user/pen/id → codepen.io/user/embed/id
        const embedPath = url.pathname.replace("/pen/", "/embed/");
        return `https://codepen.io${embedPath}?default-tab=result&theme-id=dark`;
      }
    } catch { /* ignore */ }
    return null;
  }

  /** Attempt to get a favicon for generic links */
  function getFavicon(link: string): string | null {
    try {
      const url = new URL(link);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
    } catch {
      return null;
    }
  }

  function getDomain(link: string): string {
    try {
      return new URL(link).hostname.replace("www.", "");
    } catch {
      return link;
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete("/api/v1/content", {
        data: { contentId },
      });
      toast.success("Content deleted");
      onDelete?.();
    } catch (err) {
      toast.error("Failed to delete content");
    }
  };

  /** Render rich link preview (for non-embeddable types) */
  const renderLinkPreview = () => {
    const favicon = getFavicon(link);
    const domain = getDomain(link);
    
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block p-4 hover:bg-white/[0.02] transition-colors duration-200 group/link"
      >
        <div className="flex items-start gap-3">
          {favicon && !imgError ? (
            <img 
              src={favicon} 
              alt="" 
              className="w-8 h-8 rounded-lg mt-0.5 flex-shrink-0 bg-slate-800/50 p-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className={`${config.accentColor} text-sm`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 truncate mb-1">{domain}</p>
            <p className="text-sm text-slate-300 font-medium leading-snug line-clamp-2 group-hover/link:text-cyan-300 transition-colors">
              {title}
            </p>
            <p className="text-[10px] text-slate-600 truncate mt-1.5">{link}</p>
          </div>
        </div>
      </a>
    );
  };

  /** Render the embedded content based on type */
  const renderEmbed = () => {
    switch (type) {
      case "youtube":
        return (
          <iframe
            className="w-full aspect-video"
            src={normalizeYouTubeLink(link)}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        );

      case "twitter":
        return (
          <div className="max-h-[280px] overflow-y-auto scrollbar-hide flex justify-center p-2">
            <blockquote className="twitter-tweet" data-theme="dark">
              <a href={link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          </div>
        );

      case "reddit": {
        const redditEmbedUrl = link.includes("reddit.com") 
          ? `https://www.redditmedia.com${new URL(link).pathname}?ref_source=embed&embed=true&theme=dark`
          : link;
        return (
          <iframe
            className="w-full min-h-[320px]"
            src={redditEmbedUrl}
            title={title}
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin allow-popups"
            loading="lazy"
          />
        );
      }

      case "instagram":
        return (
          <iframe
            className="w-full min-h-[450px]"
            src={`${link.replace(/\/$/, "")}/embed`}
            title={title}
            frameBorder="0"
            scrolling="no"
            loading="lazy"
            allowTransparency
          />
        );

      case "spotify": {
        const spotifyEmbed = normalizeSpotifyLink(link);
        if (spotifyEmbed) {
          return (
            <iframe
              className="w-full rounded-xl"
              style={{ minHeight: link.includes("/track/") ? "152px" : "352px" }}
              src={spotifyEmbed}
              title={title}
              frameBorder="0"
              allow="encrypted-media"
              loading="lazy"
            />
          );
        }
        return renderLinkPreview();
      }

      case "pinterest": {
        const pinEmbed = normalizePinterestLink(link);
        if (pinEmbed) {
          return (
            <iframe
              className="w-full min-h-[350px]"
              src={pinEmbed}
              title={title}
              frameBorder="0"
              scrolling="no"
              loading="lazy"
            />
          );
        }
        return renderLinkPreview();
      }

      case "codepen": {
        const codepenEmbed = normalizeCodePenLink(link);
        if (codepenEmbed) {
          return (
            <iframe
              className="w-full aspect-video"
              src={codepenEmbed}
              title={title}
              frameBorder="0"
              loading="lazy"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin"
            />
          );
        }
        return renderLinkPreview();
      }

      case "figma":
        if (link.includes("figma.com")) {
          return (
            <iframe
              className="w-full aspect-video"
              src={`https://www.figma.com/embed?embed_host=cluttr&url=${encodeURIComponent(link)}`}
              title={title}
              frameBorder="0"
              loading="lazy"
              allowFullScreen
            />
          );
        }
        return renderLinkPreview();

      // All other types — rich link preview with favicon
      default:
        return renderLinkPreview();
    }
  };

  return (
    <div className={`w-full group transition-all duration-300 hover:-translate-y-1`}>
      <div className={`relative bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/60 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl ${config.glowHover}`}>
        
        {/* Gradient top accent */}
        <div className={`h-[2px] w-full ${config.gradient}`} />

        {/* Header */}
        <div className="flex justify-between items-center p-4 pb-3">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className={`${config.accentColor} text-lg flex-shrink-0`}>
              <Icon />
            </span>
            <h3 className="text-slate-100 font-medium truncate text-sm leading-tight">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2">
             <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-all duration-200"
              title="Open link"
            >
              <FaExternalLinkAlt size={12} />
            </a>
            {onDelete && (
              <button 
                onClick={handleDelete}
                className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                title="Delete"
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Embed */}
        <div className="mx-4 mb-4 overflow-hidden rounded-xl border border-slate-800/40 bg-black/30">
          {renderEmbed()}
        </div>
        
        {/* Footer badge */}
        <div className="px-4 pb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${config.badgeBg}`}>
                <Icon size={10} />
                {config.label}
            </span>
        </div>
      </div>
    </div>
  );
};
