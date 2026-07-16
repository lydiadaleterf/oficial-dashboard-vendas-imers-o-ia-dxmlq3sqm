import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface HeroKpiCardProps {
  receitaTotal: any
}

export function HeroKpiCard({ receitaTotal }: HeroKpiCardProps) {
  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fade-in-up overflow-hidden">
      <CardContent className="p-6 md:p-10 flex flex-col items-center text-center">
        <div className="p-3 bg-emerald-100 rounded-full mb-4 ring-4 ring-emerald-100/50">
          <TrendingUp className="w-7 h-7 text-emerald-600" />
        </div>
        <p className="text-sm font-medium text-emerald-700 mb-2 uppercase tracking-wide">
          Receita Total
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-emerald-900">
          {formatCurrency(receitaTotal)}
        </h2>
        <p className="text-xs text-emerald-600 mt-3">Resultado consolidado de todos os produtos</p>
      </CardContent>
    </Card>
  )
}
