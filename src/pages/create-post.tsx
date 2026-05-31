import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { PenLine } from "lucide-react";

export default function CreatePost() {
	return (
		<div className="min-h-screen bg-[#FDFDFD] bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] py-12 dark:bg-neutral-950 dark:bg-[radial-gradient(#262626_1px,transparent_1px)]">
			<div className="mx-auto max-w-4xl px-4">
				{/* Page Header (Optional, removing to match the clean look of mockup) */}
				
				{/* Form */}
				<CreatePostForm />
			</div>
		</div>
	);
}
