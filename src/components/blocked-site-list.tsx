import { formatDistanceToNow } from "date-fns"
import { Globe, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SiteRule } from "@/lib/types"

interface SiteRuleListProps {
  sites: SiteRule[]
  onRemove: (domain: string) => void
}

export function SiteRuleList({ sites, onRemove }: SiteRuleListProps) {
  if (sites.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No blocked sites yet.
      </p>
    )
  }

  return (
    <ScrollArea className="h-60 rounded-lg border border-border/60">
      <div className="space-y-1 p-2">
        {sites.map((site) => (
          <div
            key={site.domain}
            className="flex items-center justify-between rounded-md bg-card px-2 py-1.5 hover:bg-muted/60"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm leading-none font-medium">
                  {site.domain}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(site.addedAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <Button
              onClick={() => onRemove(site.domain)}
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:bg-destructive hover:text-white"
              aria-label={`Remove ${site.domain}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
