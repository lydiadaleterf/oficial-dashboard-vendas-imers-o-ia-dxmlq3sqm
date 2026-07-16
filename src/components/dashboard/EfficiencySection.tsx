import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, Gauge, GraduationCap, Smartphone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatNumber, formatDays } from '@/lib/format'

interface EfficiencySectionProps {
  row: Record<string, any>
}

interface CycleConfig {
  product: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  diasKey: string
  casosKey: string
}

const CYCLES: CycleConfig[] = [
  {
    product: 'Imersão',
    icon: GraduationCap,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    diasKey: 'ciclo_vendas_imersao_dias',
    casosKey: 'ciclo_vendas_imersao_casos',
  },
  {
    product: 'Native',
    icon: Smartphone,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    diasKey: 'ciclo_vendas_native_dias',
    casosKey: 'ciclo_vendas_native_casos',
  },
]

export function EfficiencySection({ row }: EfficiencySectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-5 h-5 text-slate-600" />
        <h3 className="text-base font-semibold text-slate-700">Ciclo de Vendas</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CYCLES.map((cycle, idx) => {
          const Icon = cycle.icon
          return (
            <Card
              key={cycle.product}
              className="border-slate-200 animate-fade-in-up"
              style={{ animationDelay: `${idx * 75}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${cycle.iconBg}`}>
                    <Icon className={`w-4 h-4 ${cycle.iconColor}`} />
                  </div>
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {cycle.product}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">Duração</span>
                  </div>
                  <span className="text-lg font-bold text-slate-800">
                    {formatDays(row[cycle.diasKey])}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500">Casos</span>
                  </div>
                  <span className="text-lg font-bold text-slate-800">
                    {formatNumber(row[cycle.casosKey])}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
