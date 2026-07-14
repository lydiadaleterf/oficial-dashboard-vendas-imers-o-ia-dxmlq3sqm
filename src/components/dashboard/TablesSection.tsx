import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DashboardData } from '@/services/dashboard'
import { ExternalLink, AlertCircle, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TablesSectionProps {
  data: DashboardData
}

export function TablesSection({ data }: TablesSectionProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Entradas Sem Vaga */}
      <Card className="shadow-subtle border-amber-200/50 bg-amber-50/10 col-span-1 lg:col-span-2 flex flex-col">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Entradas sem Vaga (Follow-up)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data Entrada</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.entradasSemVaga.length > 0 ? (
                  data.entradasSemVaga.map((row, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/80 transition-colors group">
                      <TableCell className="font-medium text-slate-700">
                        {row.nome || <span className="italic text-slate-400">Sem nome</span>}
                        <div className="text-xs text-slate-500 font-normal">{row.email}</div>
                      </TableCell>
                      <TableCell className="text-slate-600">{formatDate(row.dt_entrada)}</TableCell>
                      <TableCell className="text-right">
                        {row.link_hubspot ? (
                          <a
                            href={row.link_hubspot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-amber-100 text-amber-600 transition-colors opacity-70 group-hover:opacity-100"
                            title="Abrir no HubSpot"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-slate-500">
                      Nenhum registro pendente
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Agendamentos Pendentes & Vendas por Vendedor (Stacked) */}
      <div className="flex flex-col gap-6 col-span-1">
        {/* Agendamentos Pendentes */}
        <Card className="shadow-subtle border-amber-200/50 flex-1 flex flex-col">
          <CardHeader className="pb-3 border-b bg-amber-50/50">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-900">
              <Clock className="w-4 h-4 text-amber-600" />
              Não Agendou
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="max-h-[180px] overflow-auto bg-amber-50/20">
              <Table>
                <TableBody>
                  {data.agendamentosPendentes.length > 0 ? (
                    data.agendamentosPendentes.map((row, i) => (
                      <TableRow key={i} className="hover:bg-amber-100/50 border-amber-100/50">
                        <TableCell>
                          <div className="font-medium text-sm text-slate-800">
                            {row.nome || '-'}
                          </div>
                          <div className="text-xs text-slate-500">{row.email}</div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-center py-4 text-sm text-slate-500">
                        Tudo em dia!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Vendas por Vendedor */}
        <Card className="shadow-subtle border-slate-200 flex-1 flex flex-col">
          <CardHeader className="pb-3 border-b bg-white">
            <CardTitle className="text-base font-semibold text-slate-800">
              Desempenho Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="max-h-[180px] overflow-auto">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="text-xs h-8">Data</TableHead>
                    <TableHead className="text-xs h-8">Vendedor</TableHead>
                    <TableHead className="text-xs h-8 text-right">Qtd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.vendasPorVendedor.length > 0 ? (
                    data.vendasPorVendedor.slice(0, 15).map((row, i) => (
                      <TableRow key={i} className="hover:bg-slate-50 border-slate-100">
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(row.dia)}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-700">
                          {row.vendedor}
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-teal-600">
                          {row.vendas}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-sm text-slate-500">
                        Sem dados recentes
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
