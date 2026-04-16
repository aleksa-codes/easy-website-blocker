import { Settings, ShieldAlert, ShieldBan, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

import { AddSiteForm } from "@/components/add-site-form"
import { SiteRuleList } from "@/components/blocked-site-list"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  addDomain,
  getRules,
  getSettings,
  removeDomain,
  saveSettings,
} from "@/lib/storage"
import { SiteRule } from "@/lib/types"
import { normalizeDomain } from "@/lib/url"
import { cn } from "@/lib/utils"

export function Popup() {
  const [sites, setSites] = useState<SiteRule[]>([])
  const [currentDomain, setCurrentDomain] = useState("")
  const [showSites, setShowSites] = useState(false)
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(true)
  const [showBlockingToggle, setShowBlockingToggle] = useState(false)

  const loadSites = async () => {
    const blocklist = await getRules()
    setSites(blocklist)
  }

  const loadSettings = async () => {
    const settings = await getSettings()
    setShowSites(settings.showSitesInPopup)
    setIsBlockingEnabled(settings.isBlockingEnabled)
    setShowBlockingToggle(settings.showBlockingToggleInPopup)
  }

  const getCurrentTab = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const currentTabUrl = tabs[0]?.url
    if (!currentTabUrl) return

    try {
      const url = new URL(currentTabUrl)
      setCurrentDomain(normalizeDomain(url.hostname))
    } catch {
      setCurrentDomain("")
    }
  }

  useEffect(() => {
    void loadSites()
    void loadSettings()
    void getCurrentTab()
  }, [])

  const handleAddSite = async (domain: string) => {
    const added = await addDomain(domain)
    if (added) {
      await loadSites()
    }
    return added
  }

  const handleRemoveSite = async (domain: string) => {
    await removeDomain(domain)
    await loadSites()
  }

  const handleToggleBlocking = async (checked: boolean) => {
    setIsBlockingEnabled(checked)
    await saveSettings({ isBlockingEnabled: checked })
  }

  const openOptionsPage = async () => {
    if (chrome.runtime.openOptionsPage) {
      await chrome.runtime.openOptionsPage()
      return
    }
    window.open("options.html", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex w-85 flex-col bg-background text-foreground antialiased shadow-xl">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/85 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ShieldBan className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Easy Website Blocker
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => {
            void openOptionsPage()
          }}
        >
          <Settings className="h-4.5 w-4.5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/20 px-4 pt-4 pb-2">
        <div className="space-y-4">
          {/* Master Toggle Area */}
          {showBlockingToggle && (
            <div
              className={cn(
                "flex items-center justify-between rounded-xl border p-3.5 shadow-sm transition-all",
                isBlockingEnabled
                  ? "border-primary/20 bg-primary/5 ring-1 ring-primary/10"
                  : "border-border bg-card"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    isBlockingEnabled
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm leading-none font-medium text-foreground">
                    {isBlockingEnabled ? "Blocking Active" : "Blocking Paused"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Global switch
                  </p>
                </div>
              </div>
              <Switch
                className="scale-90 shadow-none"
                checked={isBlockingEnabled}
                onCheckedChange={handleToggleBlocking}
              />
            </div>
          )}

          {/* Quick Add Domain Card */}
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Block a Website
            </h3>
            <AddSiteForm onAdd={handleAddSite} initialDomain={currentDomain} />
          </div>

          {/* Conditional Stats or List */}
          {showSites ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Blocked ({sites.length})
                </h3>
              </div>
              <SiteRuleList sites={sites} onRemove={handleRemoveSite} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30 py-8 text-center">
              <div
                className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background ring-4 ring-muted/50",
                  isBlockingEnabled
                    ? "text-primary"
                    : "text-muted-foreground/50"
                )}
              >
                <ShieldAlert className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {sites.length} site{sites.length !== 1 ? "s" : ""} blocked
              </p>
              <p className="mt-1 max-w-50 text-xs text-muted-foreground">
                {isBlockingEnabled
                  ? "Silently protecting your focus."
                  : "Protection is currently disabled."}
              </p>
            </div>
          )}
        </div>

        {/* Subtle, integrated footer text */}
        <div className="mt-5 mb-2 text-center text-[10px] font-medium text-muted-foreground/40">
          <a
            href="https://github.com/aleksa-codes"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Created by aleksa.codes
          </a>
        </div>
      </main>
    </div>
  )
}
