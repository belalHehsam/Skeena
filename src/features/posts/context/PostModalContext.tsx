import { createContext, useContext, useState, type ReactNode } from "react";
import type { Post } from "../types/post";

interface PostModalContextType {
  isOpen: boolean;
  editingPost: Post | null;
  openCreate: () => void;
  openEdit: (post: Post) => void;
  closeModal: () => void;
}

const PostModalContext = createContext<PostModalContextType | undefined>(undefined);

export function PostModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const openCreate = () => {
    setEditingPost(null);
    setIsOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Don't clear editingPost immediately so the exit animation doesn't flash empty state
    setTimeout(() => setEditingPost(null), 300);
  };

  return (
    <PostModalContext.Provider
      value={{ isOpen, editingPost, openCreate, openEdit, closeModal }}
    >
      {children}
    </PostModalContext.Provider>
  );
}

export function usePostModal() {
  const context = useContext(PostModalContext);
  if (context === undefined) {
    throw new Error("usePostModal must be used within a PostModalProvider");
  }
  return context;
}
