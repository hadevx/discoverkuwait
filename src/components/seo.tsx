import { useEffect, useRef } from "react"

interface SEOProps {
  title: string
  description: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
  ogType?: "website" | "article"
  jsonLd?: Record<string, unknown>
}

const BASE_URL = "https://discoverkuwait.org"
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
  if (!el) {
    el = document.createElement("link")
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function SEO({
  title,
  description,
  canonical,
  noindex = false,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
}: SEOProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    document.title = title

    upsertMeta("name", "description", description)
    upsertMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow")

    // Open Graph
    upsertMeta("property", "og:title", title)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:image", ogImage)
    upsertMeta("property", "og:type", ogType)
    upsertMeta("property", "og:url", canonical ?? `${BASE_URL}/`)

    // Twitter Card
    upsertMeta("name", "twitter:title", title)
    upsertMeta("name", "twitter:description", description)
    upsertMeta("name", "twitter:image", ogImage)

    if (canonical) upsertLink("canonical", canonical)
  }, [title, description, canonical, noindex, ogImage, ogType])

  // Per-page JSON-LD: inject on mount, clean up on unmount
  useEffect(() => {
    if (!jsonLd) return
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    scriptRef.current = script
    return () => {
      scriptRef.current?.remove()
      scriptRef.current = null
    }
  }, [jsonLd])

  return null
}
