const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runLighthouse() {
  console.log('🚀 Launching Chrome...');
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  console.log('📊 Running Lighthouse audit on http://localhost:3000...');
  const options = {
    logLevel: 'error',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);

  // Save the report
  const reportHtml = runnerResult.report;
  fs.writeFileSync('lighthouse-report.html', reportHtml);

  // Print scores
  console.log('\n=== LIGHTHOUSE AUDIT RESULTS ===\n');
  const scores = runnerResult.lhr.categories;
  
  Object.keys(scores).forEach(category => {
    const score = Math.round(scores[category].score * 100);
    const emoji = score >= 90 ? '✅' : score >= 50 ? '⚠️' : '❌';
    console.log(`${emoji} ${scores[category].title}: ${score}/100`);
  });

  console.log('\n📊 Full report saved to: lighthouse-report.html\n');

  await chrome.kill();
}

runLighthouse().catch(console.error);
