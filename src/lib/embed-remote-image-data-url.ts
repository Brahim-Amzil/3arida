/**
 * Fetches a remote image and returns a base64 data URL for PDF/HTML embedding.
 * Puppeteer on Vercel cannot reliably load Firebase Storage URLs during PDF render.
 */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function fetchImageAsDataUrl(
  imageUrl: string,
): Promise<string | null> {
  const trimmed = imageUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  try {
    const response = await fetch(trimmed, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn('[embed-image] HTTP', response.status, trimmed);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
      console.warn('[embed-image] Invalid size', buffer.length, trimmed);
      return null;
    }

    const contentType =
      response.headers.get('content-type')?.split(';')[0]?.trim() ||
      'image/jpeg';

    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.warn('[embed-image] Failed to fetch', trimmed, error);
    return null;
  }
}
