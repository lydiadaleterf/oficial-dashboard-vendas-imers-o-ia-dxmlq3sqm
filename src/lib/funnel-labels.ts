export const FUNNEL_MAP: Record<string, string> = {
  Skip: 'Skip',
  'Lancamento Interno': 'Lançamento Interno',
}

export const FUNNEL_KEYS = Object.keys(FUNNEL_MAP)

export const FUNNEL_OPTIONS = [
  { label: 'Todos', value: 'all' },
  ...FUNNEL_KEYS.map((key) => ({ label: FUNNEL_MAP[key], value: key })),
]

export function getFunnelLabel(dbValue: string): string {
  return FUNNEL_MAP[dbValue] ?? dbValue
}

export const FUNNEL_LABELS = FUNNEL_MAP
