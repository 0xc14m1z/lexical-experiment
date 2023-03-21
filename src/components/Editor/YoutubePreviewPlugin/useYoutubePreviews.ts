import { useCallback, useRef, useState } from "react";

export interface Preview {
  url: string;
  status: "visible" | "hidden";
  metadata: {
    title: string;
    thumbnailUrl: string;
  };
}

interface YoutubeMetadata {
  author_name: string;
  author_url: string;
  height: number;
  html: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_url: string;
  thumbnail_width: number;
  title: string;
  type: "video";
  version: "1.0";
  width: number;
}

async function fetchMetadata(url: string): Promise<Preview["metadata"]> {
  const response: YoutubeMetadata = await fetch(
    `https://youtube.com/oembed?url=${url}&format=json`
  ).then((response) => response.json());

  return {
    title: response.title,
    thumbnailUrl: response.thumbnail_url,
  };
}

export function useYoutubePreviews(): [
  previews: Preview[],
  add: (url: string) => void,
  remove: (url: string) => void,
  urls: Set<string>
] {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const urls = useRef<Set<string>>(new Set());

  const add = useCallback(
    async (url: string) => {
      if (!urls.current.has(url)) {
        try {
          const metadata = await fetchMetadata(url);
          urls.current.add(url);
          setPreviews((previews) => [
            ...previews,
            { url, metadata, status: "visible" },
          ]);
        } catch (_) {}
      }
    },
    [urls]
  );

  const remove = useCallback((url: string) => {
    setPreviews((previews) =>
      previews.filter((preview) => preview.url !== url)
    );
    urls.current.delete(url);
  }, []);

  return [previews, add, remove, urls.current];
}
