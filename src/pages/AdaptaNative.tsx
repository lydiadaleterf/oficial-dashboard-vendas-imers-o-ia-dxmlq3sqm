import { useAdaptaNativeData } from '@/hooks/use-adapta-native-data'
import { LeadsDistribution } from '@/components/dashboard/LeadsDistribution'
import { LeadStageChart } from '@/components/dashboard/LeadStageChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdaptaNative() {
  const { data, loading, refreshing, error, refresh } = useAdaptaNativeData()

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
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

  const hasSales = data.dailySales.length > 0
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)
  const formatDate = (d: string) => {
    try {
      return format(parseISO(d), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return d
    }
  }

  return (
    <div className="pb-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Adapta Labs Native</h1>
          <p className="text-slate-500 text-sm">Acompanhe o pipeline de leads do produto.</p>
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

      <LeadStageChart data={data.leadsByDealStage} />

      <LeadsDistribution
        byOrigemPrimaria={data.leadsByOrigemPrimaria}
        byOrigemSecundaria={data.leadsByOrigemSecundaria}
        byUtmSource={data.leadsByUtmSource}
      />

      <Card className="shadow-subtle border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Vendas Diárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasSales ? (
            <div className="overflow-auto mt-4">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs">Data</TableHead>
                    <TableHead className="text-xs">Oferta</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Vendas</TableHead>
                    <TableHead className="text-xs text-right">Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.dailySales.map((row, i) => (
                    <TableRow key={i} className="hover:bg-slate-50">
                      <TableCell className="text-sm text-slate-700">
                        {formatDate(row.dia)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-700">{row.oferta || '-'}</TableCell>
                      <TableCell className="text-sm text-slate-700">{row.status || '-'}</TableCell>
                      <TableCell className="text-sm text-right font-bold text-teal-600">
                        {row.vendas || 0}
                      </TableCell>
                      <TableCell className="text-sm text-right font-bold text-slate-700">
                        {formatCurrency(Number(row.receita || 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">
                Nenhuma venda ainda — acompanhe aqui a partir do lançamento
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
