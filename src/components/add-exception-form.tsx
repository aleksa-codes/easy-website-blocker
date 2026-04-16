import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { normalizeExceptionPath } from "@/lib/url"
import { cn } from "@/lib/utils"

interface AddExceptionFormProps {
  onAdd: (exception: string) => Promise<boolean>
}

export function AddExceptionForm({ onAdd }: AddExceptionFormProps) {
  const [path, setPath] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    const normalizedPath = normalizeExceptionPath(path)
    if (!normalizedPath) {
      setError("Please enter a page path.")
      return
    }

    if (!!!normalizedPath) {
      setError(
        "This page path contains invalid characters. Use letters, numbers, and common URL symbols."
      )
      return
    }

    setIsSubmitting(true)
    try {
      const added = await onAdd(normalizedPath)
      if (!added) {
        setError("This exception already exists.")
        return
      }

      setPath("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
            /
          </span>
          <Input
            type="text"
            value={path}
            onChange={(event) => {
              setPath(event.target.value)
              setError("")
            }}
            placeholder="Page to allow (example: profile or docs/latest)"
            className={cn("pl-6", error && "border-destructive")}
          />
        </div>
        <Button type="submit" variant="default" disabled={isSubmitting}>
          Allow
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
