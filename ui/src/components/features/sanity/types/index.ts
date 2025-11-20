export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt?: string;
  _createdAt?: string;
  mainImage?: {
    asset?: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  estimatedReadingTime?: number;
  author?: string;
  body?: Block[];
}

export interface Span {
  marks: string[];
  text: string;
  _key: string;
  _type: string;
}

export interface Block {
  style: string;
  _key: string;
  markDefs: [];
  children: Span[];
  _type: string;
}

export interface Image {
  _key: string;
  asset: {
    _ref: string;
    _type: string;
  };
  _type: string;
}

export interface Slug {
  current: string;
  _type: string;
}

export interface Post {
  title: string;
  slug: Slug;
  body: (Block | Image)[];
}

export interface FetchPostsResponse {
  result: Post[];
  syncTags: string[];
  ms: number;
}
