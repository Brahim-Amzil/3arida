'use client';

import React, { useState, useRef } from 'react';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
}

export default function SimpleRichTextEditor({
  value,
  onChange,
  placeholder = 'Enter your text...',
  maxLength = 5000,
  rows = 8,
  className = '',
}: SimpleRichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Handle text formatting - simple and reliable
  const formatText = (format: 'bold' | 'underline') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (!selectedText) {
      alert('Please select some text first, then click the formatting button.');
      return;
    }

    let formattedText = '';
    if (format === 'bold') {
      formattedText = `**${selectedText}**`;
    } else if (format === 'underline') {
      formattedText = `__${selectedText}__`;
    }

    const newText =
      value.substring(0, start) + formattedText + value.substring(end);
    onChange(newText);

    // Restore focus and cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + formattedText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Simple change handler - no interference
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Format text for preview
  const getPreviewHTML = () => {
    return value
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **text** → <strong>text</strong>
      .replace(/__(.*?)__/g, '<u>$1</u>') // __text__ → <u>text</u>
      .replace(/\n/g, '<br>'); // Line breaks → <br>
  };

  return (
    <div className={`relative ${className}`}>
      {/* Simple Formatting Toolbar */}
      <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg border">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => formatText('bold')}
            className="px-4 py-2 text-sm font-bold bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => formatText('underline')}
            className="px-4 py-2 text-sm underline bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            U
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Select text first, then click B for bold or U for underline
        </div>
      </div>

      {/* Simple Textarea - No interference */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base leading-relaxed resize-vertical"
        style={{
          minHeight: `${rows * 1.8}rem`,
          fontFamily: 'inherit',
        }}
      />

      {/* Bottom Controls */}
      <div className="flex justify-between items-center mt-3">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <div className="text-sm text-gray-500">
          {value.length}/{maxLength} characters
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && value && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Preview:
          </div>
          <div
            className="text-base text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getPreviewHTML(),
            }}
          />
        </div>
      )}

      {/* Simple Help Text */}
      <div className="mt-2 text-sm text-gray-500">
        <strong>How to use:</strong> Press Enter for line breaks. Select text
        and click B for <strong>bold</strong> or U for <u>underline</u>.
      </div>
    </div>
  );
}
