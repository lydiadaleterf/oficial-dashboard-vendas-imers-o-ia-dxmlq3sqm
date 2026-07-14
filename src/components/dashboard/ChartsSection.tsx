import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartDataPoint } from '@/services/dashboard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChartsSectionProps {
  data: ChartDataPoint[]
}

export function ChartsSection({ data }: ChartsSectionProps) {
  const formattedData = data.map((d) => ({
    ...d,
    diaFormatted: d.dia ? format(parseISO(d.dia), 'dd MMM', { locale: ptBR }) : '',
  }))

  return (
    <Card className="shadow-subtle border-slate-200 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Desempenho Diário (Últimos Dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="diaFormatted"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <RechartsTooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar
                dataKey="entradas_realizadas"
                name="Entradas Realizadas"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="vagas_fechadas"
                name="Vagas Fechadas"
                fill="#14b8a6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
