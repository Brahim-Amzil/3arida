'use client';

import React, { useState, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter your text...',
  maxLength = 5000,
  rows = 8,
  className = '',
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Handle text formatting
  const formatText = (format: 'bold' | 'underline') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = value;
    let newCursorPos = start;

    if (format === 'bold') {
      if (selectedText) {
        // Wrap selected text with **bold**
        const boldText = `**${selectedText}**`;
        newText = value.substring(0, start) + boldText + value.substring(end);
        newCursorPos = end + 4; // Position cursor after the closing **
      } else {
        // Insert bold markers at cursor
        const boldMarkers = '****';
        newText =
          value.substring(0, start) + boldMarkers + value.substring(start);
        newCursorPos = start + 2; // Position cursor between the markers
      }
    } else if (format === 'underline') {
      if (selectedText) {
        // Wrap selected text with __underline__
        const underlineText = `__${selectedText}__`;
        newText =
          value.substring(0, start) + underlineText + value.substring(end);
        newCursorPos = end + 4; // Position cursor after the closing __
      } else {
        // Insert underline markers at cursor
        const underlineMarkers = '____';
        newText =
          value.substring(0, start) + underlineMarkers + value.substring(start);
        newCursorPos = start + 2; // Position cursor between the markers
      }
    }

    onChange(newText);

    // Restore cursor position after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Removed keyboard shortcuts - using buttons only for simplicity
  // This ensures Enter key works normally for line breaks

  // Convert display text back to markdown when editing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Format text for preview
  const getPreviewHTML = () => {
    return value
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>
      .replace(/__(.*?)__/g, '<u>$1</u>') // Convert __text__ to <u>
      .replace(/\n/g, '<br>'); // Convert line breaks to <br>
  };

  return (
    <div className={`relative ${className}`}>
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-t-md border border-b-0 border-gray-300">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="px-3 py-1 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          title="Make selected text bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="px-3 py-1 text-sm underline bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          title="Make selected text underlined"
        >
          U
        </button>
        <div className="text-xs text-gray-500 ml-auto">
          Select text and click buttons for formatting
        </div>
      </div>

      {/* Text Area - Normal behavior, Enter works for line breaks */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-gray-300 rounded-b-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm whitespace-pre-wrap"
        style={{
          resize: 'vertical',
          minHeight: `${rows * 1.5}rem`,
        }}
      />

      {/* Character Count and Preview Button */}
      <div className="flex justify-between items-center mt-2">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <div className="text-xs text-gray-500">
          {value.length}/{maxLength} characters
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && value && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border">
          <div className="text-sm font-medium text-gray-600 mb-3">Preview:</div>
          <div
            className="text-sm text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getPreviewHTML(),
            }}
          />
        </div>
      )}

      {/* Help Text */}
      <div className="mt-1 text-xs text-gray-500">
        <strong>Tips:</strong> Press Enter for line breaks. Select text and
        click B for bold or U for underline. You can also type **text** for bold
        or __text__ for underline.
      </div>
    </div>
  );
}
