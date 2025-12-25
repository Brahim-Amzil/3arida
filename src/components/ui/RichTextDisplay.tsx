'use client';

import React from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export default function RichTextDisplay({
  content,
  className = '',
}: RichTextDisplayProps) {
  // Convert markdown-style formatting to HTML
  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>
      .replace(/__(.*?)__/g, '<u>$1</u>') // Convert __text__ to <u>
      .replace(/\n/g, '<br>'); // Convert line breaks to <br>
  };

  return (
    <div
      className={`text-gray-700 leading-relaxed rich-text-content ${className}`}
      dangerouslySetInnerHTML={{
        __html: formatContent(content),
      }}
    />
  );
}
