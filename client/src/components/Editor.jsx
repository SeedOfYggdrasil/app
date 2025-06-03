// Editor.jsx

import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

import MenuBar from './MenuBar';
import '../css/Editor.css';

// Custom FontSize extension
const FontSize = FontFamily.extend({ // Re-using FontFamily as a base to store an attribute
  name: 'fontSize',
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize.replace('px',''),
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {};
          }
          return { style: `font-size: ${attributes.fontSize}px` };
        },
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.setMark(this.name, { fontSize });
      },
      unsetFontSize: () => ({ commands }) => { // Renamed from unsetFontFamily
        return commands.unsetMark(this.name);
      },
    };
  },
});


const Editor = forwardRef((props, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      TextStyle, // Required for FontFamily, Color, and our custom FontSize
      FontFamily,
      FontSize, // Our custom extension for font size
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your masterpiece...' }),
      Link.configure({
        openOnClick: false, // We'll handle clicks or provide an edit UI if needed
        autolink: true,
      }),
    ],
    content: '', // Starts empty
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none max-w-none leading-relaxed', // Tailwind classes can be used here if Tailwind is setup
      },
    },
  });

  useImperativeHandle(ref, () => ({
    getContentHTML: () => editor?.getHTML() || '',
    getContentJSON: () => editor?.getJSON() || {}, // TipTap's JSON format
    setContent: (newContent, format = 'html') => {
      if (editor) {
        if (format === 'json' && typeof newContent === 'object') {
            editor.commands.setContent(newContent, false);
        } else if (typeof newContent === 'string') {
            editor.commands.setContent(newContent, false);
        } else {
            editor.commands.clearContent(false); // Clear if invalid format
        }
      }
    },
    resetEditor: () => {
      editor?.commands.clearContent();
      editor?.commands.focus();
    },
    getInstance: () => editor, // Expose editor instance for more direct control if needed
  }));

  return (
    <div className="editor-container-tiptap">
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="editor-content-area"/>
    </div>
  );
});

Editor.propTypes = {
  // Props if any needed from parent
};
Editor.displayName = 'Editor';

export default Editor;