export function normalizeDomain(urlOrDomain: string): string {
  const raw = urlOrDomain.trim().toLowerCase()
  if (!raw) return ""

  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`)
    return url.hostname.replace(/^www\./, "").replace(/\.$/, "")
  } catch {
    return raw
      .replace(/^(https?:\/\/)?/i, "")
      .split(/[/?#]/)[0]
      .replace(/:\d+$/, "")
      .replace(/^www\./, "")
      .replace(/\.$/, "")
  }
}

export function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false
  return /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)
}

export function normalizeExceptionPath(input: string): string {
  return input
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/+/g, "/")
}

export function isValidExceptionPath(path: string): boolean {
  if (!path) return false
  if (path.includes("//")) return false
  if (path.endsWith(".")) return false
  return /^[@a-zA-Z0-9\-_.~+:,=%&/#]+$/.test(path)
}
