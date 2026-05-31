import { forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered } from 'lucide-react'

export interface TipTapEditorRef {
  insertEmoji: (emoji: string) => void;
  toggleQuote: () => void;
}

interface TipTapEditorProps {
  content: string;
  onChange: (content: string, textLength: number) => void;
  isOverLimit: boolean;
}

export const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(({ content, onChange, isOverLimit }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText().length);
    },
    editorProps: {
      attributes: {
        class: `min-h-[120px] w-full resize-none bg-transparent p-0 text-sm leading-relaxed text-neutral-800 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500 prose dark:prose-invert max-w-none`,
      },
    },
  })

  useImperativeHandle(ref, () => ({
    insertEmoji: (emoji: string) => {
      if (editor) {
        editor.chain().focus().insertContent(emoji).run();
      }
    },
    toggleQuote: () => {
      if (editor) {
        editor.chain().focus().toggleBlockquote().run();
      }
    }
  }), [editor]);

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col">
      <EditorContent editor={editor} className="mb-4" />
      
      {/* Subtle Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 opacity-60 transition-opacity hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('bold') ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('italic') ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('underline') ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('strike') ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <div className="mx-1 h-4 w-px bg-neutral-300 dark:bg-neutral-600" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('bulletList') ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1.5 transition-colors ${
            editor.isActive('orderedList') ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})
