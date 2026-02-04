import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid URL is required' },
        { status: 400 },
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 },
      );
    }

    console.log('🔍 Fetching channel preview for:', url);

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      // Remove timeout property as it's not supported in fetch API
      signal: AbortSignal.timeout(15000), // 15 second timeout using AbortSignal
    });

    if (!res.ok) {
      console.error('❌ Failed to fetch URL:', res.status, res.statusText);
      return NextResponse.json(
        {
          error: `Failed to fetch channel data: ${res.status} ${res.statusText}`,
        },
        { status: 400 },
      );
    }

    const html = await res.text();
    console.log('📄 HTML fetched, length:', html.length);

    const $ = cheerio.load(html);

    // Helper function to get Open Graph or meta tags
    const getMetaContent = (property: string): string | null => {
      const ogContent = $(`meta[property="${property}"]`).attr('content');
      const nameContent = $(`meta[name="${property}"]`).attr('content');
      const result = ogContent || nameContent || null;
      if (result) {
        console.log(`✅ Found ${property}:`, result.substring(0, 100));
      }
      return result;
    };

    // Extract title
    const title =
      getMetaContent('og:title') ||
      getMetaContent('twitter:title') ||
      $('title').text().trim() ||
      'Unknown Channel';

    console.log('📝 Extracted title:', title);

    // Extract image - try multiple sources
    const image =
      getMetaContent('og:image') ||
      getMetaContent('og:image:url') ||
      getMetaContent('og:image:secure_url') ||
      getMetaContent('twitter:image') ||
      getMetaContent('twitter:image:src') ||
      $('link[rel="image_src"]').attr('href') ||
      null;

    console.log('🖼️ Extracted image:', image);

    // Extract description (optional)
    const description =
      getMetaContent('og:description') ||
      getMetaContent('twitter:description') ||
      getMetaContent('description') ||
      null;

    console.log('📄 Extracted description:', description?.substring(0, 100));

    // Detect platform
    const platform = detectPlatform(url);

    const result = {
      name: cleanTitle(title, platform),
      image: image,
      description: description ? description.substring(0, 200) : null,
      platform: platform,
      url: url,
    };

    console.log('✅ Channel preview extracted successfully:', {
      name: result.name,
      hasImage: !!result.image,
      imageUrl: result.image?.substring(0, 100),
      platform: result.platform,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Error in channel preview:', error);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json(
      { error: `Failed to fetch channel preview: ${error.message}` },
      { status: 500 },
    );
  }
}

function detectPlatform(url: string): string {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (lowerUrl.includes('instagram.com')) {
    return 'instagram';
  }
  if (lowerUrl.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return 'x';
  }
  if (lowerUrl.includes('facebook.com')) {
    return 'facebook';
  }
  if (lowerUrl.includes('linkedin.com')) {
    return 'linkedin';
  }
  if (lowerUrl.includes('snapchat.com')) {
    return 'snapchat';
  }

  return 'unknown';
}

function cleanTitle(title: string, platform: string): string {
  // Remove common suffixes that platforms add
  let cleaned = title.trim();

  // YouTube specific cleaning
  if (platform === 'youtube') {
    cleaned = cleaned.replace(/ - YouTube$/, '');
  }

  // Instagram specific cleaning
  if (platform === 'instagram') {
    cleaned = cleaned.replace(/ • Instagram$/, '');
    cleaned = cleaned.replace(/ on Instagram$/, '');
  }

  // TikTok specific cleaning
  if (platform === 'tiktok') {
    cleaned = cleaned.replace(/ \| TikTok$/, '');
  }

  // Twitter/X specific cleaning
  if (platform === 'x') {
    cleaned = cleaned.replace(/ \/ X$/, '');
    cleaned = cleaned.replace(/ on X$/, '');
  }

  return cleaned || 'Unknown Channel';
}
