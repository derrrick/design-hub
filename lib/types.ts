export type Category = {
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
};

export type Resource = {
  title: string;
  url: string;
  xPostUrl: string | null;
  authorHandle: string;
  profileUrl: string | null;
  categorySlug: string;
  tags: string[];
  note: string;
  featured: boolean;
};

export type ArticleLink = {
  href: string;
  label: string;
};

export type FeedPost = {
  id: string;
  postUrl: string;
  authorName: string;
  authorHandle: string;
  profileUrl: string | null;
  excerpt: string;
  topic: string | null;
  note: string | null;
  likes: number;
  reposts: number;
  replies: number;
  article: ArticleLink | null;
  postedAt: string;
  feedDate: string;
};

export type FeedDay = {
  date: string;
  count: number;
};

export type LatestReading = {
  date: string | null;
  isToday: boolean;
  posts: FeedPost[];
  earlierDays: number;
};
