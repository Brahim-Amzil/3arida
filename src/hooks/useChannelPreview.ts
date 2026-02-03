import { useState } from 'react';

export interface ChannelPreview {
  name: string;
  image: string | null;
  description: string | null;
  platform: string;
  url: string;
}

export function useChannelPreview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = async (url: string): Promise<ChannelPreview | null> => {
    if (!url || !url.trim()) {
      setError('URL is required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 [Client] Fetching channel preview for:', url);

      const response = await fetch('/api/channel-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ [Client] API error:', data);
        throw new Error(data.error || 'Failed to fetch channel preview');
      }

      console.log('✅ [Client] Channel preview fetched:', {
        name: data.name,
        hasImage: !!data.image,
        imageUrl: data.image,
        platform: data.platform,
      });

      return data;
    } catch (err: any) {
      console.error('❌ [Client] Error fetching channel preview:', err);
      setError(err.message || 'Failed to fetch channel preview');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    fetchPreview,
    loading,
    error,
    clearError,
  };
}

// Helper function to get platform display name
export function getPlatformDisplayName(platform: string): string {
  switch (platform) {
    case 'youtube':
      return 'YouTube';
    case 'instagram':
      return 'Instagram';
    case 'tiktok':
      return 'TikTok';
    case 'x':
      return 'X (Twitter)';
    case 'facebook':
      return 'Facebook';
    case 'linkedin':
      return 'LinkedIn';
    case 'snapchat':
      return 'Snapchat';
    default:
      return 'Social Media';
  }
}

// Helper function to get platform icon
export function getPlatformIcon(platform: string): string {
  switch (platform) {
    case 'youtube':
      return '📺';
    case 'instagram':
      return '📷';
    case 'tiktok':
      return '🎵';
    case 'x':
      return '🐦';
    case 'facebook':
      return '👥';
    case 'linkedin':
      return '💼';
    case 'snapchat':
      return '👻';
    default:
      return '🌐';
  }
}
