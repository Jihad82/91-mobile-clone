
export interface Highlight {
  label: string;
  value: string;
  icon?: string;
}

export interface ExpertRating {
  label: string;
  score: number;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  specScore?: number;
  // Extended Details for Specs Page
  brand?: string;
  model?: string;
  releaseDate?: string;
  status?: string;
  highlights?: Highlight[];
  expertRatings?: ExpertRating[];
  pros?: string[];
  cons?: string[];
  specs?: { category: string; icon?: string; items: { label: string; value: string }[] }[];
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ComparisonData {
  headers: string[];
  rows: { label: string; values: string[] }[];
}

export interface NewsItem {
  id: string;
  title: string;
  timeAgo: string; // Display string, derived from publishedAt
  image: string;
  author?: string; // Legacy string fallback
  isMain?: boolean;
  subtitle?: string;
  category?: string;
  rating?: number;
  tags?: string[];
  readTime?: string;
  // CMS Extended Fields
  slug?: string;
  content?: string; // HTML Body
  status?: 'published' | 'draft' | 'scheduled';
  publishedAt?: string; // ISO Date
  authorId?: string;
  seoTitle?: string;
  seoDescription?: string;
  isReview?: boolean;
  pros?: string[];
  cons?: string[];
  comparisonData?: ComparisonData;
  heroImage?: string; // Large hero for article page
  gallery?: string[];
}

export interface ReviewItem {
  id: string;
  title: string;
  author: string;
  image: string;
  rating?: number;
  isVideo?: boolean;
}

export interface UserReview {
    name: string;
    email?: string;
    title: string;
    rating: number;
    text: string;
    date: string;
}

export interface Brand {
  name: string;
  logo: string; 
}