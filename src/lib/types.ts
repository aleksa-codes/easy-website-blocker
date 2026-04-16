export interface SiteRule {
  domain: string
  exceptions: string[]
  addedAt: number
}

export interface AppSettings {
  isBlockingEnabled: boolean
  showSitesInPopup: boolean
  showBlockingToggleInPopup: boolean
}
