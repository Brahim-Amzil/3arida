const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with getServerSideProps
const files = execSync('find pages -name "*.tsx" -exec grep -l "getServerSideProps" {} +', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file.length > 0);

console.log(`Found ${files.length} files with getServerSideProps:`);
files.forEach(file => console.log(`  - ${file}`));

files.forEach(file => {
  console.log(`\nProcessing ${file}...`);
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove getServerSideProps-related imports
  content = content.replace(/import\s+type\s*{[^}]*GetServerSidePropsContext[^}]*}\s+from\s+['"]next['"]/g, '');
  content = content.replace(/import\s+type\s*{[^}]*InferGetServerSidePropsType[^}]*}\s+from\s+['"]next['"]/g, '');
  content = content.replace(/import\s+{[^}]*GetServerSidePropsContext[^}]*}\s+from\s+['"]next['"]/g, '');
  content = content.replace(/import\s+{[^}]*InferGetServerSidePropsType[^}]*}\s+from\s+['"]next['"]/g, '');
  content = content.replace(/,\s*GetServerSidePropsContext/g, '');
  content = content.replace(/GetServerSidePropsContext\s*,/g, '');
  content = content.replace(/,\s*InferGetServerSidePropsType/g, '');
  content = content.replace(/InferGetServerSidePropsType\s*,/g, '');
  content = content.replace(/,\s*getServerSideProps/g, '');
  content = content.replace(/getServerSideProps\s*,/g, '');
  content = content.replace(/import\s+{\s*}\s+from\s+['"][^'"]+['"]/g, '');
  content = content.replace(/import\s+type\s*{\s*}\s+from\s+['"][^'"]+['"]/g, '');
  
  // Remove component type annotations that reference getServerSideProps
  content = content.replace(/const\s+(\w+):\s*NextPageWithLayout<[^>]*InferGetServerSidePropsType<typeof\s+getServerSideProps>[^>]*>\s*=\s*\(\s*{[^}]*}\s*\)\s*=>/g, 'const $1: NextPageWithLayout = () =>');
  
  // Remove the entire getServerSideProps function
  content = content.replace(/export\s+async\s+function\s+getServerSideProps[\s\S]*?^}/gm, '');
  content = content.replace(/export\s+const\s+getServerSideProps[\s\S]*?;/g, '');
  
  // Remove serverSideTranslations import if it exists
  content = content.replace(/import\s+{[^}]*serverSideTranslations[^}]*}\s+from\s+['"]next-i18next\/serverSideTranslations['"]/g, '');
  content = content.replace(/,\s*serverSideTranslations/g, '');
  content = content.replace(/serverSideTranslations\s*,/g, '');
  
  // Remove any remaining return statements from getServerSideProps
  content = content.replace(/return\s*{\s*props:\s*{[\s\S]*?}\s*}\s*;/g, '');
  
  // Clean up empty lines and semicolons
  content = content.replace(/\n\s*;\s*\n/g, '\n');
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(file, content);
  console.log(`  ✓ Processed ${file}`);
});

console.log('\n✅ All files processed successfully!');
console.log('\nNote: You may need to manually review some files for any remaining issues.');