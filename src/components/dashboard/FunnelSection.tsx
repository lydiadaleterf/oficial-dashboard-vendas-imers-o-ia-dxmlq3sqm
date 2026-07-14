import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FunnelData } from '@/services/dashboard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunnelSectionProps {
  funnels: FunnelData[]
}

export function FunnelSection({ funnels }: FunnelSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {funnels.map((funnel) => (
        <Card key={funnel.nome} className="shadow-subtle border-slate-200">
          <CardHeader className="pb-2 border-b bg-slate-50/50">
            <CardTitle className="text-lg font-semibold text-slate-800 uppercase tracking-wide">
              Funil: {funnel.nome}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center max-w-sm mx-auto space-y-2">
              {/* Stage 1: Entrada */}
              <div className="w-full bg-slate-100 border border-slate-200 rounded-t-lg rounded-b-sm p-4 text-center relative shadow-sm transition-transform hover:scale-[1.02] duration-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Entradas
                </p>
                <p className="text-3xl font-bold text-slate-800">{funnel.vendaEntrada}</p>
              </div>

              {/* Conversion Arrow */}
              <div className="flex flex-col items-center justify-center py-2 text-slate-400">
                <div className="bg-slate-50 px-3 py-1 rounded-full text-xs font-medium text-slate-500 shadow-sm border border-slate-100 z-10 mb-1">
                  {funnel.vendaEntrada > 0
                    ? Math.round((funnel.vagasFechadas / funnel.vendaEntrada) * 100)
                    : 0}
                  % Conversão
                </div>
                <ArrowDown className="w-5 h-5 -mt-3 text-slate-300" />
              </div>

              {/* Stage 2: Vagas Fechadas */}
              <div
                className={cn(
                  'bg-teal-50 border border-teal-100 rounded-t-sm rounded-b-lg p-4 text-center w-full sm:w-5/6 relative shadow-sm transition-transform hover:scale-[1.02] duration-200',
                  funnel.vagasFechadas > funnel.vendaEntrada
                    ? 'sm:w-full border-teal-300 ring-2 ring-teal-50'
                    : '', // Dynamic widening visual cue
                )}
              >
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                  Vagas Fechadas
                </p>
                <p className="text-3xl font-bold text-teal-700 mb-4">{funnel.vagasFechadas}</p>

                {/* Split Badges */}
                <div className="flex justify-center gap-2 mt-2 pt-3 border-t border-teal-100/50">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-teal-600/70 font-medium mb-1">
                      Self Service
                    </span>
                    <span className="bg-white/60 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded shadow-sm">
                      {funnel.selfServiceQtd}
                    </span>
                  </div>

                  <div className="w-px bg-teal-200/50 mx-1 self-stretch"></div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center cursor-help">
                        <span className="text-[10px] text-teal-600/70 font-medium mb-1 border-b border-dashed border-teal-400/50">
                          Vendedor
                        </span>
                        <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 rounded shadow-sm">
                          {funnel.vendedorQtd}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-slate-800 text-slate-50 border-slate-700"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold border-b border-slate-600 pb-1 mb-1">
                          Quebra por Vendedor
                        </p>
                        {funnel.sellers.length > 0 ? (
                          funnel.sellers.map((s, i) => (
                            <div key={i} className="flex justify-between gap-4 text-xs">
                              <span>{s.nome}</span>
                              <span className="font-bold">{s.vendas}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">Nenhum dado</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {funnels.length === 0 && (
        <Card className="col-span-1 lg:col-span-2 border-dashed bg-slate-50">
          <CardContent className="py-10 text-center text-slate-500">
            Nenhum dado de funil disponível no momento.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
