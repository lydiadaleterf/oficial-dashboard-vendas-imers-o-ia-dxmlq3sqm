import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trophy } from 'lucide-react'
import { SellerDailyEntry } from '@/services/dashboard'

interface SellerDailyStackedChartProps {
  data: SellerDailyEntry[]
}

const SELLER_COLORS = [
  '#14b8a6',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f97316',
  '#6366f1',
  '#84cc16',
  '#06b6d4',
  '#a855f7',
  '#eab308',
  '#14b8a6',
  '#f43f5e',
]

function buildStackedData(data: SellerDailyEntry[]) {
  const dateMap = new Map<string, Record<string, number>>()
  const sellerSet = new Set<string>()

  for (const row of data) {
    if (!row.dia || !row.vendedor) continue
    if (!dateMap.has(row.dia)) {
      dateMap.set(row.dia, { dia: row.dia } as Record<string, number>)
    }
    const entry = dateMap.get(row.dia)!
    const vendedor = row.vendedor
    sellerSet.add(vendedor)
    entry[vendedor] = (entry[vendedor] ?? 0) + (row.vendas ?? 0)
  }

  const sortedDates = Array.from(dateMap.keys()).sort()
  return {
    chartData: sortedDates.map((d) => {
      const entry = dateMap.get(d)!
      return {
        ...entry,
        diaFormatted: format(parseISO(d), 'dd/MM', { locale: ptBR }),
      }
    }),
    sellers: Array.from(sellerSet).sort(),
  }
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null
  const total = payload.reduce((sum: number, p: any) => sum + (p.value ?? 0), 0)
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-md p-3 text-xs max-w-[220px]">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-slate-600">{p.name}</span>
            </div>
            <span className="font-semibold text-slate-800">{p.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 mt-1">
          <span className="text-slate-500 font-medium">Total</span>
          <span className="font-bold text-teal-600">{total}</span>
        </div>
      </div>
    </div>
  )
}

export function SellerDailyStackedChart({ data }: SellerDailyStackedChartProps) {
  const { chartData, sellers } = buildStackedData(data)

  if (chartData.length === 0) {
    return (
      <Card className="shadow-subtle border-slate-200 flex-1 flex flex-col">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            Venda por Vendedor por Dia
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
            <BarChart3 className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">Sem dados</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-subtle border-slate-200 flex-1 flex flex-col">
      <CardHeader className="pb-3 border-b bg-white">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
          <Trophy className="w-4 h-4 text-amber-500" />
          Venda por Vendedor por Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="w-full" style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="diaFormatted"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={chartData.length > 20 ? Math.floor(chartData.length / 10) : 0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: 11 }}
                iconType="circle"
                formatter={(value: string) => <span className="text-slate-600">{value}</span>}
              />
              {sellers.map((seller, i) => (
                <Bar
                  key={seller}
                  dataKey={seller}
                  stackId="sellers"
                  fill={SELLER_COLORS[i % SELLER_COLORS.length]}
                  maxBarSize={50}
                  radius={i === sellers.length - 1 ? [4, 4, 0, 0] : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

import { BarChart3 } from 'lucide-react'
