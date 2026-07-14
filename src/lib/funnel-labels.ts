export const FUNNEL_LABELS: Record<string, string> = {
  Skip: 'Skip',
  'Lancamento Interno': 'Lançamento Interno',
}

export const FUNNEL_KEYS = Object.keys(FUNNEL_LABELS)

export const FUNNEL_OPTIONS = [
  { label: 'Todos', value: 'all' },
  ...FUNNEL_KEYS.map((key) => ({ label: FUNNEL_LABELS[key], value: key })),
]

export function getFunnelLabel(dbValue: string): string {
  return FUNNEL_LABELS[dbValue] ?? dbValue
}
