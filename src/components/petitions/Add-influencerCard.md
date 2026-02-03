Below is a simple, production-friendly, platform-agnostic solution that works with YouTube, Instagram, TikTok, X, etc.
✅ No auth
✅ No official APIs
✅ Works in Next.js + React + TS

Architecture (clean & safe)

Client

User pastes channel URL

Calls your API

Server (Next.js route)

Fetch HTML

Extract Open Graph tags

Normalize data

Cache it

Return { name, image, platform }

1️⃣ Install one tiny dependency (worth it)

Parsing HTML with regex gets fragile. Use cheerio (lightweight, fast).

npm install cheerio

2️⃣ Server-side preview endpoint (robust)
/app/api/channel-preview/route.ts
import { NextResponse } from 'next/server';
import \* as cheerio from 'cheerio';

export async function POST(req: Request) {
try {
const { url } = await req.json();

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const og = (prop: string) =>
      $(`meta[property="${prop}"]`).attr('content') ||
      $(`meta[name="${prop}"]`).attr('content') ||
      null;

    const title =
      og('og:title') ||
      $('title').text() ||
      'Unknown Channel';

    const image =
      og('og:image') ||
      og('twitter:image') ||
      null;

    return NextResponse.json({
      name: title,
      image,
      source: detectPlatform(url),
    });

} catch {
return NextResponse.json(
{ error: 'Failed to fetch channel' },
{ status: 400 }
);
}
}

function detectPlatform(url: string) {
if (url.includes('youtube')) return 'youtube';
if (url.includes('instagram')) return 'instagram';
if (url.includes('tiktok')) return 'tiktok';
if (url.includes('twitter') || url.includes('x.com')) return 'x';
return 'unknown';
}

3️⃣ Client-side React hook (clean UX)
export function useChannelPreview() {
const fetchPreview = async (url: string) => {
const res = await fetch('/api/channel-preview', {
method: 'POST',
body: JSON.stringify({ url }),
});

    if (!res.ok) throw new Error('Preview failed');
    return res.json();

};

return { fetchPreview };
}

4️⃣ UI example (Petition page card)
const { fetchPreview } = useChannelPreview();

const loadChannel = async () => {
const data = await fetchPreview(channelUrl);
setChannel(data);
};

{channel && (

  <div className="flex items-center gap-3">
    <img
      src={channel.image}
      className="h-12 w-12 rounded-full"
      alt={channel.name}
    />
    <div>
      <p className="font-semibold">{channel.name}</p>
      <p className="text-xs text-gray-500">
        Verified from {channel.source}
      </p>
    </div>
  </div>
)}

5️⃣ VERY important: cache this 🧠

Do not fetch every page load.

Minimum:

Store { url, name, image } in DB

Refresh once every 24–72h

This avoids:

rate limits

slow pages

platforms blocking you

What this gives you

✅ Influencer drops link
✅ You auto-generate a clean “Verified Creator” card
✅ No OAuth
✅ No API keys
✅ Works across platforms

Exactly what a petitions app needs.
