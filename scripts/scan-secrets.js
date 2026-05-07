#!/usr/bin/env node

const { execSync } = require('node:child_process');
const { existsSync, readFileSync, statSync } = require('node:fs');
const path = require('node:path');

const MAX_FILE_SIZE_BYTES = 1024 * 1024;

const SKIP_PATH_PARTS = new Set([
  'node_modules',
  '.next',
  'out',
  'dist',
  'build',
  '.git',
  'coverage',
]);

const SECRET_PATTERNS = [
  {
    name: 'Private key block',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    name: 'High-risk env assignment',
    regex:
      /(RESEND_API_KEY|SMTP_PASSWORD|FIREBASE_PRIVATE_KEY|WHATSAPP_ACCESS_TOKEN|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|PAYPAL_CLIENT_SECRET|RECAPTCHA_SECRET_KEY)\s*=\s*["']?([^"'\n\r]+)["']?/g,
  },
  {
    name: 'Resend API token',
    regex: /\bre_[A-Za-z0-9_]{24,}\b/g,
  },
  {
    name: 'Stripe secret token',
    regex: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g,
  },
  {
    name: 'Stripe webhook secret',
    regex: /\bwhsec_[A-Za-z0-9]{16,}\b/g,
  },
  {
    name: 'WhatsApp long-lived token',
    regex: /\bEAA[A-Za-z0-9]{40,}\b/g,
  },
];

const NON_SECRET_HINTS = [
  /your[-_ ]?/i,
  /xxxxx/i,
  /example/i,
  /placeholder/i,
  /dummy/i,
  /test[-_ ]?key/i,
  /<.*>/,
  /not_needed/i,
  /\.{3,}/,
  /^sk_live_\.\.\./i,
  /^sk_test_\.\.\./i,
];

/** Paths matching these prefixes are skipped for `--all` (legacy docs/scripts; still prefer redaction over time). */
function loadSecretScanIgnores() {
  const ignoreFile = path.join(process.cwd(), '.secret-scan-ignore');
  if (!existsSync(ignoreFile)) return [];
  return readFileSync(ignoreFile, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

function matchesSecretScanIgnore(normalizedPath, patterns) {
  for (const raw of patterns) {
    const pat = raw.split('#')[0].trim();
    if (!pat) continue;
    if (pat.endsWith('*')) {
      const prefix = pat.slice(0, -1);
      if (normalizedPath.startsWith(prefix)) return true;
      continue;
    }
    const base = pat.endsWith('/') ? pat.slice(0, -1) : pat;
    if (normalizedPath === base || normalizedPath.startsWith(`${base}/`)) return true;
  }
  return false;
}

function runGit(command) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return output.trim();
  } catch {
    return '';
  }
}

function getFilesFromArgs(argv) {
  if (argv.includes('--staged')) {
    const output = runGit('git diff --cached --name-only --diff-filter=ACMRTUXB');
    return output ? output.split('\n').filter(Boolean) : [];
  }

  if (argv.includes('--all')) {
    const output = runGit('git ls-files');
    return output ? output.split('\n').filter(Boolean) : [];
  }

  if (argv.includes('--stdin')) {
    const input = readFileSync(0, 'utf8').trim();
    return input ? input.split('\n').filter(Boolean) : [];
  }

  const filesArgIndex = argv.indexOf('--files');
  if (filesArgIndex !== -1 && argv[filesArgIndex + 1]) {
    return argv[filesArgIndex + 1].split(',').map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

let cachedIgnorePatterns = null;
function getSecretScanIgnores() {
  if (cachedIgnorePatterns === null) {
    cachedIgnorePatterns = loadSecretScanIgnores();
  }
  return cachedIgnorePatterns;
}

function shouldSkipFile(filePath, argv) {
  const normalized = filePath.split(path.sep).join('/');
  if (!normalized) return true;
  const parts = normalized.split('/');
  if (parts.some((part) => SKIP_PATH_PARTS.has(part))) return true;
  if (argv.includes('--all') && matchesSecretScanIgnore(normalized, getSecretScanIgnores())) {
    return true;
  }
  return false;
}

function isProbablyPlaceholder(value) {
  return NON_SECRET_HINTS.some((hint) => hint.test(value));
}

function findSecretsInContent(content, filePath) {
  const findings = [];

  for (const { name, regex } of SECRET_PATTERNS) {
    regex.lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const matchedValue = match[0];
      if (isProbablyPlaceholder(matchedValue)) continue;

      if (name === 'High-risk env assignment') {
        const assignedValue = (match[2] || '').trim();
        if (!assignedValue || isProbablyPlaceholder(assignedValue)) continue;
        // Source reads env (not embedding a secret literal)
        if (/^process\.env\./.test(assignedValue)) continue;
      }

      findings.push({
        filePath,
        type: name,
        snippet: matchedValue.slice(0, 80),
      });
    }
  }

  return findings;
}

function main() {
  const files = getFilesFromArgs(process.argv.slice(2));
  if (!files.length) {
    console.log('No files to scan for secrets.');
    return;
  }

  const findings = [];

  const argv = process.argv.slice(2);
  for (const file of files) {
    if (shouldSkipFile(file, argv)) continue;
    if (!existsSync(file)) continue;

    let stats;
    try {
      stats = statSync(file);
    } catch {
      continue;
    }

    if (!stats.isFile()) continue;
    if (stats.size > MAX_FILE_SIZE_BYTES) continue;

    let content = '';
    try {
      content = readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    findings.push(...findSecretsInContent(content, file));
  }

  if (!findings.length) {
    console.log('Secret scan passed.');
    return;
  }

  console.error('Secret scan failed. Potential secrets detected:');
  for (const finding of findings) {
    console.error(`- ${finding.filePath} | ${finding.type} | ${finding.snippet}`);
  }
  process.exit(1);
}

main();
