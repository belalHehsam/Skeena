import type { Post } from '../types/post'; 
import { FaRegComment ,FaHeart,FaRegHeart,FaRegBookmark   } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { useTogglePostLike } from '../hooks/useTogglePostLike';

interface PostDetailsProps {
  post: Post;
}

export function PostDetails({ post }: PostDetailsProps) {

    const { mutate: toggleLike } = useTogglePostLike();

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short'
  });

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src={post.author.avatar || '/images/default-avatar.png'} 
            alt={post.author.username} 
            className="w-12 h-12 rounded-full object-cover" 
          />
          <div>
            <h3 className="font-bold text-gray-900">{post.author.username}</h3>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>

      {post.image && (
        <img 
          src={post.image} 
          alt="Post highlight" 
          className="w-full h-auto rounded-xl object-cover" 
        />
      )}

      {post.recommendation && (
        <blockquote className="border-l-4 border-green-700 pl-4 my-2 bg-green-50/50 py-3 pr-3 rounded-r-lg">
          <p className="italic text-lg font-medium text-green-800">
            "{  post.recommendation.translationText || post.recommendation.arabicText}"
          </p>
          <footer className="text-sm text-gray-500 mt-2 font-semibold uppercase tracking-wider">
            — {post.recommendation.source} {post.recommendation.reference}
          </footer>
        </blockquote>
      )}

      <div 
        className="text-gray-700 space-y-4 leading-relaxed prose prose-green max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-full text-sm capitalize">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
        <div className="flex gap-6">
          <button 
          onClick={() => toggleLike(post._id)}
          className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-green-700' : 'text-gray-500 hover:text-green-700'}`}>
            {post.isLiked ? <FaHeart size={22} /> : <FaRegHeart size={22}/> }
 
              
            <span className="font-medium">{post.likesCount}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors">
            <FaRegComment size={22} />

            <span className="font-medium">{post.commentsCount}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors">
            <IoShareSocialOutline  size={23}/>

          </button>
        </div>
        
        <button className="text-gray-500 hover:text-green-700 transition-colors">
            <FaRegBookmark size={22}/>
        </button>
      </div>

    </div>
  );
}