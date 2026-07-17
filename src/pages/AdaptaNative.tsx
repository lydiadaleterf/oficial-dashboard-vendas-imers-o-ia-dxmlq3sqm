import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useAdaptaNativeData } from '@/hooks/use-adapta-native-data'
import { useNektData } from '@/hooks/use-nekt-data'
import { NEKT_QUERIES } from '@/services/nekt'
import type { DateRange } from '@/services/dashboard'
import { ScorecardCards } from '@/components/dashboard/ScorecardCards'
import { NativeLeadsTable } from '@/components/dashboard/NativeLeadsTable'
import { NativeDistribution } from '@/components/dashboard/NativeDistribution'
import { DateRangeFilter, type QuickPeriod } from '@/components/dashboard/DateRangeFilter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Users, Trophy, TrendingUp, RefreshCw } from 'lucide-react'
import { formatCurrency, formatNumber, safeNumber } from '@/lib/format'

export default function AdaptaNative() {
  const { user, loading: authLoading } = useAuth()
  const [activePeriod, setActivePeriod] = useState<QuickPeriod>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const { data, loading, refreshing, error, refresh } = useAdaptaNativeData(dateRange)
  const { data: scorecardData, error: scorecardError } = useNektData(NEKT_QUERIES.SCORECARD)

  if (authLoading) return null
  if (!user) return <Navigate to="/login" replace />

  const ganhoCount =
    data?.leadsByDealStage.find((s) => s.label.toLowerCase() === 'ganho')?.count ?? 0
  const totalReceita =
    data?.dailySales.reduce((sum, s) => sum + (safeNumber(s.receita) ?? 0), 0) ?? 0

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Adapta Labs Native</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tracking de vendas e gestão de leads</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={refreshing}
          className="shrink-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <DateRangeFilter
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
        onDateRangeChange={setDateRange}
        dateRange={dateRange}
      />

      {scorecardError && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs text-amber-700">
              Scorecard Nekt indisponível: {scorecardError}
            </span>
          </CardContent>
        </Card>
      )}

      {scorecardData.length > 0 && <ScorecardCards data={scorecardData} />}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </CardContent>
        </Card>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="shadow-subtle border-slate-200 animate-fade-in-up">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-500">Total de Leads</p>
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Users className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{formatNumber(data.totalLeads)}</p>
              </CardContent>
            </Card>
            <Card
              className="shadow-subtle border-slate-200 animate-fade-in-up"
              style={{ animationDelay: '50ms' }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-500">Vendas Ganhas</p>
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Trophy className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{formatNumber(ganhoCount)}</p>
              </CardContent>
            </Card>
            <Card
              className="shadow-subtle border-slate-200 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-slate-500">Receita Total</p>
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalReceita)}</p>
              </CardContent>
            </Card>
          </div>

          <NativeDistribution
            byStage={data.leadsByDealStage}
            bySource={data.leadsByOrigemPrimaria}
            totalLeads={data.totalLeads}
          />

          <Card className="shadow-subtle border-slate-200">
            <CardHeader className="pb-2 border-b bg-slate-50/50">
              <CardTitle className="text-base font-semibold text-slate-800">
                Lista Completa de Leads ({data.totalLeads} registros)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <NativeLeadsTable leads={data.rawLeads} />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
