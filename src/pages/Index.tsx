import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { subDays, format } from 'date-fns'
import { useAuth } from '@/hooks/use-auth'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { FunnelFilter } from '@/components/dashboard/FunnelFilter'
import {
  DateRangeFilter,
  type DateRange,
  type QuickPeriod,
} from '@/components/dashboard/DateRangeFilter'
import { KPICards } from '@/components/dashboard/KPICards'
import { FunnelSection } from '@/components/dashboard/FunnelSection'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { TablesSection } from '@/components/dashboard/TablesSection'
import { DrillDownDialog } from '@/components/dashboard/DrillDownDialog'
import { DrillDownType } from '@/services/drill-down'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function getDefaultDateRange(): DateRange {
  const today = new Date()
  const start = subDays(today, 30)
  return { startDate: format(start, 'yyyy-MM-dd'), endDate: format(today, 'yyyy-MM-dd') }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-pulse">
      <Skeleton className="h-8 w-80" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Erro ao carregar dados</h2>
        <p className="text-sm text-slate-500 mb-4">{error || 'Ocorreu um erro inesperado.'}</p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}

export default function Index() {
  const { user, loading: authLoading } = useAuth()
  const [selectedFunnels, setSelectedFunnels] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange)
  const [activePeriod, setActivePeriod] = useState<QuickPeriod>('30d')
  const { data, loading, refreshing, error, refresh } = useDashboardData(selectedFunnels, dateRange)
  const [drillDownType, setDrillDownType] = useState<DrillDownType | null>(null)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error || !data) {
    return <ErrorState error={error} onRetry={refresh} />
  }

  return (
    <div className="space-y-2 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Imersão de IA para CEOs — Dashboard BU Labs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Visão consolidada dos funis Skip e Lançamento Interno
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={refreshing}
          className="shrink-0"
        >
          <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
          Atualizar
        </Button>
      </div>

      <FunnelFilter selected={selectedFunnels} onChange={setSelectedFunnels} />

      <DateRangeFilter
        activePeriod={activePeriod}
        onDateRangeChange={setDateRange}
        onPeriodChange={setActivePeriod}
      />

      {data.isPartial && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-sm text-amber-700">
            Alguns dados podem estar incompletos devido a erros parciais na carga.
          </span>
        </div>
      )}

      <KPICards data={data.kpis} onCardClick={setDrillDownType} />

      <FunnelSection funnels={data.funnels} />

      <ChartsSection data={data.chartData} geoData={data.geoData} />

      <TablesSection data={data} />

      <DrillDownDialog
        type={drillDownType}
        onClose={() => setDrillDownType(null)}
        selectedFunnels={selectedFunnels}
      />
    </div>
  )
}
