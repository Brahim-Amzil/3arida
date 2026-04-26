#!/bin/bash

echo "🔄 Adding lazy loading to all <img> tags..."

# Add loading="lazy" to img tags that don't have it
find src -name "*.tsx" -o -name "*.jsx" | while read file; do
  if grep -q "<img" "$file" 2>/dev/null; then
    # Check if file has img tags without loading attribute
    if grep "<img" "$file" | grep -v 'loading=' > /dev/null 2>&1; then
      echo "📝 Processing: $file"
      
      # Add loading="lazy" to img tags that don't have it
      sed -i.lazybak 's/<img\([^>]*\)>/<img\1 loading="lazy">/g' "$file"
      
      # Clean up if file has loading="lazy" loading="lazy" (double)
      sed -i.lazybak2 's/loading="lazy" loading="lazy"/loading="lazy"/g' "$file"
      
      echo "   ✅ Added lazy loading"
    fi
  fi
done

echo ""
echo "✅ Lazy loading added to all images!"
echo ""
echo "Files modified:"
find src -name "*.lazybak" | sed 's/.lazybak$//' | sort | uniq
