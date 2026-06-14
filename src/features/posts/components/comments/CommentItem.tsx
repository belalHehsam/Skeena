import type { Comment } from '../../types/post';
import { BiLike,BiSolidLike  } from "react-icons/bi";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const timeFormatted = new Date(comment.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex gap-3 mb-6">
      <img
        src={comment.author.avatar || '/images/default-avatar.png'}
        alt={comment.author.username}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-sm text-gray-900">{comment.author.username}</h4>
            <span className="text-xs text-gray-500">{timeFormatted}</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
        </div>
        
        {/* like comment and reply => to be handled in backend */}
        {/* <div className="flex items-center gap-4 mt-2 ml-2">
          <button className={`flex items-center gap-1 text-xs font-medium transition-colors ${comment.isLiked ? 'text-green-700' : 'text-gray-500 hover:text-green-700'}`}>
            {comment.isLiked ? <BiSolidLike size={18}/>  : <BiLike size={18} /> } 
           
            {comment.likesCount}
          </button>
          <button className="text-xs font-medium text-gray-500 hover:text-green-700 transition-colors">
            Reply
          </button>
        </div> */}
      </div>
    </div>
  );
}