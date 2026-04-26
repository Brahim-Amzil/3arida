import re
import os
import glob

def add_lazy_loading(content):
    """Add loading='lazy' to img tags that don't have it"""
    # Pattern to match <img tags that don't have loading attribute
    pattern = r'<img\s+(?![^>]*loading=)([^>]*)>'
    
    def replace_img(match):
        attrs = match.group(1).strip()
        if attrs:
            return f'<img {attrs} loading="lazy">'
        return '<img loading="lazy">'
    
    return re.sub(pattern, replace_img, content)

# Find all TSX and JSX files
files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.jsx', recursive=True)

modified_count = 0

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '<img' in content and 'loading=' not in content:
            new_content = add_lazy_loading(content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'✅ {filepath}')
                modified_count += 1
    except Exception as e:
        print(f'❌ Error processing {filepath}: {e}')

print(f'\n✅ Modified {modified_count} files')
