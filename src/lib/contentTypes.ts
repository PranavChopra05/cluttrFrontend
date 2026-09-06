import {
  FaYoutube, FaTwitter, FaRedditAlien, FaGithub, FaNewspaper, FaFileAlt,
  FaGlobe, FaInstagram, FaSpotify, FaPinterest, FaStackOverflow, FaLinkedin,
  FaFigma, FaDribbble, FaCode,
} from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import type { IconType } from "react-icons";
import type { ContentType } from "../hooks/useContent";

export interface TypeConfigEntry {
  icon: IconType;
  label: string;
  accentColor: string;
  badgeBg: string;
  dot: string;
}

/** Per-content-type visual config. The fixed palette colors here are the
 *  one sanctioned exception to the semantic-token rule: they're small accents
 *  (icon/badge/dot) chosen to read acceptably in both light and dark. */
export const CONTENT_TYPE_CONFIG: Record<ContentType, TypeConfigEntry> = {
  youtube:       { icon: FaYoutube,      label: "YouTube",        accentColor: "text-red-500",    badgeBg: "bg-red-500/10 border-red-500/20 text-red-500",       dot: "bg-red-500" },
  twitter:       { icon: FaTwitter,      label: "Twitter / X",    accentColor: "text-sky-500",    badgeBg: "bg-sky-500/10 border-sky-500/20 text-sky-500",       dot: "bg-sky-500" },
  reddit:        { icon: FaRedditAlien,  label: "Reddit",         accentColor: "text-orange-500", badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-500", dot: "bg-orange-500" },
  github:        { icon: FaGithub,       label: "GitHub",         accentColor: "text-purple-500", badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-500", dot: "bg-purple-500" },
  article:       { icon: FaNewspaper,    label: "Article",        accentColor: "text-emerald-500",badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500", dot: "bg-emerald-500" },
  document:      { icon: FaFileAlt,      label: "Document",       accentColor: "text-amber-500",  badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-500",   dot: "bg-amber-500" },
  instagram:     { icon: FaInstagram,    label: "Instagram",      accentColor: "text-pink-500",   badgeBg: "bg-pink-500/10 border-pink-500/20 text-pink-500",     dot: "bg-pink-500" },
  spotify:       { icon: FaSpotify,      label: "Spotify",        accentColor: "text-green-500",  badgeBg: "bg-green-500/10 border-green-500/20 text-green-500",   dot: "bg-green-500" },
  pinterest:     { icon: FaPinterest,    label: "Pinterest",      accentColor: "text-rose-500",   badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-500",     dot: "bg-rose-500" },
  stackoverflow: { icon: FaStackOverflow,label: "Stack Overflow", accentColor: "text-orange-500", badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-500", dot: "bg-orange-500" },
  linkedin:      { icon: FaLinkedin,     label: "LinkedIn",       accentColor: "text-blue-500",   badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-500",     dot: "bg-blue-500" },
  notion:        { icon: SiNotion,       label: "Notion",         accentColor: "text-fg",         badgeBg: "bg-surface-2 border-border text-muted",              dot: "bg-subtle" },
  figma:         { icon: FaFigma,        label: "Figma",          accentColor: "text-violet-500", badgeBg: "bg-violet-500/10 border-violet-500/20 text-violet-500", dot: "bg-violet-500" },
  dribbble:      { icon: FaDribbble,     label: "Dribbble",       accentColor: "text-pink-500",   badgeBg: "bg-pink-500/10 border-pink-500/20 text-pink-500",     dot: "bg-pink-500" },
  codepen:       { icon: FaCode,         label: "CodePen",        accentColor: "text-fg",         badgeBg: "bg-surface-2 border-border text-muted",              dot: "bg-subtle" },
  other:         { icon: FaGlobe,        label: "Link",           accentColor: "text-accent",     badgeBg: "bg-accent-soft border-border text-accent",           dot: "bg-accent" },
};

export function getConfig(type: string): TypeConfigEntry {
  return CONTENT_TYPE_CONFIG[type as ContentType] || CONTENT_TYPE_CONFIG.other;
}
