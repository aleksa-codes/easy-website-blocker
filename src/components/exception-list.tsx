import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ExceptionListProps {
  exceptions: string[]
  onRemove: (exception: string) => void
}

export function ExceptionList({ exceptions, onRemove }: ExceptionListProps) {
  if (exceptions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No exceptions added yet.</p>
    )
  }

  return (
    <ul className="space-y-2">
      {exceptions.map((exception, index) => (
        <li key={exception} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="max-w-[85%] truncate text-sm">
              /{exception}
            </Badge>
            <Button
              onClick={() => onRemove(exception)}
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:bg-destructive hover:text-white"
              aria-label={`Remove ${exception}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {index < exceptions.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  )
}
