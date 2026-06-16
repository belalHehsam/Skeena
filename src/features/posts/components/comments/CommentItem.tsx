import type { Comment } from '../../types/post';

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColorClass } from "@/components/shared/UserAvatar";
import { useTranslation } from "react-i18next";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const { i18n } = useTranslation();
  const timeFormatted = new Date(comment.createdAt).toLocaleTimeString(i18n.language || 'en', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex gap-3 mb-6">
      <Link to={`/profile/${comment.author._id}`}>
        <Avatar className="w-10 h-10 hover:opacity-80 transition-opacity">
          <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
          <AvatarFallback className={`text-sm font-bold ${getAvatarColorClass(comment.author.username)}`}>
            {comment.author.username.slice(0, 2).toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1">
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/profile/${comment.author._id}`} className="hover:underline">
              <h4 className="font-bold text-sm text-foreground">{comment.author.username}</h4>
            </Link>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{timeFormatted}</span>
          </div>
          <p className="text-foreground text-sm leading-relaxed">{comment.content}</p>
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