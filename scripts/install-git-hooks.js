#!/usr/bin/env node

const { copyFileSync, chmodSync, existsSync, mkdirSync } = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const sourceHook = path.join(projectRoot, '.githooks', 'pre-commit');
const targetDir = path.join(projectRoot, '.git', 'hooks');
const targetHook = path.join(targetDir, 'pre-commit');

if (!existsSync(sourceHook)) {
  console.error('Cannot install hooks: .githooks/pre-commit not found.');
  process.exit(1);
}

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

copyFileSync(sourceHook, targetHook);
chmodSync(targetHook, 0o755);

console.log('Installed git pre-commit hook -> .git/hooks/pre-commit');
