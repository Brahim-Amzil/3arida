'use client';

import Image from 'next/image';
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  isValidYouTubeUrl,
} from '@/lib/youtube-utils';

interface YouTubeEmbedPreviewProps {
  url: string;
  invalidMessage?: string;
  /** Static thumbnail only (e.g. compact review grids). Default: embedded player */
  thumbnailOnly?: boolean;
  className?: string;
}

export function YouTubeEmbedPreview({
  url,
  invalidMessage,
  thumbnailOnly = false,
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

  const embedUrl = getYouTubeEmbedUrl(trimmed);
  const thumbnailUrl = getYouTubeThumbnailUrl(trimmed);
  if (!embedUrl) return null;

  if (thumbnailOnly && thumbnailUrl) {
    return (
      <div
        className={`relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 ${className}`}
      >
        <Image
          src={thumbnailUrl}
          alt="YouTube video thumbnail"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/25"
          aria-hidden
        >
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full max-w-2xl ${className}`}
      style={{ paddingBottom: '56.25%' }}
    >
      <iframe
        src={embedUrl}
        title="YouTube video player"
        className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
