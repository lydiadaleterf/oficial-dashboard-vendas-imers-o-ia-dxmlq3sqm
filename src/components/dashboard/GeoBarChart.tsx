import { useMemo } from 'react'
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
import { GeoDataPoint } from '@/services/dashboard'
import { normalizeStateCode } from './brazil-states'

interface GeoBarChartProps {
  geoData: GeoDataPoint[]
}

export function GeoBarChart({ geoData }: GeoBarChartProps) {
  const data = useMemo(() => {
    const map = new Map<string, number>()
    geoData.forEach(({ estado, count }) => {
      const code = normalizeStateCode(estado) || estado.trim().toUpperCase()
      map.set(code, (map.get(code) || 0) + count)
    })
    return Array.from(map.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
  }, [geoData])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-slate-400">
        Sem dados geográficos disponíveis
      </div>
    )
  }

  const chartHeight = Math.max(300, data.length * 38)

  return (
    <div className="w-full overflow-y-auto pr-2" style={{ maxHeight: 380 }}>
      <div style={{ height: chartHeight, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
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
              dataKey="code"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
              width={45}
            />
            <RechartsTooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#334155' }}
              formatter={(value: number) => [
                `${value} vaga${value !== 1 ? 's' : ''} fechada${value !== 1 ? 's' : ''}`,
                'Vagas',
              ]}
            />
            <Bar
              dataKey="count"
              name="Vagas Fechadas"
              fill="#14b8a6"
              radius={[0, 4, 4, 0]}
              maxBarSize={28}
            >
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
    </div>
  )
}
