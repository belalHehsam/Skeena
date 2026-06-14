import { useParams } from "react-router-dom";


export default function SinglePost() {
  const { postId } = useParams<{ postId: string }>();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        Post ID: <span className="font-mono">{postId}</span>
      </p>
    </div>
  );
}
