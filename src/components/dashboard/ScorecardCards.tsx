import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

interface ScorecardCardsProps {
  data: Record<string, any>[]
}

function isCurrencyField(key: string): boolean {
  const k = key.toLowerCase()
  return k.includes('receita') || k.includes('valor') || k.includes('preco') || k.includes('ticket')
}

function isPercentField(key: string): boolean {
  const k = key.toLowerCase()
  return k.includes('taxa') || k.includes('rate') || k.includes('pct') || k.includes('percent')
}

function formatFieldValue(key: string, value: any): string {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  if (isCurrencyField(key)) return formatCurrency(value)
  if (isPercentField(key)) return formatPercent(value)
  if (typeof value === 'number') return formatNumber(value)
  return String(value)
}

function prettyLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function ScorecardCards({ data }: ScorecardCardsProps) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500">Sem dados disponíveis</p>
  }

  const row = data[0]
  const entries = Object.entries(row).filter(([, v]) => v !== null && v !== undefined && v !== '')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {entries.map(([key, value], idx) => (
        <Card
          key={key}
          className="shadow-subtle border-slate-200 animate-fade-in-up"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-500 mb-1">{prettyLabel(key)}</p>
            <p className="text-2xl font-bold tracking-tight text-slate-800">
              {formatFieldValue(key, value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
