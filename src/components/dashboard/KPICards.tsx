import { Card, CardContent } from '@/components/ui/card'
import { KPIData } from '@/services/dashboard'
import { DrillDownType } from '@/services/drill-down'
import {
  TrendingUp,
  CheckCircle,
  DollarSign,
  AlertCircle,
  CalendarClock,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardsProps {
  data: KPIData
  onCardClick: (type: DrillDownType) => void
}

export function KPICards({ data, onCardClick }: KPICardsProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  const isAgendamentoAlert = data.taxaAgendamento < 50

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <Card
        className="shadow-subtle hover:shadow-md transition-all border-t-4 border-t-indigo-500 cursor-pointer hover:border-t-indigo-600 animate-fade-in-up"
        style={{ animationDelay: '0ms' }}
        onClick={() => onCardClick('entradas')}
      >
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Entradas</p>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            {data.entradas.toLocaleString('pt-BR')}
          </h2>
        </CardContent>
      </Card>

      <Card
        className="shadow-subtle hover:shadow-md transition-all border-t-4 border-t-teal-500 cursor-pointer hover:border-t-teal-600 animate-fade-in-up"
        style={{ animationDelay: '50ms' }}
        onClick={() => onCardClick('vagas-fechadas')}
      >
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Vagas Fechadas</p>
            <div className="p-2 bg-teal-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            {data.vagasFechadas.toLocaleString('pt-BR')}
          </h2>
        </CardContent>
      </Card>

      <Card
        className="shadow-subtle hover:shadow-md transition-all cursor-pointer hover:border-emerald-400 animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
        onClick={() => onCardClick('receita')}
      >
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Receita Total</p>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            {formatCurrency(data.receitaFechada)}
          </h2>
        </CardContent>
      </Card>

      <Card
        className="shadow-subtle hover:shadow-md transition-all border-t-4 border-t-amber-500 cursor-pointer hover:border-t-amber-600 animate-fade-in-up"
        style={{ animationDelay: '150ms' }}
        onClick={() => onCardClick('entradas-pendentes')}
      >
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Entradas Pendentes</p>
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            {data.entradasPendentes}
            <span className="text-base font-medium text-slate-400 ml-1">pendentes</span>
          </h2>
        </CardContent>
      </Card>

      <Card
        className={cn(
          'shadow-subtle hover:shadow-md transition-all border-t-4 cursor-pointer animate-fade-in-up',
          isAgendamentoAlert
            ? 'border-t-amber-500 bg-amber-50/30 hover:border-t-amber-600'
            : 'border-t-blue-500 hover:border-t-blue-600',
        )}
        style={{ animationDelay: '200ms' }}
        onClick={() => onCardClick('agendamento')}
      >
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p
              className={cn(
                'text-sm font-medium',
                isAgendamentoAlert ? 'text-amber-700' : 'text-slate-500',
              )}
            >
              Taxa de Agendamento
            </p>
            <div
              className={cn('p-2 rounded-lg', isAgendamentoAlert ? 'bg-amber-100' : 'bg-blue-50')}
            >
              <CalendarClock
                className={cn('w-4 h-4', isAgendamentoAlert ? 'text-amber-600' : 'text-blue-600')}
              />
            </div>
          </div>
          <h2
            className={cn(
              'text-3xl font-bold tracking-tight',
              isAgendamentoAlert ? 'text-amber-600' : 'text-slate-800',
            )}
          >
            {data.taxaAgendamento.toFixed(1)}%
          </h2>
        </CardContent>
      </Card>

      <Card
        className="shadow-subtle hover:shadow-md transition-all border-t-4 border-t-rose-500 cursor-pointer hover:border-t-rose-600 animate-fade-in-up"
        style={{ animationDelay: '250ms' }}
        onClick={() => onCardClick('reembolsos')}
      >
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Reembolsos</p>
            <div className="p-2 bg-rose-50 rounded-lg">
              <RotateCcw className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            {data.refunded}
            <span className="text-base font-medium text-slate-400 ml-1">reembolsos</span>
          </h2>
        </CardContent>
      </Card>
    </div>
  )
}
