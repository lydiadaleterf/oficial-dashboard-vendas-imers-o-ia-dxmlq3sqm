import { useState, useCallback } from 'react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { KPICards } from '@/components/dashboard/KPICards'
import { PaymentMethodsCard } from '@/components/dashboard/PaymentMethodsCard'
import { FunnelSection } from '@/components/dashboard/FunnelSection'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { TablesSection } from '@/components/dashboard/TablesSection'
import { DrillDownDialog } from '@/components/dashboard/DrillDownDialog'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { DrillDownType, DrillDownResult, fetchDrillDownData } from '@/services/drill-down'

interface DrillDownState {
  type: DrillDownType
  data: DrillDownResult | null
  loading: boolean
}

export default function Index() {
  const { data, loading, refreshing, error, refresh } = useDashboardData()
  const [drillDown, setDrillDown] = useState<DrillDownState | null>(null)

  const handleCardClick = useCallback(async (type: DrillDownType) => {
    setDrillDown({ type, data: null, loading: true })
    try {
      const result = await fetchDrillDownData(type)
      setDrillDown({ type, data: result, loading: false })
    } catch (err) {
      console.error('Error fetching drill-down data:', err)
      setDrillDown({ type, data: null, loading: false })
    }
  }, [])

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-10">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          {error}
          <Button onClick={refresh} variant="outline" className="w-fit">
            Tentar Novamente
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Visão Geral do Funil</h1>
          <p className="text-slate-500 text-sm">Métricas atualizadas em tempo real.</p>
        </div>
        <Button
          onClick={refresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2 bg-white shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </Button>
      </div>

      {data.isPartial && (
        <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Aviso de Dados Parciais</AlertTitle>
          <AlertDescription>
            Não foi possível carregar todas as informações no momento. Alguns gráficos ou tabelas
            podem estar incompletos.
          </AlertDescription>
        </Alert>
      )}

      <div className="animate-fade-in">
        <KPICards data={data.kpis} onCardClick={handleCardClick} />
        <PaymentMethodsCard
          methods={data.paymentMethods}
          refunds={data.refunds}
          onRefundsClick={() => handleCardClick('reembolsos')}
        />
        <FunnelSection funnels={data.funnels} />
        <ChartsSection data={data.chartData} geoData={data.geoData} />
        <TablesSection data={data} />
      </div>

      <DrillDownDialog
        open={drillDown !== null}
        onOpenChange={(open) => !open && setDrillDown(null)}
        title={drillDown?.data?.title ?? ''}
        columns={drillDown?.data?.columns ?? []}
        records={drillDown?.data?.records ?? []}
        loading={drillDown?.loading ?? false}
      />
    </div>
  )
}
