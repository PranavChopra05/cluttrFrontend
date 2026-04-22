import { useEffect, useState } from "react";
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
  createdAt?: string;
}

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    try {
      const res = await api.get("/api/v1/content");
      setContents(res.data.contents);
    } catch (err) {
      console.error("Error fetching contents:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  return { contents, refresh, isLoading };
}
