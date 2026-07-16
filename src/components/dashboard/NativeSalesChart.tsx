import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AdaptaDailySales } from '@/services/adapta-native'

interface NativeSalesChartProps {
  data: AdaptaDailySales[]
}

export function NativeSalesChart({ data }: NativeSalesChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    diaFormatted: d.dia ? format(parseISO(d.dia), 'dd/MM', { locale: ptBR }) : '',
    vendas: d.vendas ?? 0,
  }))

  if (chartData.length === 0) {
    return (
      <Card className="shadow-subtle border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Vendas Diárias — Adapta Summit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 text-center py-8">Sem dados de vendas disponíveis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-subtle border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Vendas Diárias — Adapta Summit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto mt-4 pb-2">
          <div style={{ width: Math.max(chartData.length * 55, 600), height: 300 }}>
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
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  allowDecimals={false}
                />
                <RechartsTooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="vendas"
                  name="Vendas"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  <LabelList
                    dataKey="vendas"
                    position="top"
                    fill="#0d9488"
                    fontSize={10}
                    formatter={(value: number) => (value > 0 ? String(value) : '')}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
