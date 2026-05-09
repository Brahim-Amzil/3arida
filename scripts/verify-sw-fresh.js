#!/usr/bin/env node

const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const buildIdPath = path.join(projectRoot, '.next', 'BUILD_ID');
const swPath = path.join(projectRoot, 'public', 'sw.js');

function fail(message) {
  console.error(`PWA freshness check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(buildIdPath)) {
  fail('Missing `.next/BUILD_ID`. Run `next build` before verifying service worker freshness.');
}

if (!existsSync(swPath)) {
  fail('Missing `public/sw.js`. Ensure `next-pwa` is enabled and build completed.');
}

const buildId = readFileSync(buildIdPath, 'utf8').trim();
if (!buildId) {
  fail('Build ID is empty.');
}

const swContent = readFileSync(swPath, 'utf8');
if (!swContent.includes(`/_next/static/${buildId}/`)) {
  fail(
    `Service worker does not reference current build ID (${buildId}). Regenerate with a fresh build before release.`,
  );
}

console.log(`PWA freshness check passed for build ID: ${buildId}`);
