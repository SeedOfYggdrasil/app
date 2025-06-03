// MenyBar.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  FaBold, FaItalic, FaStrikethrough, FaCode, FaParagraph, FaHeading, FaListUl, FaListOl, FaQuoteLeft,
  FaUndo, FaRedo, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaHighlighter, FaPalette, FaFont, FaLink, FaUnlink
} from 'react-icons/fa';
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6 } from "react-icons/lu";


const MenuButton = ({ icon: Icon, onClick, isActive, title, disabled }) => (
  <button
    onClick={onClick}
    className={`menu-button ${isActive ? 'is-active' : ''}`}
    title={title}
    disabled={disabled}
  >
    <Icon />
  </button>
);
MenuButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  title: PropTypes.string,
  disabled: PropTypes.bool,
};


const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return; // User cancelled
    if (url === '') { // User wants to remove link
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const commonFontFamilies = [
    'Inter', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Poppins', 'Roboto', 'Noto Sans', 'Montserrat', 'Lato', 'Oswald', 'Raleway', 'Ubuntu', 'Rubik'
  ];
   const commonFontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '60px', '72px'];


  return (
    <div className="editor-menu-bar">
      <div className="toolbar-group">
        <MenuButton icon={FaUndo} onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()} />
        <MenuButton icon={FaRedo} onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()} />
      </div>

      <div className="toolbar-group">
        <select
            value={editor.getAttributes('textStyle').fontFamily || ''}
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            className="toolbar-select"
            title="Font Family"
        >
            <option value="">Default Font</option>
            {commonFontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
        </select>
         <select
            value={editor.getAttributes('textStyle').fontSize || '16px'} // Assuming default or grab if set
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            className="toolbar-select font-size-select"
            title="Font Size"
          >
            {commonFontSizes.map(size => <option key={size} value={size}>{size.replace('px', '')}</option>)}
          </select>
      </div>

      <div className="toolbar-group">
        <MenuButton icon={FaBold} onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold" />
        <MenuButton icon={FaItalic} onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic" />
        <MenuButton icon={FaStrikethrough} onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough" />
        <MenuButton icon={FaCode} onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Code" />
        <MenuButton icon={FaHighlighter} onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight"/>
        <label htmlFor="text-color-picker" className="toolbar-label" title="Text Color">
            <FaPalette />
        </label>
        <input
          id="text-color-picker"
          type="color"
          onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#ffffff'}
          className="toolbar-color-picker"
        />
      </div>
      
      <div className="toolbar-group">
        <MenuButton icon={LuHeading1} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1"/>
        <MenuButton icon={LuHeading2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2"/>
        <MenuButton icon={LuHeading3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3"/>
        <MenuButton icon={FaParagraph} onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} title="Paragraph"/>
      </div>

      <div className="toolbar-group">
        <MenuButton icon={FaListUl} onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"/>
        <MenuButton icon={FaListOl} onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List"/>
        <MenuButton icon={FaQuoteLeft} onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote"/>
         <MenuButton icon={FaLink} onClick={setLink} isActive={editor.isActive('link')} title="Set Link" />
        <MenuButton icon={FaUnlink} onClick={() => editor.chain().focus().unsetLink().run()} title="Unset Link" disabled={!editor.isActive('link')} />
      </div>

      <div className="toolbar-group">
        <MenuButton icon={FaAlignLeft} onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left"/>
        <MenuButton icon={FaAlignCenter} onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center"/>
        <MenuButton icon={FaAlignRight} onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right"/>
        <MenuButton icon={FaAlignJustify} onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Align Justify"/>
      </div>
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object,
};

export default MenuBar;