import { getRules, getSettings } from "@/lib/storage"

// 1. Sync rules to Chrome's native Declarative Net Request (DNR) engine
async function syncRules() {
  const settings = await getSettings()
  const rules = await getRules()

  const dnrRules: chrome.declarativeNetRequest.Rule[] = []
  let ruleId = 1

  if (settings.isBlockingEnabled) {
    for (const rule of rules) {
      // Block the main domain
      dnrRules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: {
            extensionPath: `/blocked.html?url=${encodeURIComponent(rule.domain)}`,
          },
        },
        condition: {
          urlFilter: `||${rule.domain}`,
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        },
      })

      // Allow the exceptions
      for (const path of rule.exceptions) {
        const cleanPath = path.startsWith("/") ? path : `/${path}`
        dnrRules.push({
          id: ruleId++,
          priority: 2,
          action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
          condition: {
            urlFilter: `||${rule.domain}${cleanPath}`,
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
            ],
          },
        })
      }
    }
  }

  // Update dynamic rules atomically
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRules.map((r) => r.id),
    addRules: dnrRules,
  })
}

// 2. Client-side navigation fallback (SPA support like YouTube/React)
const tabTimestamps = new Map<number, number>()

async function handleSpaNavigation(url: string, tabId: number) {
  const now = Date.now()
  if (now - (tabTimestamps.get(tabId) || 0) < 500) return
  tabTimestamps.set(tabId, now)

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") return

  const settings = await getSettings()
  if (!settings.isBlockingEnabled) return

  const rules = await getRules()
  const hostname = parsedUrl.hostname.replace(/^www\./, "")

  // Find matching rule
  const matchedRule = rules.find((r) => r.domain === hostname)
  if (!matchedRule) return

  // Find if path is an exception
  const currentPath = parsedUrl.pathname + parsedUrl.search
  const isException = matchedRule.exceptions.some((ex) => {
    const cleanPath = ex.startsWith("/") ? ex : `/${ex}`
    return currentPath.startsWith(cleanPath)
  })

  // Redirect if it's blocked and NOT an exception
  if (!isException) {
    await chrome.tabs.update(tabId, {
      url: chrome.runtime.getURL(
        `/blocked.html?url=${encodeURIComponent(matchedRule.domain)}`
      ),
    })
  }
}

// 3. Set up Chrome event listeners
export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => void syncRules())
  chrome.runtime.onStartup.addListener(() => void syncRules())

  chrome.storage.onChanged.addListener(() => {
    // Anytime local/sync storage updates, rapidly re-apply our rules
    void syncRules()
  })

  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.frameId === 0) {
      // Only care about main frame top-level navs
      void handleSpaNavigation(details.url, details.tabId)
    }
  })

  chrome.tabs.onRemoved.addListener((tabId) => {
    tabTimestamps.delete(tabId) // Cleanup
  })
})
