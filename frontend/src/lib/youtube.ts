/**
 * YouTube URL parsing and thumbnail utilities
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://youtu.be/{id}
 * - https://youtube.com/watch?v={id}
 * - https://www.youtube.com/watch?v={id}
 *
 * @param url - YouTube URL
 * @returns Video ID or null if URL is invalid
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // youtu.be/{id}
    if (urlObj.hostname === "youtu.be") {
      const id = urlObj.pathname.slice(1);
      return id || null;
    }

    // youtube.com or www.youtube.com with ?v={id}
    if (
      urlObj.hostname === "youtube.com" ||
      urlObj.hostname === "www.youtube.com"
    ) {
      const id = urlObj.searchParams.get("v");
      return id || null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Generate YouTube thumbnail URL for a video ID
 * Uses the highest quality default thumbnail (maxresdefault)
 *
 * @param videoId - YouTube video ID
 * @returns Thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
