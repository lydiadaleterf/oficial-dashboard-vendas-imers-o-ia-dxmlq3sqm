import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FunnelData } from '@/services/dashboard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunnelSectionProps {
  funnels: FunnelData[]
}

function FunnelStage({
  label,
  value,
  widthPct,
  color,
  delay,
}: {
  label: string
  value: number
  widthPct: number
  color: string
  delay: number
}) {
  return (
    <div
      className={cn(
        'rounded-md p-3 text-center shadow-sm transition-transform hover:scale-[1.02] duration-200 animate-fade-in-up',
        color,
      )}
      style={{
        width: `${Math.max(widthPct, 30)}%`,
        margin: '0 auto',
        animationDelay: `${delay}ms`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function ConversionArrow({ pct }: { pct: number }) {
  return (
    <div className="flex flex-col items-center py-0.5 text-slate-400">
      <div className="bg-slate-50 px-3 py-0.5 rounded-full text-xs font-medium text-slate-500 shadow-sm border border-slate-100 z-10 mb-0.5">
        {pct}% Conversão
      </div>
      <ArrowDown className="w-4 h-4 -mt-2 text-slate-300" />
    </div>
  )
}

export function FunnelSection({ funnels }: FunnelSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {funnels.map((funnel) => {
        const isSkip = funnel.nome.toLowerCase().includes('skip')
        const maxVal = Math.max(funnel.vendaProduto1, funnel.vendaEntrada, funnel.vagasFechadas, 1)
        const isWidening = funnel.vagasFechadas > funnel.vendaEntrada

        return (
          <Card key={funnel.nome} className="shadow-subtle border-slate-200">
            <CardHeader className="pb-2 border-b bg-slate-50/50">
              <CardTitle className="text-lg font-semibold text-slate-800 uppercase tracking-wide">
                Funil: {funnel.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center max-w-sm mx-auto space-y-1">
                {isSkip && (
                  <>
                    <FunnelStage
                      label="Venda Skip"
                      value={funnel.vendaProduto1}
                      widthPct={(funnel.vendaProduto1 / maxVal) * 100}
                      color="bg-slate-200 text-slate-700 border border-slate-300"
                      delay={0}
                    />
                    <ConversionArrow
                      pct={
                        funnel.vendaProduto1 > 0
                          ? Math.round((funnel.vendaEntrada / funnel.vendaProduto1) * 100)
                          : 0
                      }
                    />
                  </>
                )}
                <FunnelStage
                  label={isSkip ? 'Entrada Imersão' : 'Entrada'}
                  value={funnel.vendaEntrada}
                  widthPct={(funnel.vendaEntrada / maxVal) * 100}
                  color="bg-slate-100 text-slate-700 border border-slate-200"
                  delay={isSkip ? 50 : 0}
                />
                <ConversionArrow
                  pct={
                    funnel.vendaEntrada > 0
                      ? Math.round((funnel.vagasFechadas / funnel.vendaEntrada) * 100)
                      : 0
                  }
                />
                <FunnelStage
                  label="Vagas Garantidas"
                  value={funnel.vagasFechadas}
                  widthPct={(funnel.vagasFechadas / maxVal) * 100}
                  color={cn(
                    'text-teal-700 border',
                    isWidening
                      ? 'bg-teal-100 border-teal-300 ring-2 ring-teal-50'
                      : 'bg-teal-50 border-teal-100',
                  )}
                  delay={isSkip ? 100 : 50}
                />

                <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-slate-100 w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 font-medium mb-1">
                      Self Service
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded">
                      {funnel.selfServiceQtd} ({funnel.selfServicePct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-px bg-slate-200" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center cursor-help">
                        <span className="text-[10px] text-teal-600 font-medium mb-1 border-b border-dashed border-teal-400/50">
                          Vendedor
                        </span>
                        <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                          {funnel.vendedorQtd} ({funnel.vendedorPct.toFixed(0)}%)
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
                          funnel.sellers
                            .sort((a, b) => b.vendas - a.vendas)
                            .map((s, i) => (
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
            </CardContent>
          </Card>
        )
      })}
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
