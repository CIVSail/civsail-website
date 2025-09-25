// app/api/dvids-news/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface DVIDSArticle {
  id: string;
  title: string;
  description: string;
  publish_date: string;
  url: string;
}

interface DVIDSSearchResponse {
  results?: DVIDSArticle[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '5');

  if (!search) {
    return NextResponse.json(
      { error: 'Search parameter is required' },
      { status: 400 }
    );
  }

  // Get API key from environment variables
  const apiKey = process.env.DVIDS_API_KEY;
  if (!apiKey) {
    console.error('DVIDS_API_KEY environment variable is not set');
    return NextResponse.json(
      { error: 'API configuration error' },
      { status: 500 }
    );
  }

  try {
    // Search variations for better results
    const searchTerms = [
      `"${search}"`, // Exact phrase search
      search, // Regular search
      search.replace(/\s+/g, ' '), // Clean up whitespace
      search.replace(/USNS\s+/i, ''), // Try without USNS prefix
    ];

    let allArticles: DVIDSArticle[] = [];

    // Try each search term
    for (const term of searchTerms) {
      if (allArticles.length >= limit) break;

      // DVIDS API endpoint for news search
      const searchUrl = new URL('https://api.dvidshub.net/search');
      searchUrl.searchParams.set('q', term);
      searchUrl.searchParams.set('type', 'news');
      searchUrl.searchParams.set('max_results', '50');
      searchUrl.searchParams.set('sort', 'publishdate');
      searchUrl.searchParams.set('sortdir', 'desc');
      searchUrl.searchParams.set('api_key', apiKey);

      const response = await fetch(searchUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CIVSail-News-Fetcher/1.0',
        },
      });

      if (response.ok) {
        const data: DVIDSSearchResponse = await response.json();

        if (data.results && data.results.length > 0) {
          // Add articles, avoiding duplicates
          const newArticles = data.results.filter(
            (article) =>
              !allArticles.some((existing) => existing.id === article.id)
          );
          allArticles.push(...newArticles);
        }
      }

      // Add small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // If no results, try some broader terms
    if (allArticles.length === 0) {
      const broaderTerms = [
        'military sealift command',
        't-ake',
        'msc civilian mariner',
        'family cruise',
      ];

      for (const term of broaderTerms) {
        if (allArticles.length >= 3) break; // Just get a few general articles

        const searchUrl = new URL('https://api.dvidshub.net/search');
        searchUrl.searchParams.set('q', term);
        searchUrl.searchParams.set('type', 'news');
        searchUrl.searchParams.set('max_results', '10');
        searchUrl.searchParams.set('sort', 'publishdate');
        searchUrl.searchParams.set('sortdir', 'desc');
        searchUrl.searchParams.set('api_key', apiKey);

        try {
          const response = await fetch(searchUrl.toString());
          if (response.ok) {
            const data: DVIDSSearchResponse = await response.json();
            if (data.results && data.results.length > 0) {
              const newArticles = data.results
                .filter(
                  (article) =>
                    !allArticles.some((existing) => existing.id === article.id)
                )
                .slice(0, 2); // Just take 2 from each broader search
              allArticles.push(...newArticles);
            }
          }
        } catch (error) {
          console.log(`Error searching broader term "${term}":`, error);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Sort by date and limit results
    const sortedArticles = allArticles
      .sort(
        (a, b) =>
          new Date(b.publish_date).getTime() -
          new Date(a.publish_date).getTime()
      )
      .slice(0, limit);

    // Transform the data for the frontend
    const articles = sortedArticles.map((article) => ({
      id: article.id,
      title: article.title || 'Untitled Article',
      date: article.publish_date || new Date().toISOString(),
      url: article.url || `https://www.dvidshub.net/news/${article.id}`,
      description: article.description || 'No description available',
    }));

    return NextResponse.json({
      articles,
      searchTerm: search,
      total: articles.length,
    });
  } catch (error) {
    console.error('Error fetching DVIDS news:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch news articles',
        articles: [],
        searchTerm: search,
        total: 0,
      },
      { status: 500 }
    );
  }
}
