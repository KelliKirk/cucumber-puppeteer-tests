const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SYSTEM_BROWSER_PATHS = [
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/snap/bin/chromium',
];

function isSnapStub(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('requires the chromium snap');
  } catch (_) {
    return false;
  }
}

function isCompleteChromeInstall(chromeDir) {
  const requiredFiles = ['chrome', 'v8_context_snapshot.bin', 'icudtl.dat'];
  return requiredFiles.every((file) => fs.existsSync(path.join(chromeDir, file)));
}

function isUsableBrowser(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return false;
  }

  if (isSnapStub(filePath)) {
    return false;
  }

  const chromeDir = path.dirname(filePath);
  if (filePath.endsWith('/chrome') && !isCompleteChromeInstall(chromeDir)) {
    return false;
  }

  return true;
}

async function resolveExecutablePath() {
  try {
    const bundled = await puppeteer.executablePath();
    if (isUsableBrowser(bundled)) {
      return bundled;
    }
  } catch (_) {
    // Bundled Chrome not installed yet.
  }

  return SYSTEM_BROWSER_PATHS.find(isUsableBrowser);
}

async function launchBrowser() {
  const executablePath = await resolveExecutablePath();

  if (!executablePath) {
    throw new Error(
      'Chrome install is missing or corrupted. Free ~500MB disk space, then run:\n' +
      '  rm -rf ~/.cache/puppeteer\n' +
      '  npm run install:browsers'
    );
  }

  return puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });
}

module.exports = { launchBrowser };
