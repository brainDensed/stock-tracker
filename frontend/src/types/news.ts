export interface NewsArticle {
    uuid: string;
    title: string;
    description: string;
    keywords: string;
    snippet: string;
    url: string;
    image_url: string;
    language: string;
    published_at: string;
    source: string;
    entities?: {
      symbol: string;
      name: string;
      country: string;
      type: string;
      industry: string;
      match_score: number;
      sentiment_score: number;
    }[];
  }
  
  export interface NewsResponse {
    data: NewsArticle[];
    meta?: {
      found: number;
      returned: number;
      limit: number;
      page: number;
    };
  }
  