// app/api/dvids-news/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const search = sp.get('search');
  const limit = Math.min(parseInt(sp.get('limit') || '10', 10), 50); // API caps at 50

  if (!search) {
    return NextResponse.json(
      { error: 'Search term is required' },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      format: 'rss',
      type: 'news',
      q: search,
      max_results: String(limit),
      api_key: process.env.DVIDS_API_KEY || '', // <-- add to .env
    });

    const url = `https://api.dvidshub.net/search?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CIVSail.com Ship News Bot/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) throw new Error(`DVIDS API error: ${response.status}`);
    const xml = await response.text();

    const articles = parseRSS(xml, limit);
    return NextResponse.json({
      articles,
      searchTerm: search,
      total: articles.length,
    });
  } catch (err) {
    console.error('DVIDS API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

// tolerant RSS parser (handles CDATA or plain text)
function parseRSS(xmlText: string, limit: number) {
  const items: Array<{
    id: string;
    title: string;
    url: string;
    description: string;
    date: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const get = (re: RegExp, s: string) => (re.exec(s)?.[1] || '').trim();

  let m;
  let count = 0;
  while ((m = itemRegex.exec(xmlText)) && count < limit) {
    const it = m[1];
    const title = get(
      /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/,
      it
    );
    const link = get(/<link>([\s\S]*?)<\/link>/, it);
    const desc = get(
      /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/,
      it
    ).replace(/<[^>]+>/g, '');
    const date =
      get(/<pubDate>([\s\S]*?)<\/pubDate>/, it) || new Date().toISOString();
    const guid = get(/<guid[^>]*>([\s\S]*?)<\/guid>/, it) || link;

    if (title && link) {
      items.push({ id: guid, title, url: link, description: desc, date });
      count++;
    }
  }
  return items;
}
