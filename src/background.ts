import { getBlocklist } from '@/utils/storage';
import { generateRules, updateBlockingRules, normalizeDomain } from '@/utils/rules';

// Helper function to check if URL should be blocked
async function shouldBlockUrl(url: string): Promise<boolean> {
  try {
    const blocklist = await getBlocklist();
    const urlObj = new URL(url);
    const normalizedHostname = normalizeDomain(urlObj.hostname);

    const site = blocklist.sites.find((site) => normalizeDomain(site.domain) === normalizedHostname);

    if (site) {
      const pathname = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
      return !site.exceptions.some((exception) => pathname.startsWith(exception));
    }
    return false;
  } catch (error) {
    console.error('Error in shouldBlockUrl:', error);
    return false;
  }
}

// Initialize rules when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const blocklist = await getBlocklist();
    const rules = generateRules(blocklist);
    await updateBlockingRules(rules);
  } catch (error) {
    console.error('Error initializing rules:', error);
  }
});

// Listen for storage changes to update rules
chrome.storage.onChanged.addListener(async (changes) => {
  if (changes.blocklist) {
    try {
      const rules = generateRules(changes.blocklist.newValue);
      await updateBlockingRules(rules);
    } catch (error) {
      console.error('Error updating rules:', error);
    }
  }
});

// Keep track of last navigation time to prevent duplicate checks
let lastNavigationTime = 0;
const NAVIGATION_THRESHOLD = 500; // ms

// Handle client-side navigation and transitions from exception pages
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  const now = Date.now();
  if (now - lastNavigationTime < NAVIGATION_THRESHOLD) {
    return;
  }
  lastNavigationTime = now;

  try {
    if (await shouldBlockUrl(details.url)) {
      const urlObj = new URL(details.url);
      chrome.tabs.update(details.tabId, {
        url: `${chrome.runtime.getURL('blocked.html')}?url=${encodeURIComponent(normalizeDomain(urlObj.hostname))}`,
      });
    }
  } catch (error) {
    console.error('Error in navigation listener:', error);
  }
});
