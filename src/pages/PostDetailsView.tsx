import { useNavigate, useParams } from 'react-router-dom';
import { PostCard } from '../features/posts/components/PostCard';
import { CommentsSection } from '../features/posts/components/comments/CommentsSection';
// import type { Post, Comment } from '../features/posts/types/post.d';
import { useGetPostDetails } from '@/features/posts/hooks/useGetPostDetails';
import { useGetPostComments } from '@/features/posts/hooks/useGetPostComments';


export function PostDetailsView() {

  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const { 
    data: postResponse, 
    isLoading: isPostLoading, 
    isError: isPostError 
  } = useGetPostDetails(postId || '');

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetPostComments(postId || '');

  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50/50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  const post = postResponse?.data?.post;

  if (isPostError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 gap-4">
        <p className="text-red-600 font-medium">Failed to load the post. Please try again later.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }


  const comments = commentsData?.pages.flatMap(page => page.data.comments) || [];
  
const totalComments = commentsData?.pages[0]?.data.pagination.total || post.commentsCount; 
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-50/50 min-h-screen">
      
      <button 
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors mb-6 uppercase tracking-wider">
        <span className="text-sm">←</span> Back to feeds
      </button>

      <div className="flex flex-col gap-6">

        <PostCard post={post} />
        
        <CommentsSection 
          comments={comments} 
          totalComments={totalComments}
          onLoadMore={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />
      </div>

    </div>
  );
}