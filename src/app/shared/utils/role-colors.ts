const EXCLUDED = new Set(['slate', 'gray', 'zinc', 'neutral', 'stone', 'true-gray', 'primary', 'secondary']);

const FAMILY_RE = /--color-([a-z][a-z-]*)-500\s*:/g;

export function extractColorFamilies(cssText: string): string[] {
  const families = new Set<string>();
  for (const m of cssText.matchAll(FAMILY_RE)) {
    if (!EXCLUDED.has(m[1])) families.add(m[1]);
  }
  return [...families];
}

let cachedPool: string[] | null = null;

export function getIdentityColorPool(): string[] {
  if (cachedPool) return cachedPool;
  let css = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      css += Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
    } catch {
      // arkusz cross-origin (Google Fonts) — dostęp do cssRules rzuca SecurityError, pomijamy
    }
  }
  const pool = extractColorFamilies(css);
  if (pool.length > 0) cachedPool = pool;
  return pool;
}

export function pickIdentityColor(pool: string[], used: string[], rand: () => number = Math.random): string {
  if (pool.length === 0) return '';
  const usedSet = new Set(used);
  const free = pool.filter((f) => !usedSet.has(f));
  const candidates = free.length > 0 ? free : pool;
  return candidates[Math.floor(rand() * candidates.length)];
}
