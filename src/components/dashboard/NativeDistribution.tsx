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

interface NativeDistributionProps {
  byStage: LeadDistributionItem[]
  bySource: LeadDistributionItem[]
  totalLeads: number
}

const TEAL = '#14b8a6'
const SLATE = '#94a3b8'

export function NativeDistribution({ byStage, bySource, totalLeads }: NativeDistributionProps) {
  const stageData = byStage.map((s) => ({
    ...s,
    pct: totalLeads > 0 ? ((s.count / totalLeads) * 100).toFixed(1) : '0',
  }))

  const sourceData = bySource.slice(0, 8)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">Leads por Stage</CardTitle>
          <p className="text-xs text-slate-500">Conversão por etapa do funil</p>
        </CardHeader>
        <CardContent>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stageData}
                margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 11 }}
                  width={120}
                />
                <RechartsTooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value: number) => [`${value} leads`, 'Total']}
                />
                <Bar dataKey="count" name="Leads" fill={TEAL} radius={[0, 4, 4, 0]} maxBarSize={28}>
                  <LabelList
                    dataKey="count"
                    position="right"
                    fill="#0d9488"
                    fontSize={11}
                    fontWeight={600}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">Leads por Origem</CardTitle>
          <p className="text-xs text-slate-500">Top origens primárias</p>
        </CardHeader>
        <CardContent>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={sourceData}
                margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
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
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value: number) => [`${value} leads`, 'Total']}
                />
                <Bar
                  dataKey="count"
                  name="Leads"
                  fill={SLATE}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={28}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    fill="#64748b"
                    fontSize={11}
                    fontWeight={600}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
