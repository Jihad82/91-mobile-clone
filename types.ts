export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  specScore?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  timeAgo: string;
  image: string;
  author?: string;
  isMain?: boolean;
}

export interface ReviewItem {
  id: string;
  title: string;
  author: string;
  image: string;
  rating?: number;
  isVideo?: boolean;
}

export interface Brand {
  name: string;
  logo: string; // Using simple text or placeholder for logos in this demo
}