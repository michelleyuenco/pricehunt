export interface BlogPost {
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  content: string;          // HTML content
  author: string;
  publishedAt: string;      // ISO date
  category: 'comparison' | 'guide' | 'tips' | 'trend' | 'tutorial';
  tags: string[];
  readingTime: number;      // minutes
  metaTitle: string;        // SEO title
  metaDescription: string;  // SEO description
  ogImage?: string;
}
