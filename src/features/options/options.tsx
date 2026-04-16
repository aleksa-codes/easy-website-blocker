import {
  AlertCircle,
  ChevronRight,
  FileText,
  Globe,
  LayoutGrid,
  MousePointerClick,
  ShieldBan,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"

import { AddExceptionForm } from "@/components/add-exception-form"
import { AddSiteForm } from "@/components/add-site-form"
import { ExceptionList } from "@/components/exception-list"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  addDomain,
  addException,
  getRules,
  getSettings,
  removeDomain,
  removeException,
  saveSettings,
} from "@/lib/storage"
import { SiteRule } from "@/lib/types"
import { cn } from "@/lib/utils"

type TabState = "blocklist" | "settings"

export function Options() {
  const [activeTab, setActiveTab] = useState<TabState>("blocklist")
  const [sites, setSites] = useState<SiteRule[]>([])
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [showSitesInPopup, setShowSitesInPopup] = useState(false)
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(true)
  const [showBlockingToggleInPopup, setShowBlockingToggleInPopup] =
    useState(false)

  const loadSites = async () => {
    const blocklist = await getRules()
    setSites(blocklist)
  }

  const loadSettings = async () => {
    const settings = await getSettings()
    setShowSitesInPopup(settings.showSitesInPopup)
    setIsBlockingEnabled(settings.isBlockingEnabled)
    setShowBlockingToggleInPopup(settings.showBlockingToggleInPopup)
  }

  useEffect(() => {
    void loadSites()
    void loadSettings()
  }, [])

  const handleAddSite = async (domain: string) => {
    const added = await addDomain(domain)
    if (added) {
      await loadSites()
      setSelectedSite(domain)
    }
    return added
  }

  const handleRemoveSite = async (domain: string) => {
    await removeDomain(domain)
    setSelectedSite((current) => (current === domain ? null : current))
    await loadSites()
  }

  const handleAddException = async (path: string) => {
    if (!selectedSite) return false
    const added = await addException(selectedSite, path)
    if (added) {
      await loadSites()
    }
    return added
  }

  const handleRemoveException = async (path: string) => {
    if (!selectedSite) return
    await removeException(selectedSite, path)
    await loadSites()
  }

  const handleToggleShowSites = async (checked: boolean) => {
    setShowSitesInPopup(checked)
    await saveSettings({ showSitesInPopup: checked })
  }

  const handleToggleBlocking = async (checked: boolean) => {
    setIsBlockingEnabled(checked)
    await saveSettings({ isBlockingEnabled: checked })
  }

  const handleToggleBlockingInPopup = async (checked: boolean) => {
    setShowBlockingToggleInPopup(checked)
    await saveSettings({ showBlockingToggleInPopup: checked })
  }

  const selectedSiteData = sites.find((site) => site.domain === selectedSite)

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Premium Header */}
      <header className="z-30 shrink-0 border-b bg-background/85 backdrop-blur-md">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
          {/* Logo & Title */}
          <div className="flex flex-1 items-center justify-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ShieldBan className="h-5 w-5" />
            </div>
            <h1 className="hidden text-base font-semibold tracking-tight sm:block">
              Easy Website Blocker
            </h1>
          </div>

          {/* Central Navigation Tabs */}
          <nav className="flex flex-1 justify-center">
            <div className="flex items-center rounded-full border bg-muted/40 p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("blocklist")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  activeTab === "blocklist"
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Focus Rules</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  activeTab === "settings"
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </button>
            </div>
          </nav>

          {/* Master Toggle */}
          <div className="flex flex-1 items-center justify-end">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                isBlockingEnabled
                  ? "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <ShieldCheck
                className={cn(
                  "h-4 w-4",
                  isBlockingEnabled ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="hidden lg:inline">
                {isBlockingEnabled ? "Blocking Active" : "Blocking Paused"}
              </span>
              <Switch
                className="ml-1 scale-75 shadow-none"
                checked={isBlockingEnabled}
                onCheckedChange={handleToggleBlocking}
              />
            </label>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden bg-muted/20">
        {activeTab === "blocklist" && (
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left Sidebar: Sites Master List */}
            <div className="flex flex-col border-b bg-muted/10 md:w-[320px] md:border-r md:border-b-0 lg:w-95">
              <div className="border-b bg-background p-4 sm:p-5">
                <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">
                  Add Website
                </h2>
                <AddSiteForm onAdd={handleAddSite} />
              </div>
              <ScrollArea className="flex-1 bg-background/50">
                <div className="p-4">
                  <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Blocked Sites ({sites.length})
                  </h2>
                  <div className="space-y-1.5">
                    {sites.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                        <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">
                          No sites added yet.
                        </p>
                      </div>
                    ) : (
                      sites.map((site) => (
                        <button
                          key={site.domain}
                          onClick={() => setSelectedSite(site.domain)}
                          className={cn(
                            "group flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition-all",
                            selectedSite === site.domain
                              ? "border-primary bg-primary/5 text-foreground shadow-sm ring-1 ring-primary/20"
                              : "border-transparent bg-transparent text-foreground hover:bg-black/5 hover:dark:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
                                selectedSite === site.domain
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground group-hover:text-foreground"
                              )}
                            >
                              <Globe className="h-4 w-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="truncate text-sm font-medium">
                                {site.domain}
                              </p>
                              <p
                                className={cn(
                                  "truncate text-xs",
                                  selectedSite === site.domain
                                    ? "text-primary/80"
                                    : "text-muted-foreground"
                                )}
                              >
                                {site.exceptions.length === 0
                                  ? "All pages blocked"
                                  : `${site.exceptions.length} allowed path${site.exceptions.length !== 1 ? "s" : ""}`}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 shrink-0 transition-opacity",
                              selectedSite === site.domain
                                ? "text-primary opacity-100"
                                : "opacity-0 group-hover:opacity-40"
                            )}
                          />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Right Pane: Site Details & Exceptions */}
            <div className="flex flex-1 flex-col bg-background">
              {selectedSite ? (
                <div className="flex h-full flex-col">
                  {/* Detail Header */}
                  <div className="flex items-center justify-between border-b px-6 py-8 sm:px-10 sm:py-10">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {selectedSite}
                      </h2>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        Configure paths on this domain that bypass the blocker
                        restrictions.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-destructive/20 text-destructive hover:border-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleRemoveSite(selectedSite)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Domain
                    </Button>
                  </div>

                  {/* Exceptions Content */}
                  <div className="flex-1 overflow-auto bg-muted/20 px-6 py-8 sm:px-10">
                    <div className="mx-auto max-w-2xl space-y-8">
                      <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4">
                          <h3 className="text-base font-semibold">
                            Add Allowed Path
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Specify partial URLs to keep accessible (e.g.
                            "messages" or "app/settings").
                          </p>
                        </div>
                        <AddExceptionForm onAdd={handleAddException} />
                      </div>

                      <div>
                        <h3 className="mb-4 text-base font-semibold">
                          Active Exceptions
                        </h3>
                        {selectedSiteData?.exceptions.length === 0 ||
                        !selectedSiteData ? (
                          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 py-16 text-center">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-foreground">
                              No exceptions added
                            </p>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                              This entire domain is currently blocked. Add a
                              path above to allow specific pages.
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <ExceptionList
                              exceptions={selectedSiteData.exceptions}
                              onRemove={handleRemoveException}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/60 ring-8 ring-muted/20">
                    <MousePointerClick className="h-10 w-10 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    Select a website
                  </h3>
                  <p className="mt-2 max-w-75 text-sm leading-relaxed text-muted-foreground">
                    Choose a website from the sidebar to manage its allowed
                    exceptions, or add a new domain to your blocklist.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preferences / Settings Tab */}
        {activeTab === "settings" && (
          <div className="w-full flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl animate-in px-6 py-12 duration-300 fade-in slide-in-from-bottom-4">
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                Preferences
              </h2>
              <p className="mb-8 text-muted-foreground">
                Customize your extension interface and behavior.
              </p>

              <div className="space-y-6">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="bg-muted/10 pb-4">
                    <CardTitle className="text-base">
                      Popup Menu Interface
                    </CardTitle>
                    <CardDescription>
                      Configure what appears when you click the extension icon
                      in your browser toolbar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="divide-y p-0">
                    <div className="flex justify-between p-6">
                      <div className="mr-4 space-y-1">
                        <label className="text-sm leading-none font-medium text-foreground">
                          Show blocked websites list
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Display your list of blocked domains directly inside
                          the popup menu.
                        </p>
                      </div>
                      <Switch
                        checked={showSitesInPopup}
                        onCheckedChange={handleToggleShowSites}
                      />
                    </div>

                    <div className="flex justify-between p-6">
                      <div className="mr-4 space-y-1">
                        <label className="text-sm leading-none font-medium text-foreground">
                          Show quick blocking toggle
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Embed a master switch to instantly pause or resume
                          blocking globally without opening these settings.
                        </p>
                      </div>
                      <Switch
                        checked={showBlockingToggleInPopup}
                        onCheckedChange={handleToggleBlockingInPopup}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="pt-12 text-center">
                  <a
                    href="https://github.com/aleksa-codes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/70 transition-colors hover:text-primary"
                  >
                    <Globe className="h-3 w-3" />
                    Created by aleksa.codes
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
