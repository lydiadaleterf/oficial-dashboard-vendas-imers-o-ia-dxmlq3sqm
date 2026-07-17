import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartDataPoint } from '@/services/dashboard'
import {
  ComposedChart,
  Bar,
  Line,
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
import { BarChart3 } from 'lucide-react'

const TEAL_COLOR = '#14b8a6'
const TEAL_DARK = '#0d9488'
const SLATE_COLOR = '#94a3b8'
const AMBER_COLOR = '#f59e0b'

interface ChartsSectionProps {
  data: ChartDataPoint[]
}

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

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null
  const entradas = payload.find((p: any) => p.dataKey === 'entradas_realizadas')?.value ?? 0
  const vagas = payload.find((p: any) => p.dataKey === 'vagas_fechadas')?.value ?? 0
  const receita = payload.find((p: any) => p.dataKey === 'receita_fechada')?.value ?? 0
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-md p-3 text-xs">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SLATE_COLOR }} />
          <span className="text-slate-600">Entradas:</span>
          <span className="font-semibold text-slate-800">{entradas}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAL_COLOR }} />
          <span className="text-slate-600">Vagas Fechadas:</span>
          <span className="font-semibold text-slate-800">{vagas}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AMBER_COLOR }} />
          <span className="text-slate-600">Receita:</span>
          <span className="font-semibold text-slate-800">{formatCurrencyValue(receita)}</span>
        </div>
      </div>
    </div>
  )
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

export function ChartsSection({ data }: ChartsSectionProps) {
  const useShortLabels = data.length > 40

  const allData = data.map((d) => ({
    ...d,
    diaFormatted: d.dia
      ? format(parseISO(d.dia), useShortLabels ? 'dd' : 'dd/MM', { locale: ptBR })
      : '',
  }))

  const xAxisInterval = allData.length > 20 ? Math.floor(allData.length / 12) : 0

  if (allData.length === 0) {
    return (
      <div className="mb-6">
        <EmptyChartState
          title="Desempenho Diário — Volume vs. Receita"
          subtitle="Entradas, Vagas Fechadas e Receita por dia"
        />
      </div>
    )
  }

  return (
    <div className="mb-6">
      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Desempenho Diário — Volume vs. Receita
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">Entradas, Vagas Fechadas e Receita por dia</p>
        </CardHeader>
        <CardContent>
          <div className="mt-4 pb-2 w-full" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={allData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
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
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  allowDecimals={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: AMBER_COLOR, fontSize: 12 }}
                  tickFormatter={formatCurrencyAxis}
                />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                <Bar
                  yAxisId="left"
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
                  yAxisId="left"
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
                <Line
                  yAxisId="right"
                  dataKey="receita_fechada"
                  name="Receita"
                  stroke={AMBER_COLOR}
                  strokeWidth={2}
                  type="monotone"
                  dot={{ r: 3, fill: AMBER_COLOR }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
