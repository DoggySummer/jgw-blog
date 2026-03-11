/**
 * 경로에 버킷 이름이 중복된 Spaces URL을 올바른 형식으로 고칩니다.
 * 예: .../frontend-blog/uploads/... → .../uploads/...
 */
export function fixSpacesImageUrl(src: unknown): string | undefined {
  if (typeof src !== "string" || !src) return undefined;
  try {
    const url = new URL(src);
    const host = url.hostname;
    const pathname = url.pathname;
    if (!host.includes("digitaloceanspaces.com") || !pathname.startsWith("/")) return src;
    const segments = pathname.slice(1).split("/").filter(Boolean);
    if (segments.length < 2) return src;
    const first = segments[0];
    const subdomain = host.split(".")[0];
    if (first === subdomain) {
      segments.shift();
      url.pathname = "/" + segments.join("/");
      return url.toString();
    }
  } catch {
    // ignore
  }
  return src;
}
