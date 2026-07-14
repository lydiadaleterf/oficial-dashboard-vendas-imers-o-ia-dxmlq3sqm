import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartDataPoint, GeoDataPoint } from '@/services/dashboard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GeoBarChart } from '@/components/dashboard/GeoBarChart'

const TEAL_COLOR = '#14b8a6'
const TEAL_DARK = '#0d9488'
const SLATE_COLOR = '#94a3b8'

interface ChartsSectionProps {
  data: ChartDataPoint[]
  geoData: GeoDataPoint[]
}

export function ChartsSection({ data, geoData }: ChartsSectionProps) {
  const allData = data.map((d) => ({
    ...d,
    diaFormatted: d.dia ? format(parseISO(d.dia), 'dd/MM', { locale: ptBR }) : '',
  }))

  const chartWidth = Math.max(allData.length * 55, 800)

  const formatCurrencyAxis = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`
    }
    return `R$ ${value}`
  }

  const formatCurrencyValue = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)

  const tooltipStyle = {
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  }

  return (
    <div className="flex flex-col gap-6 mb-6">
      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Desempenho Diário — Entradas vs. Vagas Fechadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mt-4 pb-2">
            <div style={{ width: chartWidth, height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="diaFormatted"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
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
                    contentStyle={tooltipStyle}
                    labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                  <Bar
                    dataKey="entradas_realizadas"
                    name="Entradas"
                    fill={SLATE_COLOR}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  >
                    <LabelList
                      dataKey="entradas_realizadas"
                      position="top"
                      fill="#64748b"
                      fontSize={10}
                      formatter={(value: number) => (value > 0 ? String(value) : '')}
                    />
                  </Bar>
                  <Bar
                    dataKey="vagas_fechadas"
                    name="Vagas Fechadas"
                    fill={TEAL_COLOR}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  >
                    <LabelList
                      dataKey="vagas_fechadas"
                      position="top"
                      fill={TEAL_DARK}
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

      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Receita Fechada por Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mt-4 pb-2">
            <div style={{ width: chartWidth, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="diaFormatted"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={formatCurrencyAxis}
                  />
                  <RechartsTooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={tooltipStyle}
                    labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
                    formatter={(value: number) => [formatCurrencyValue(value), 'Receita']}
                  />
                  <Bar
                    dataKey="receita_fechada"
                    name="Receita Fechada"
                    fill={TEAL_COLOR}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Distribuição Geográfica
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">Vagas fechadas por estado (ranking)</p>
        </CardHeader>
        <CardContent>
          <div className="w-full mt-4">
            <GeoBarChart geoData={geoData} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
