const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;

const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;

export function isValidYouTubeUrl(url: string): boolean {
  if (!url?.trim()) return false;
  return YOUTUBE_URL_REGEX.test(url.trim());
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  const match = url.trim().match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function getYouTubeThumbnailUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}
