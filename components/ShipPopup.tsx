import { useState, useEffect } from 'react';
import { X, Calendar, ExternalLink } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  date: string;
  url: string;
  description: string;
}

interface ShipPopupProps {
  isOpen: boolean;
  onClose: () => void;
  shipName: string;
  shipHull: string;
}

export default function ShipPopup({ isOpen, onClose, shipName, shipHull }: ShipPopupProps) {
  const [activeTab, setActiveTab] = useState('news');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format search terms for better API results
  const searchTerms = [
    `USNS ${shipName}`,
    shipName,
    shipHull
  ];

  useEffect(() => {
    if (isOpen && activeTab === 'news') {
      fetchNews();
    }
  }, [isOpen, activeTab, shipName]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try each search term until we find articles
      let allArticles: NewsArticle[] = [];
      
      for (const searchTerm of searchTerms) {
        const response = await fetch(`/api/dvids-news?search=${encodeURIComponent(searchTerm)}&limit=3`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            allArticles = data.articles;
            break; // Found articles, stop searching
          }
        }
      }
      
      setArticles(allArticles);
    } catch (err) {
      setError('Failed to load news articles');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">USNS {shipName}</h2>
              <p className="text-blue-200">{shipHull}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'news'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {shipName} Recent News
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'photos'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {shipName} Photos
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'news' && (
            <div>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading news articles...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {!loading && !error && articles.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No recent news available for USNS {shipName}</p>
                </div>
              )}

              {!loading && !error && articles.length > 0 && (
                <div className="space-y-6">
                  {articles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {article.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(article.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Read full article"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <span className="text-4xl">📷</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {shipName} Photos Coming Soon
              </h3>
              <p className="text-gray-500 mb-6">
                We're working to add ship-specific photo galleries. If you have photos of the USNS {shipName}, 
                we'd love to include them!
              </p>
              <a
                href={`mailto:support@civsail.com?subject=USNS ${shipName} Photos Submission`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Submit Photos
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}