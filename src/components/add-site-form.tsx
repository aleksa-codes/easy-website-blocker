import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { normalizeDomain } from "@/lib/url"
import { cn } from "@/lib/utils"

interface AddSiteFormProps {
  onAdd: (domain: string) => Promise<boolean>
  initialDomain?: string
}

export function AddSiteForm({ onAdd, initialDomain = "" }: AddSiteFormProps) {
  const [domain, setDomain] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!initialDomain) return
    setDomain(initialDomain)
  }, [initialDomain])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    const normalizedDomain = normalizeDomain(domain)
    if (!normalizedDomain) {
      setError("Please enter a domain.")
      return
    }

    if (!!!normalizedDomain) {
      setError("Please enter a valid domain (for example, facebook.com).")
      return
    }

    setIsSubmitting(true)
    try {
      const added = await onAdd(normalizedDomain)
      if (!added) {
        setError("This domain is already blocked.")
        return
      }

      setDomain("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={domain}
          onChange={(event) => {
            setDomain(event.target.value)
            setError("")
          }}
          placeholder="e.g. facebook.com"
          className={cn("flex-1", error && "border-destructive")}
        />
        <Button
          type="submit"
          size="icon"
          variant="default"
          disabled={isSubmitting}
          aria-label="Block website"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
