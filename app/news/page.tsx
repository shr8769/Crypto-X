"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Calendar, ExternalLink } from "lucide-react";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  description: string;
  sentiment?: string | null; // Newsdata.io does not provide sentiment, so this will be neutral
};

const API_URL =
  "https://newsdata.io/api/1/latest?apikey=pub_01f979cef56640bc9e60dd11dc05e9e1&q=cryptocurrency";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch live crypto news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setNews(data.results || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch news. Please try again later.");
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Rotate news every 10 seconds
  useEffect(() => {
    if (!news.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % news.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [news]);

  const getSentimentIcon = () => (
    <Calendar className="w-5 h-5 text-gray-400" />
  );
  const getSentimentColor = () => "border-l-gray-400 bg-gray-900/30";

  if (loading) {
    return (
      <div className="min-h-screen bg-binanceDark flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-400 border-t-white rounded-full animate-spin"></div>
          <div className="mt-4 text-center text-gray-400 font-medium">
            Loading live crypto news...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-binanceDark flex flex-col items-center justify-center">
        <div className="text-red-400 text-center max-w-md">
          <div className="text-xl mb-4">⚠️ News Update Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="min-h-screen bg-binanceDark flex flex-col items-center justify-center">
        <div className="text-gray-400">No news available at the moment</div>
      </div>
    );
  }

  const item = news[current];

  return (
    <div className="min-h-screen bg-binanceDark flex flex-col items-center py-16 px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center text-green-300 mb-2">
          Live Crypto News
        </h1>
        <p className="text-lg text-center text-gray-300 mb-10">
          Real-time updates from 500+ trusted sources
        </p>

        {/* News Card */}
        <article
          className={`p-6 rounded-2xl shadow-xl backdrop-blur-md border-l-4 transition-all duration-300 mb-6 ${getSentimentColor()}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getSentimentIcon()}
              <div>
                <h2 className="text-xl font-bold text-green-100 leading-tight">
                  {item.title}
                </h2>
                <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                  <span>{item.source_id}</span>
                  <span>•</span>
                  <span>
                    {new Date(item.pubDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span className="capitalize">neutral</span>
                </div>
              </div>
            </div>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-2 hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Read full article"
            >
              <ExternalLink className="w-5 h-5 text-gray-400 hover:text-green-300" />
            </a>
          </div>
          <p className="text-gray-200 leading-relaxed">{item.description}</p>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-green-400 transition-all duration-1000"
              style={{ animation: "progress 10s linear forwards" }}
            />
          </div>
        </article>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === current ? "bg-green-400" : "bg-gray-600"
              }`}
              aria-label={`News item ${index + 1}`}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes progress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
