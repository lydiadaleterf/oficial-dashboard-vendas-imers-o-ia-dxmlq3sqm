import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import type { LucideIcon } from 'lucide-react'

export interface ScorecardItem {
  label: string
  value: string
  icon: LucideIcon
  color: string
}

interface ScorecardCardsProps {
  data?: Record<string, any>[]
  items?: ScorecardItem[]
}

const colorMap: Record<string, string> = {
  emerald: 'border-t-emerald-500 bg-emerald-50/30',
  teal: 'border-t-teal-500 bg-teal-50/30',
  amber: 'border-t-amber-500 bg-amber-50/30',
  blue: 'border-t-blue-500 bg-blue-50/30',
  red: 'border-t-red-500 bg-red-50/30',
  slate: 'border-t-slate-500 bg-slate-50/30',
  purple: 'border-t-purple-500 bg-purple-50/30',
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

export function ScorecardCards({ data, items }: ScorecardCardsProps) {
  if (items && items.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon
          return (
            <Card
              key={item.label}
              className={`shadow-subtle border-t-4 ${colorMap[item.color] || colorMap.slate} animate-fade-in-up`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <div className="p-2 bg-white/60 rounded-lg">
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">{item.value}</h2>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

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
