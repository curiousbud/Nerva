/**
 * Tool types
 *
 * Scripts are stored tool-first in the repo (scripts/<category>/<tool>/<language>),
 * so the generated scripts.json is already grouped: one entry per tool, each with
 * a `path` to the tool folder (which shows every language on GitHub) and a list
 * of language `variants`. The website renders these directly — no client-side
 * grouping needed.
 */

export interface ScriptVariant {
  language: string
  /** Path to this language's folder, e.g. scripts/security/port-scanner/python */
  path: string
}

export interface Tool {
  /** Folder name shared by every variant — unique per tool. */
  key: string
  title: string
  description: string
  category: string
  difficulty: string
  features: string[]
  featured: boolean
  /** Path to the tool folder (all languages live under it). */
  path: string
  /** Ordered by language priority; index 0 is the primary variant. */
  variants: ScriptVariant[]
}

/**
 * Return a tool's variants with `language` moved to the front, so a filtered
 * view can present the matching language as the primary (top) one.
 */
export function variantsWithPrimary(
  variants: ScriptVariant[],
  language?: string
): ScriptVariant[] {
  if (!language || language === 'all') return variants
  const match = variants.find((v) => v.language === language)
  if (!match) return variants
  return [match, ...variants.filter((v) => v !== match)]
}
