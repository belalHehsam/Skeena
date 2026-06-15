export type Recommendation = {
  type: "quran" | "hadith";
  arabicText: string;
  translationText: string;
  source: string;
  surahName?: string;
  reference: string;
  relevanceExplanation: string;
};

export type ModerationInfo = {
  status: "approved" | "needs_review";
  reasoning: string;
  detectedTopic: string;
};

export type Post = {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  image?: string;
  tags: (
    | "quran"
    | "hadith"
    | "fiqh"
    | "general"
    | "dua"
    | "tafsir"
    | "seerah"
    | "reminder"
  )[];
  likesCount: number;
  commentsCount: number;
  commentsEnabled: boolean;
  isFlagged: boolean;
  isLiked: boolean;
  moderationStatus: "approved" | "needs_review";
  recommendation?: Recommendation;
  createdAt: string;
  updatedAt: string;
};

export interface PostResponse {
  status: string;
  data: {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      totalResults: number;
      hasNextPage: number;
    };
  };
}

export type CreatePostPayload = {
  content: string;
  category: "quran" | "hadith" | "fiqh" | "general";
  image?: File;
};

export type CreatePostResponse = {
  status: "success";
  data: {
    post: Post;
    moderation: ModerationInfo;
  };
};

export type GetAllPostsResponse = {
  status: "success";
  data: {
    posts: Post[];
    pagination: {
      currentPage: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  };
};

export type AnalyzePostResponse = {
  status: "success";
  data: {
    moderation: ModerationInfo;
    recommendation: Recommendation | null;
  };
};

export type Comment = {
  _id: string;
  post: string; 
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string | null; 
  createdAt: string;
  updatedAt: string;
};

export type GetCommentsResponse = {
  status: "success";
  data: {
    comments: Comment[];
    pagination: {
      currentPage: number;
      perPage: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
    };
  };
};

export type CreateCommentPayload = {
  postId: string;
  content: string;
  parentId?: string;
};

export type GetPostByIdResponse = {
  status: "success";
  data: {
    post: Post;
  };
};
