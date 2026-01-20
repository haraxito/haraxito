#!/usr/bin/env node

/**
 * Google Indexing API CLI Script
 *
 * Usage:
 *   npm run index:google              - Submit all URLs from urls.txt
 *   npm run index:google -- --url URL - Submit a single URL
 *   npm run index:google -- --delete  - Request URL removal
 *
 * Prerequisites:
 *   1. Create a Google Cloud project
 *   2. Enable "Web Search Indexing API"
 *   3. Create a Service Account and download JSON key
 *   4. Add Service Account email to Google Search Console as Owner
 *   5. Place service-account.json in project root
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configuration
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account.json');
const URLS_FILE = path.join(__dirname, 'urls.txt');
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) { log(`✓ ${message}`, 'green'); }
function logError(message) { log(`✗ ${message}`, 'red'); }
function logInfo(message) { log(`ℹ ${message}`, 'blue'); }
function logWarning(message) { log(`⚠ ${message}`, 'yellow'); }

/**
 * Load and authenticate with Google Service Account
 */
async function getAuthClient() {
  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    logError('service-account.json not found!');
    logInfo('Please download your Service Account JSON from Google Cloud Console');
    logInfo('and place it in the project root as "service-account.json"');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });

  return auth.getClient();
}

/**
 * Submit a URL to Google Indexing API
 */
async function submitUrl(authClient, url, type = 'URL_UPDATED') {
  try {
    const response = await authClient.request({
      url: INDEXING_API_ENDPOINT,
      method: 'POST',
      data: {
        url: url,
        type: type // URL_UPDATED or URL_DELETED
      }
    });

    return {
      success: true,
      url,
      type,
      notifyTime: response.data.urlNotificationMetadata?.latestUpdate?.notifyTime
    };
  } catch (error) {
    return {
      success: false,
      url,
      type,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

/**
 * Load URLs from urls.txt file
 */
function loadUrls() {
  if (!fs.existsSync(URLS_FILE)) {
    logWarning('urls.txt not found. Creating template file...');
    fs.writeFileSync(URLS_FILE, '# Add your URLs here (one per line)\n# Example:\n# https://your-domain.com/\n# https://your-domain.com/page\n');
    logInfo('Please edit urls.txt and add your URLs');
    process.exit(0);
  }

  const content = fs.readFileSync(URLS_FILE, 'utf8');
  const urls = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  return urls;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: null,
    delete: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      options.url = args[i + 1];
      i++;
    } else if (args[i] === '--delete' || args[i] === '-d') {
      options.delete = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }

  return options;
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
${colors.cyan}Google Indexing CLI${colors.reset}

${colors.yellow}Usage:${colors.reset}
  npm run index:google                    Submit all URLs from urls.txt
  npm run index:google -- --url <URL>     Submit a single URL
  npm run index:google -- --delete        Mark URLs as deleted
  npm run index:google -- --help          Show this help

${colors.yellow}Options:${colors.reset}
  --url <URL>    Submit a specific URL instead of urls.txt
  --delete, -d   Request URL removal instead of update
  --help, -h     Show this help message

${colors.yellow}Setup:${colors.reset}
  1. Go to Google Cloud Console
  2. Enable "Web Search Indexing API"
  3. Create a Service Account
  4. Download JSON key as "service-account.json"
  5. Add Service Account email to Google Search Console (Owner)
  6. Add your URLs to urls.txt

${colors.yellow}Quota:${colors.reset}
  - 200 requests per day (default)
  - 600 requests per minute
`);
}

/**
 * Main function
 */
async function main() {
  console.log(`\n${colors.cyan}━━━ Google Indexing CLI ━━━${colors.reset}\n`);

  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  // Get authenticated client
  logInfo('Authenticating with Google...');
  const authClient = await getAuthClient();
  logSuccess('Authentication successful');

  // Determine URLs to submit
  let urls = [];
  if (options.url) {
    urls = [options.url];
  } else {
    urls = loadUrls();
  }

  if (urls.length === 0) {
    logWarning('No URLs to submit. Add URLs to urls.txt');
    return;
  }

  const type = options.delete ? 'URL_DELETED' : 'URL_UPDATED';
  const action = options.delete ? 'deletion' : 'indexing';

  logInfo(`Submitting ${urls.length} URL(s) for ${action}...\n`);

  // Submit each URL
  let successCount = 0;
  let errorCount = 0;

  for (const url of urls) {
    const result = await submitUrl(authClient, url, type);

    if (result.success) {
      logSuccess(`${url}`);
      if (result.notifyTime) {
        log(`  Notify time: ${result.notifyTime}`, 'cyan');
      }
      successCount++;
    } else {
      logError(`${url}`);
      log(`  Error: ${result.error}`, 'red');
      errorCount++;
    }

    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log(`\n${colors.cyan}━━━ Summary ━━━${colors.reset}`);
  logInfo(`Total: ${urls.length} URLs`);
  if (successCount > 0) logSuccess(`Success: ${successCount}`);
  if (errorCount > 0) logError(`Failed: ${errorCount}`);
  console.log('');
}

// Run
main().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
