import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";

export type ContentType =
  | "youtube" | "twitter" | "reddit" | "github"
  | "article" | "document" | "instagram" | "spotify"
  | "pinterest" | "stackoverflow" | "linkedin" | "notion"
  | "figma" | "dribbble" | "codepen" | "other";

export interface Content {
  _id: string;
  type: ContentType;
  link: string;
  title: string;
  notes?: string;
  tags?: string[];
  collectionName?: string;
  favorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/content");
      setContents(res.data.contents ?? []);
      setError(null);
    } catch (err) {
      console.error("Error fetching contents:", err);
      setError("Couldn't load your content");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Refresh when the tab regains focus instead of polling on a timer —
    // keeps data fresh without hammering the API every 30s.
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  return { contents, setContents, refresh, isLoading, error };
}
