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
import { BarChart3 } from 'lucide-react'

const TEAL_COLOR = '#14b8a6'
const TEAL_DARK = '#0d9488'
const SLATE_COLOR = '#94a3b8'

interface ChartsSectionProps {
  data: ChartDataPoint[]
  geoData: GeoDataPoint[]
}

function EmptyChartState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Card className="shadow-subtle border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[340px] text-slate-400">
          <BarChart3 className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">Sem dados disponíveis</p>
          <p className="text-xs mt-1">Não há registros para o período selecionado.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ChartsSection({ data, geoData }: ChartsSectionProps) {
  const allData = data.map((d) => ({
    ...d,
    diaFormatted: d.dia
      ? format(parseISO(d.dia), useShortLabels ? 'dd' : 'dd/MM', { locale: ptBR })
      : '',
  }))

  const xAxisInterval = allData.length > 20 ? Math.floor(allData.length / 12) : 0
  const useShortLabels = allData.length > 40

  const formatCurrencyAxis = (value: number) => {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`
    return `R$ ${value}`
  }

  const formatCurrencyValue = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)

  const formatCurrencyLabel = (value: number) => {
    if (value >= 100000) return `R$ ${(value / 1000).toFixed(0)}k`
    if (value >= 10000) return `R$ ${(value / 1000).toFixed(1)}k`
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const tooltipStyle = {
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  }

  if (allData.length === 0) {
    return (
      <div className="flex flex-col gap-6 mb-6">
        <EmptyChartState title="Desempenho Diário — Entradas vs. Vagas Fechadas" />
        <EmptyChartState title="Receita Fechada por Dia" />
        <EmptyChartState
          title="Distribuição Geográfica"
          subtitle="Vagas fechadas por estado (ranking)"
        />
      </div>
    )
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
          <div className="mt-4 pb-2 w-full" style={{ height: 360 }}>
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
                  interval={xAxisInterval}
                  minTickGap={5}
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
        </CardContent>
      </Card>

      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Receita Fechada por Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4 pb-2 w-full" style={{ height: 340 }}>
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
                  interval={xAxisInterval}
                  minTickGap={5}
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
                >
                  <LabelList
                    dataKey="receita_fechada"
                    position="top"
                    fill={TEAL_DARK}
                    fontSize={10}
                    formatter={(value: number) => (value > 0 ? formatCurrencyLabel(value) : '')}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
          {geoData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
              <BarChart3 className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">Sem dados disponíveis</p>
              <p className="text-xs mt-1">
                Não há registros geográficos para o período selecionado.
              </p>
            </div>
          ) : (
            <div className="w-full mt-4">
              <GeoBarChart geoData={geoData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
