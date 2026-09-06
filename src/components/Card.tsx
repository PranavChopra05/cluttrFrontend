import { useEffect, useState, useRef } from "react";
import { LuExternalLink, LuTrash2, LuPencil, LuStar } from "react-icons/lu";
import type { Content } from "../hooks/useContent";
import { useTheme } from "../context/ThemeContext";
import { getConfig } from "../lib/contentTypes";

interface CardProps {
  content: Content;
  view?: "grid" | "list";
  onDelete?: (content: Content) => void;
  onEdit?: (content: Content) => void;
  onToggleFavorite?: (content: Content) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

// ─── URL → embed helpers ───
function normalizeYouTube(link: string) {
  if (link.includes("watch?v=")) return link.replace("watch?v=", "embed/").split("&")[0];
  if (link.includes("youtu.be/")) return `https://www.youtube.com/embed/${link.split("youtu.be/")[1].split("?")[0]}`;
  if (link.includes("/shorts/")) return `https://www.youtube.com/embed/${link.split("/shorts/")[1].split("?")[0]}`;
  return link;
}
function normalizeSpotify(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.hostname.includes("spotify.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `https://open.spotify.com/embed/${parts.join("/")}`;
    }
  } catch { /* ignore */ }
  return null;
}
function normalizePinterest(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.hostname.includes("pinterest.com") && url.pathname.includes("/pin/")) {
      const pinId = url.pathname.split("/pin/")[1]?.replace("/", "");
      if (pinId) return `https://assets.pinterest.com/ext/embed.html?id=${pinId}`;
    }
  } catch { /* ignore */ }
  return null;
}
function normalizeCodePen(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.hostname.includes("codepen.io")) {
      return `https://codepen.io${url.pathname.replace("/pen/", "/embed/")}?default-tab=result&theme-id=dark`;
    }
  } catch { /* ignore */ }
  return null;
}
function getFavicon(link: string): string | null {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(link).hostname}&sz=64`; }
  catch { return null; }
}
function getDomain(link: string): string {
  try { return new URL(link).hostname.replace("www.", ""); }
  catch { return link; }
}

export const Card = ({
  content, view = "grid", onDelete, onEdit, onToggleFavorite,
  selectable, selected, onToggleSelect,
}: CardProps) => {
  const { _id: contentId, title, link, type, tags = [], favorite } = content;
  const config = getConfig(type);
  const Icon = config.icon;
  const [imgError, setImgError] = useState(false);
  const { resolved } = useTheme();
  const tweetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type !== "twitter") return;
    const SCRIPT_ID = "twitter-widgets-js";
    const render = () => {
      const twttr = (window as unknown as {
        twttr?: { widgets?: { load: (el?: HTMLElement) => void } };
      }).twttr;
      if (twttr?.widgets && tweetRef.current) twttr.widgets.load(tweetRef.current);
    };
    // Load the shared script once; otherwise just (re)scan this card.
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = render;
      document.body.appendChild(script);
    } else {
      render();
    }
  }, [type, link, resolved]);

  const renderLinkPreview = () => {
    const favicon = getFavicon(link);
    const domain = getDomain(link);
    return (
      <a href={link} target="_blank" rel="noopener noreferrer"
         className="group/link block p-4 transition-colors hover:bg-surface-2">
        <div className="flex items-start gap-3">
          {favicon && !imgError ? (
            <img src={favicon} alt="" loading="lazy"
                 className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-lg bg-surface-2 p-1"
                 onError={() => setImgError(true)} />
          ) : (
            <div className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-surface-2">
              <Icon className={`${config.accentColor} text-sm`} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="mb-1 truncate text-xs text-subtle">{domain}</p>
            <p className="line-clamp-2 text-sm font-medium leading-snug text-fg transition-colors group-hover/link:text-accent">
              {title}
            </p>
            <p className="mt-1.5 truncate text-[10px] text-subtle">{link}</p>
          </div>
        </div>
      </a>
    );
  };

  const renderEmbed = () => {
    switch (type) {
      case "youtube":
        return <iframe className="aspect-video w-full" src={normalizeYouTube(link)} title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />;
      case "twitter":
        return (
          <div ref={tweetRef} className="scrollbar-hide flex max-h-[280px] justify-center overflow-y-auto p-2">
            <blockquote className="twitter-tweet" data-theme={resolved === "dark" ? "dark" : "light"}>
              <a href={link.replace("x.com", "twitter.com")}> </a>
            </blockquote>
          </div>
        );
      case "reddit": {
        const url = link.includes("reddit.com")
          ? `https://www.redditmedia.com${new URL(link).pathname}?ref_source=embed&embed=true&theme=dark`
          : link;
        return <iframe className="min-h-[320px] w-full" src={url} title={title}
          sandbox="allow-scripts allow-same-origin allow-popups" loading="lazy" />;
      }
      case "instagram":
        return <iframe className="min-h-[450px] w-full" src={`${link.replace(/\/$/, "")}/embed`} title={title}
          scrolling="no" loading="lazy" />;
      case "spotify": {
        const embed = normalizeSpotify(link);
        return embed ? <iframe className="w-full rounded-xl" style={{ minHeight: link.includes("/track/") ? 152 : 352 }}
          src={embed} title={title} allow="encrypted-media" loading="lazy" /> : renderLinkPreview();
      }
      case "pinterest": {
        const embed = normalizePinterest(link);
        return embed ? <iframe className="min-h-[350px] w-full" src={embed} title={title} scrolling="no" loading="lazy" /> : renderLinkPreview();
      }
      case "codepen": {
        const embed = normalizeCodePen(link);
        return embed ? <iframe className="aspect-video w-full" src={embed} title={title} loading="lazy" allowFullScreen
          sandbox="allow-scripts allow-same-origin" /> : renderLinkPreview();
      }
      case "figma":
        return link.includes("figma.com")
          ? <iframe className="aspect-video w-full" src={`https://www.figma.com/embed?embed_host=cluttr&url=${encodeURIComponent(link)}`} title={title} loading="lazy" allowFullScreen />
          : renderLinkPreview();
      default:
        return renderLinkPreview();
    }
  };

  // ─── Shared action buttons ───
  const Actions = (
    <div className="flex items-center gap-0.5">
      {onToggleFavorite && (
        <button onClick={() => onToggleFavorite(content)} title={favorite ? "Unfavorite" : "Favorite"}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className={`rounded-lg p-2 transition-colors hover:bg-surface-2 ${favorite ? "text-amber-400" : "text-subtle hover:text-amber-400"}`}>
          <LuStar className={favorite ? "fill-current" : ""} size={14} />
        </button>
      )}
      <a href={link} target="_blank" rel="noopener noreferrer" title="Open link" aria-label="Open link in new tab"
         className="rounded-lg p-2 text-subtle transition-colors hover:bg-surface-2 hover:text-accent">
        <LuExternalLink size={14} />
      </a>
      {onEdit && (
        <button onClick={() => onEdit(content)} title="Edit" aria-label="Edit content"
          className="rounded-lg p-2 text-subtle transition-colors hover:bg-surface-2 hover:text-fg">
          <LuPencil size={14} />
        </button>
      )}
      {onDelete && (
        <button onClick={() => onDelete(content)} title="Delete" aria-label="Delete content"
          className="rounded-lg p-2 text-subtle transition-colors hover:bg-danger/10 hover:text-danger">
          <LuTrash2 size={14} />
        </button>
      )}
    </div>
  );

  const TagRow = tags.length > 0 && (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 4).map((t) => (
        <span key={t} className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted">#{t}</span>
      ))}
      {tags.length > 4 && <span className="text-[10px] text-subtle">+{tags.length - 4}</span>}
    </div>
  );

  // ─── List view ───
  if (view === "list") {
    return (
      <div className={`group flex items-center gap-3 rounded-xl border bg-surface px-3 py-2.5 transition-all hover:border-border-strong ${selected ? "border-accent ring-1 ring-accent" : "border-border"}`}>
        {selectable && (
          <input type="checkbox" checked={!!selected} onChange={() => onToggleSelect?.(contentId)}
            aria-label={`Select ${title}`} className="h-4 w-4 flex-shrink-0 accent-[var(--accent)]" />
        )}
        <div className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-surface-2 ${config.accentColor}`}>
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg">{title}</p>
          <p className="truncate text-xs text-subtle">{getDomain(link)}</p>
        </div>
        {TagRow}
        <span className={`hidden flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline ${config.badgeBg}`}>{config.label}</span>
        <div className="flex-shrink-0 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 group-focus-within:opacity-100">{Actions}</div>
      </div>
    );
  }

  // ─── Grid view ───
  return (
    <div className={`group card-hover relative overflow-hidden rounded-2xl border bg-surface ${selected ? "border-accent ring-1 ring-accent" : "border-border"}`}>
      {selectable && (
        <input type="checkbox" checked={!!selected} onChange={() => onToggleSelect?.(contentId)}
          aria-label={`Select ${title}`}
          className="absolute left-3 top-3 z-10 h-4 w-4 accent-[var(--accent)]" />
      )}

      <div className="flex items-center justify-between gap-2 p-4 pb-3">
        <div className={`flex min-w-0 flex-1 items-center gap-2.5 ${selectable ? "pl-6" : ""}`}>
          <span className={`flex-shrink-0 ${config.accentColor}`}><Icon size={17} /></span>
          <h3 className="truncate text-sm font-medium leading-tight text-fg">{title}</h3>
        </div>
        <div className="flex-shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">{Actions}</div>
      </div>

      <div className="mx-4 mb-3 overflow-hidden rounded-xl border border-border bg-canvas-subtle">
        {renderEmbed()}
      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${config.badgeBg}`}>
          <Icon size={9} /> {config.label}
        </span>
        {TagRow}
      </div>
    </div>
  );
};
