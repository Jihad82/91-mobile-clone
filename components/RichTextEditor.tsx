
import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Icons } from './Icon';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    icon: Icon,
    title
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    disabled?: boolean, 
    icon: any,
    title?: string 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
        isActive ? 'bg-primary/20 text-primary' : 'text-gray-700 dark:text-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    </button>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
      <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Icons.Bold} title="Bold" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Icons.Italic} title="Italic" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={Icons.Underline} title="Underline" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Icons.Strikethrough} title="Strikethrough" />
      </div>

      <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Icons.Heading1} title="H1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Icons.Heading2} title="H2" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Icons.Heading3} title="H3" />
      </div>

      <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={Icons.AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={Icons.AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={Icons.AlignRight} title="Align Right" />
      </div>

      <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={Icons.List} title="Bullet List" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={Icons.ListOrdered} title="Ordered List" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Icons.Quote} title="Quote" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Icons.Code} title="Code Block" />
      </div>

      <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} icon={Icons.Link} title="Add Link" />
        <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} icon={Icons.Unlink} title="Remove Link" />
        <ToolbarButton onClick={addImage} icon={Icons.Image} title="Add Image" />
        <ToolbarButton onClick={addYoutube} icon={Icons.Youtube} title="Add YouTube Video" />
      </div>

      <div className="flex gap-0.5 ml-auto">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Icons.Undo} title="Undo" />
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Icons.Redo} title="Redo" />
      </div>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl shadow-lg my-6 max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl shadow-lg my-6',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Write your story...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-gray-800 dark:text-gray-200',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content if changed externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-900 shadow-sm">
      <MenuBar editor={editor} />
      
      {editor && (
        <BubbleMenu className="bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex gap-1" tippyOptions={{ duration: 100 }} editor={editor}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('bold') ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-300'}`}
          >
            <Icons.Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('italic') ? 'text-primary italic' : 'text-gray-600 dark:text-gray-300'}`}
          >
            <Icons.Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('underline') ? 'text-primary underline' : 'text-gray-600 dark:text-gray-300'}`}
          >
            <Icons.Underline size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('strike') ? 'text-primary line-through' : 'text-gray-600 dark:text-gray-300'}`}
          >
            <Icons.Strikethrough size={16} />
          </button>
          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
             onClick={() => {
                const url = window.prompt('Link URL');
                if (url) editor.chain().focus().setLink({ href: url }).run();
             }}
             className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('link') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}
          >
             <Icons.Link size={16} />
          </button>
        </BubbleMenu>
      )}

      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 cursor-text" onClick={() => editor?.commands.focus()}>
         <EditorContent editor={editor} />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 flex justify-between px-4">
         <span>{editor?.storage.characterCount?.characters()} characters</span>
         <span>{editor ? Math.ceil((editor.storage.characterCount?.words() || 0) / 200) : 0} min read</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
