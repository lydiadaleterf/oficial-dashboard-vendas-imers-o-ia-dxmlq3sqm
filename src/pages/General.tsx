import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useNektData } from '@/hooks/use-nekt-data'
import { NEKT_QUERIES } from '@/services/nekt'
import { HeroKpiCard } from '@/components/dashboard/HeroKpiCard'
import { ProductBreakdown } from '@/components/dashboard/ProductBreakdown'
import { EfficiencySection } from '@/components/dashboard/EfficiencySection'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function General() {
  const { user, loading: authLoading } = useAuth()
  const { data, loading, error, refresh } = useNektData(NEKT_QUERIES.SCORECARD)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  const row = data.length > 0 ? data[0] : null

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Visão Geral — Dashboard BU Labs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Scorecard consolidado do negócio</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading}
          className="shrink-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {loading && (
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Erro ao carregar scorecard</p>
              <p className="text-xs text-amber-700 mt-1">{error}</p>
              <Button variant="outline" size="sm" onClick={refresh} className="mt-3">
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && row && (
        <>
          <HeroKpiCard receitaTotal={row.receita_total} />
          <ProductBreakdown row={row} />
          <EfficiencySection row={row} />
        </>
      )}

      {!loading && !error && !row && (
        <Card>
          <CardContent className="p-6 text-center text-slate-500">
            Nenhum dado disponível no momento.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
