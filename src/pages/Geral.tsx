import { useState, useMemo } from 'react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useNektData } from '@/hooks/use-nekt-data'
import { NEKT_QUERIES } from '@/services/nekt'
import {
  filterVagasFechadas,
  VAGAS_FECHADAS_COLUMNS,
  type DrillDownType,
} from '@/services/drill-down'
import { ScorecardCards, type ScorecardItem } from '@/components/dashboard/ScorecardCards'
import { FunnelFilter } from '@/components/dashboard/FunnelFilter'
import { DrillDownDialog } from '@/components/dashboard/DrillDownDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  CheckCircle,
  AlertCircle,
  CalendarClock,
  XCircle,
  MinusCircle,
  CreditCard,
  Ticket,
} from 'lucide-react'

export default function Geral() {
  const [selectedFunnels, setSelectedFunnels] = useState<string[]>([])
  const [drillDownType, setDrillDownType] = useState<DrillDownType | null>(null)

  const { data, loading, error, refresh } = useDashboardData(selectedFunnels)
  const { data: vagasFechadasData, loading: vagasLoading } = useNektData(
    NEKT_QUERIES.VAGAS_FECHADAS,
  )

  const filteredVagasFechadas = useMemo(
    () => filterVagasFechadas(vagasFechadasData, selectedFunnels),
    [vagasFechadasData, selectedFunnels],
  )

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Erro ao carregar dados</h2>
          <p className="text-sm text-slate-500 mb-4">{error || 'Ocorreu um erro inesperado.'}</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val || 0)

  const ticketMedio =
    data.kpis.vagasFechadas > 0 ? data.kpis.receitaFechada / data.kpis.vagasFechadas : 0

  const vagasFechadasCount = vagasLoading ? data.kpis.vagasFechadas : filteredVagasFechadas.length

  const items: ScorecardItem[] = [
    {
      label: 'Receita Total',
      value: formatCurrency(data.kpis.receitaFechada),
      icon: DollarSign,
      color: 'emerald',
    },
    {
      label: 'Vagas Fechadas',
      value: vagasFechadasCount.toLocaleString('pt-BR'),
      icon: CheckCircle,
      color: 'teal',
      onClick: () => setDrillDownType('vagas-fechadas'),
    },
    {
      label: 'Entradas Pendentes',
      value: data.kpis.entradasPendentes,
      icon: AlertCircle,
      color: 'amber',
    },
    {
      label: 'Taxa de Agendamento',
      value: `${data.kpis.taxaAgendamento.toFixed(1)}%`,
      icon: CalendarClock,
      color: 'blue',
    },
    { label: 'Reembolsos', value: data.refunds.count, icon: XCircle, color: 'red' },
    {
      label: 'Valor Reembolsado',
      value: formatCurrency(data.refunds.valor),
      icon: MinusCircle,
      color: 'red',
    },
    {
      label: 'Total Transações',
      value: data.paymentMethods.total,
      icon: CreditCard,
      color: 'slate',
    },
    { label: 'Ticket Médio', value: formatCurrency(ticketMedio), icon: Ticket, color: 'purple' },
  ]

  const funnelLabel = selectedFunnels.length > 0 ? selectedFunnels.join(', ') : 'Todos'
  const drillDownTitle = `Vagas Fechadas — ${funnelLabel}`

  return (
    <div className="space-y-2 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Dashboard Geral — BU Labs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Visão consolidada de todos os negócios</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} className="shrink-0">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="mb-4">
        <FunnelFilter selected={selectedFunnels} onChange={setSelectedFunnels} />
      </div>

      {data.isPartial && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-sm text-amber-700">
            Alguns dados podem estar incompletos devido a erros parciais na carga.
          </span>
        </div>
      )}

      <ScorecardCards items={items} />

      <DrillDownDialog
        type={drillDownType}
        onClose={() => setDrillDownType(null)}
        preloadedRecords={filteredVagasFechadas}
        preloadedColumns={VAGAS_FECHADAS_COLUMNS}
        preloadedTitle={drillDownTitle}
      />
    </div>
  )
}
