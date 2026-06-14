import { CommentItem } from './CommentItem';
import type { Comment } from '../../types/post';
import { useState } from 'react';
import { useCreateComment } from '../../hooks/useCreateComment';

interface CommentsSectionProps {
    postId: string;
  comments: Comment[];
  totalComments: number;
  currentUserAvatar?: string;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoadingMore?: boolean;
}

export function CommentsSection({ 
    postId,
  comments, 
  totalComments,
  currentUserAvatar,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
}: CommentsSectionProps) {

    const [commentText, setCommentText] = useState('');
    const { mutate: addComment, isPending } = useCreateComment(postId);

    const handleSubmit = () => {
    if (!commentText.trim()) 
        return; 
    
    addComment(commentText, {
      onSuccess: () => {
        setCommentText(''); 
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h3 className="font-bold text-lg text-gray-900 mb-6">
        Comments ({totalComments})
      </h3>


      <div className="flex gap-3 mb-8">
        <img
          src={currentUserAvatar}
          alt="My Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your reflection..."
            className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 resize-none transition-shadow"
            rows={3}
            disabled={isPending} 
          />

          <div className="flex justify-end mt-3">
            <button 
              onClick={handleSubmit}
              disabled={isPending || !commentText.trim()} 
              className="bg-green-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-900 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                'Post Comment'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </div>


      {hasNextPage && (
        <button 
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoadingMore ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600"></div>
              <span>Loading...</span>
            </>
          ) : (
            'Load More Comments'
          )}
        </button>
      )}
    </div>
  );
}