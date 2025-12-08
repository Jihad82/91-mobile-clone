
import React, { useRef, useState } from 'react';
import { Icons } from './Icon';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  const insertImage = () => {
    const url = prompt('Enter Image URL:', 'https://placehold.co/600x400');
    if (url) execCommand('insertImage', url);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-[500px] bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 items-center">
        <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Bold"><Icons.Type size={16} strokeWidth={3} /></button>
        <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Italic"><span className="italic font-serif font-bold">I</span></button>
        <button onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Underline"><span className="underline font-bold">U</span></button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button onClick={() => execCommand('formatBlock', 'H2')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-bold" title="Heading 2">H2</button>
        <button onClick={() => execCommand('formatBlock', 'H3')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-bold" title="Heading 3">H3</button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"><Icons.Menu size={16} /></button>
        <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"><Icons.Menu size={16} className="rotate-180" /></button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <button onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Quote"><Icons.MessageCircle size={16} /></button>
        <button onClick={insertImage} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Image"><Icons.Image size={16} /></button>
        
        <div className="relative">
             <button onClick={() => setShowLinkInput(!showLinkInput)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Link"><Icons.Globe size={16} /></button>
             {showLinkInput && (
                 <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-2 rounded-lg flex gap-2 z-50 w-64">
                     <input 
                       type="text" 
                       value={linkUrl} 
                       onChange={(e) => setLinkUrl(e.target.value)} 
                       className="flex-1 text-xs border rounded px-2 py-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                       placeholder="https://..."
                     />
                     <button onClick={handleLink} className="bg-primary text-white text-xs px-2 rounded font-bold">Add</button>
                 </div>
             )}
        </div>
      </div>

      {/* Editor Area */}
      <div 
        ref={editorRef}
        className="flex-1 p-4 overflow-y-auto outline-none prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ minHeight: '300px' }}
      >
      </div>
    </div>
  );
};

export default RichTextEditor;
