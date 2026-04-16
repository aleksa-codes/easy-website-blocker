import { ShieldBan } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Blocked() {
  const [blockedDomain, setBlockedDomain] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setBlockedDomain(params.get("url") ?? "")
  }, [])

  const closePage = () => {
    window.close()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <ShieldBan className="h-12 w-12 text-primary" />
          </div>
          <div>
            <CardTitle className="text-center text-2xl">
              Website Blocked
            </CardTitle>
            <CardDescription className="mt-2 text-center text-base">
              This website is blocked by Easy Website Blocker.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-center text-sm break-all text-muted-foreground">
                Blocked website:
                <span className="mt-1 block font-medium text-foreground">
                  {blockedDomain}
                </span>
              </p>
            </div>
            <div className="flex justify-center">
              <Button variant="default" size="lg" onClick={closePage}>
                Close Tab
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
