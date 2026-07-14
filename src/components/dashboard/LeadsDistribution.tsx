import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadDistributionItem } from '@/services/adapta-native'
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

interface LeadsDistributionProps {
  byOrigemPrimaria: LeadDistributionItem[]
  byOrigemSecundaria: LeadDistributionItem[]
  byUtmSource: LeadDistributionItem[]
}

const COLORS = ['#14b8a6', '#0d9488', '#0f766e']

function DistributionChart({
  data,
  title,
  color,
}: {
  data: LeadDistributionItem[]
  title: string
  color: string
}) {
  if (data.length === 0) {
    return (
      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 py-8 text-center">Sem dados disponíveis</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((d) => ({ label: d.label, count: d.count }))
  const height = Math.max(200, chartData.length * 38)

  return (
    <Card className="shadow-subtle border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height, width: '100%' }} className="overflow-y-auto">
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
                width={110}
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
              <Bar dataKey="count" name="Leads" fill={color} radius={[0, 4, 4, 0]} maxBarSize={28}>
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

export function LeadsDistribution({
  byOrigemPrimaria,
  byOrigemSecundaria,
  byUtmSource,
}: LeadsDistributionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <DistributionChart data={byOrigemPrimaria} title="Origem Primária" color={COLORS[0]} />
      <DistributionChart data={byOrigemSecundaria} title="Origem Secundária" color={COLORS[1]} />
      <DistributionChart data={byUtmSource} title="UTM Source" color={COLORS[2]} />
    </div>
  )
}
