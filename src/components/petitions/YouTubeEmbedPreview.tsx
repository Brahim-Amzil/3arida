'use client';

import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  getYouTubeWatchUrl,
  isValidYouTubeUrl,
} from '@/lib/youtube-utils';

interface YouTubeEmbedPreviewProps {
  url: string;
  invalidMessage?: string;
  /** When true, render an embed player below the thumbnail (needs CSP frame-src for YouTube) */
  showPlayer?: boolean;
  className?: string;
}

export function YouTubeEmbedPreview({
  url,
  invalidMessage,
  showPlayer = true,
  className = '',
}: YouTubeEmbedPreviewProps) {
  const trimmed = url?.trim() ?? '';
  if (!trimmed) return null;

  if (!isValidYouTubeUrl(trimmed)) {
    if (!invalidMessage) return null;
    return (
      <div className={`p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 text-sm">{invalidMessage}</p>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(trimmed);
  const thumbnailUrl = getYouTubeThumbnailUrl(trimmed);
  const embedUrl = getYouTubeEmbedUrl(trimmed);
  const watchUrl = getYouTubeWatchUrl(trimmed);

  if (!videoId || !thumbnailUrl) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt="YouTube video preview"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          aria-hidden
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg">
            <svg
              className="ml-1 h-6 w-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {showPlayer && embedUrl && (
        <div
          className="relative w-full max-w-2xl"
          style={{ paddingBottom: '56.25%' }}
        >
          <iframe
            src={embedUrl}
            title="YouTube video player"
            className="absolute left-0 top-0 h-full w-full rounded-lg border border-gray-200"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      {watchUrl && (
        <p className="text-sm text-gray-600">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 underline hover:text-purple-900"
          >
            فتح الفيديو على يوتيوب
          </a>
        </p>
      )}
    </div>
  );
}
