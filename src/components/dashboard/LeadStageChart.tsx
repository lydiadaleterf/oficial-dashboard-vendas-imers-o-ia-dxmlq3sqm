import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadDistributionItem } from '@/services/adapta-native'
import { getDealStageColor } from '@/lib/deal-stage-colors'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts'
import { Funnel } from 'lucide-react'

interface LeadStageChartProps {
  data: LeadDistributionItem[]
}

export function LeadStageChart({ data }: LeadStageChartProps) {
  if (data.length === 0) {
    return (
      <Card className="shadow-subtle border-slate-200 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Funnel className="w-5 h-5 text-purple-600" />
            Distribuição de Leads por Estágio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 py-8 text-center">Sem dados disponíveis</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((d) => ({ label: d.label, count: d.count }))
  const height = Math.max(220, chartData.length * 42)

  return (
    <Card className="shadow-subtle border-slate-200 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Funnel className="w-5 h-5 text-purple-600" />
          Distribuição de Leads por Estágio
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          Quantidade de leads agrupados por estágio no funil de vendas
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ height, width: '100%' }} className="overflow-y-auto mt-4">
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 35, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 11 }}
                width={130}
              />
              <RechartsTooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [`${value} leads`, 'Leads']}
              />
              <Bar dataKey="count" name="Leads" radius={[0, 4, 4, 0]} maxBarSize={30}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStageFillColor(entry.label)} />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  fill="#475569"
                  fontSize={11}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function getStageFillColor(stage: string): string {
  const colorClass = getDealStageColor(stage)
  if (colorClass.includes('green-500')) return '#22c55e'
  if (colorClass.includes('green-100')) return '#86efac'
  if (colorClass.includes('red-500')) return '#ef4444'
  return '#cbd5e1'
}
