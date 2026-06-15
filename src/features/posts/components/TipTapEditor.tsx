import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Heading1, Heading2, 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Quote, Minus,
  AlignLeft, AlignCenter, List, ListOrdered, 
  Link as LinkIcon 
} from 'lucide-react'

export interface TipTapEditorRef {
  insertEmoji: (emoji: string) => void;
}

interface TipTapEditorProps {
  content: string;
  placeholder?: string;
  onChange: (content: string, textLength: number) => void;
  readonly?: boolean;
}

export const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(({ content, placeholder, onChange, readonly }, ref) => {
  const editor = useEditor({
    editable: !readonly,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'cursor-pointer text-primary-600 underline decoration-primary-300 underline-offset-4 dark:text-primary-400 dark:decoration-primary-700',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Type here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText().length);
    },
    editorProps: {
      attributes: {
        class: `min-h-[140px] w-full resize-none bg-transparent p-0 text-lg leading-relaxed text-neutral-800 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500 prose prose-lg dark:prose-invert max-w-none transition-all duration-300`,
      },
    },
  })

  useImperativeHandle(ref, () => ({
    insertEmoji: (emoji: string) => {
      if (editor) {
        editor.chain().focus().insertContent(emoji).run();
      }
    }
  }), [editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readonly);
    }
  }, [editor, readonly]);

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col group/editor">
      
      {!readonly && (
        <div className="flex flex-nowrap items-center gap-1 border-b border-neutral-100 pb-2 mb-2 dark:border-neutral-800 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('bold') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('italic') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('underline') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('strike') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('code') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('blockquote') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded-md p-1.5 text-neutral-400 transition-colors hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('bulletList') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('orderedList') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL')
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            } else if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
            }
          }}
          className={`rounded-md p-1.5 transition-colors ${
            editor.isActive('link') ? 'text-neutral-900 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50'
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
      )}

      <EditorContent editor={editor} className="mt-2" />
    </div>
  )
})
