/**
 * Arabic Text Helper for PDF Generation
 * 
 * Provides utilities for rendering Arabic text in PDFs
 * Handles RTL text direction and basic Arabic text processing
 */

/**
 * Reverses text for RTL display in PDF
 * This is a simple approach that works for basic Arabic text
 */
export function prepareArabicText(text: string): string {
  if (!text) return '';
  
  // Check if text contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  
  if (!hasArabic) {
    return text; // Return as-is if no Arabic
  }
  
  // Simple reversal for RTL
  // Note: This is a basic solution. For complex Arabic text with diacritics,
  // a more sophisticated library would be needed
  return text.split('').reverse().join('');
}

/**
 * Splits Arabic text into lines that fit within a given width
 */
export function wrapArabicText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  // Approximate character width (adjust based on font)
  const charWidth = fontSize * 0.5;
  const maxChars = Math.floor(maxWidth / charWidth);
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxChars) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.map(line => prepareArabicText(line));
}

/**
 * Formats Arabic numbers (converts to Arabic-Indic numerals)
 */
export function formatArabicNumber(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => {
    const d = parseInt(digit);
    return isNaN(d) ? digit : arabicNumerals[d];
  }).join('');
}

/**
 * Checks if text contains Arabic characters
 */
export function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
