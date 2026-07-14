import { Card, CardContent } from '@/components/ui/card'
import { KPIData } from '@/services/dashboard'
import { CheckCircle, DollarSign, AlertCircle, CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardsProps {
  data: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  const isAgendamentoAlert = data.taxaAgendamento < 50

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-subtle hover:shadow-md transition-shadow border-t-4 border-t-teal-500">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Vagas Fechadas</p>
            <div className="p-2 bg-teal-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 animate-fade-in-up">
            {data.vagasFechadas.toLocaleString('pt-BR')}
          </h2>
        </CardContent>
      </Card>

      <Card className="shadow-subtle hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Receita Total</p>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-800 animate-fade-in-up"
            style={{ animationDelay: '50ms' }}
          >
            {formatCurrency(data.receitaFechada)}
          </h2>
        </CardContent>
      </Card>

      <Card className="shadow-subtle hover:shadow-md transition-shadow border-t-4 border-t-amber-500">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500">Entradas Pendentes</p>
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-800 animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            {data.entradasPendentes}
            <span className="text-base font-medium text-slate-400 ml-1">pendentes</span>
          </h2>
        </CardContent>
      </Card>

      <Card
        className={cn(
          'shadow-subtle hover:shadow-md transition-shadow border-t-4',
          isAgendamentoAlert ? 'border-t-amber-500 bg-amber-50/30' : 'border-t-blue-500',
        )}
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
              'text-3xl font-bold tracking-tight animate-fade-in-up',
              isAgendamentoAlert ? 'text-amber-600' : 'text-slate-800',
            )}
            style={{ animationDelay: '150ms' }}
          >
            {data.taxaAgendamento.toFixed(1)}%
          </h2>
        </CardContent>
      </Card>
    </div>
  )
}
