import { AppSettings, SiteRule } from "./types"

export const DEFAULT_SETTINGS: AppSettings = {
  isBlockingEnabled: true,
  showSitesInPopup: false,
  showBlockingToggleInPopup: false,
}

export async function getRules(): Promise<SiteRule[]> {
  const data = await chrome.storage.local.get({ rules: [] })
  return (data.rules as SiteRule[]) || []
}

export async function saveRules(rules: SiteRule[]): Promise<void> {
  await chrome.storage.local.set({ rules })
}

export async function getSettings(): Promise<AppSettings> {
  const data = await chrome.storage.sync.get({ settings: DEFAULT_SETTINGS })
  return (data.settings as AppSettings) || DEFAULT_SETTINGS
}

export async function saveSettings(
  settings: Partial<AppSettings>
): Promise<void> {
  const existing = await getSettings()
  await chrome.storage.sync.set({ settings: { ...existing, ...settings } })
}

// Wrapper helpers for the UI
export async function addDomain(domain: string): Promise<boolean> {
  const rules = await getRules()
  if (rules.some((r) => r.domain === domain)) return false
  rules.unshift({ domain, exceptions: [], addedAt: Date.now() })
  await saveRules(rules)
  return true
}

export async function removeDomain(domain: string): Promise<void> {
  const rules = await getRules()
  await saveRules(rules.filter((r) => r.domain !== domain))
}

export async function addException(
  domain: string,
  exception: string
): Promise<boolean> {
  const rules = await getRules()
  const rule = rules.find((r) => r.domain === domain)
  if (!rule || rule.exceptions.includes(exception)) return false
  rule.exceptions.push(exception)
  await saveRules(rules)
  return true
}

export async function removeException(
  domain: string,
  exception: string
): Promise<void> {
  const rules = await getRules()
  const rule = rules.find((r) => r.domain === domain)
  if (!rule) return
  rule.exceptions = rule.exceptions.filter((e) => e !== exception)
  await saveRules(rules)
}
