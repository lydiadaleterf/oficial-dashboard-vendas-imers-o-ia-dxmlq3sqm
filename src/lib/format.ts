export function safeNumber(val: any): number | null {
  if (val === null || val === undefined || val === '') return null
  const num = Number(val)
  return isNaN(num) ? null : num
}

export function formatCurrency(val: any): string {
  const num = safeNumber(val)
  if (num === null) return '-'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatNumber(val: any): string {
  const num = safeNumber(val)
  if (num === null) return '-'
  return num.toLocaleString('pt-BR')
}

export function formatPercent(val: any, decimals = 1): string {
  const num = safeNumber(val)
  if (num === null) return '-'
  return `${num.toFixed(decimals)}%`
}

export function formatDays(val: any): string {
  const num = safeNumber(val)
  if (num === null) return '--'
  return `${Math.round(num)} dias`
}

export function formatDate(val: any): string {
  if (!val) return '-'
  try {
    const d = typeof val === 'string' ? val : new Date(val).toISOString()
    const [y, m, day] = d.substring(0, 10).split('-')
    return `${day}/${m}/${y}`
  } catch {
    return String(val)
  }
}
