import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FunnelData, PagamentosIntegraisData } from '@/services/dashboard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowDown, Banknote, CalendarCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFunnelLabel } from '@/lib/funnel-labels'

interface FunnelSectionProps {
  funnels: FunnelData[]
  pagamentosIntegrais: PagamentosIntegraisData
  filtering?: boolean
}

type TrapezoidDirection = 'narrow' | 'widen' | 'flat'

function getDirection(current: number, next: number | null): TrapezoidDirection {
  if (next === null) return 'flat'
  if (next > current) return 'widen'
  if (next < current) return 'narrow'
  return 'flat'
}

const TRAPEZOID_CLASSES: Record<TrapezoidDirection, string> = {
  narrow: 'funnel-trapezoid-narrow',
  widen: 'funnel-trapezoid-widen',
  flat: 'funnel-trapezoid-flat',
}

function FunnelStage({
  label,
  value,
  widthPct,
  color,
  delay,
  direction,
}: {
  label: string
  value: number
  widthPct: number
  color: string
  delay: number
  direction: TrapezoidDirection
}) {
  return (
    <div
      className={cn(
        'p-3 text-center shadow-sm transition-transform hover:scale-[1.02] duration-200 animate-fade-in-up',
        color,
        TRAPEZOID_CLASSES[direction],
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

function SchedulingConversion({ pct }: { pct: number }) {
  const display = pct > 0 ? `${pct.toFixed(1)}%` : '0.0%'
  return (
    <div
      className="mt-2 w-full flex items-center justify-center animate-fade-in-up"
      style={{ animationDelay: '150ms' }}
    >
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
        <CalendarCheck className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-medium text-indigo-700 uppercase tracking-wider">
          Conversão de Agendamento
        </span>
        <span className="text-lg font-bold text-indigo-600">{display}</span>
      </div>
    </div>
  )
}

function PagamentosIntegraisCard({ data }: { data: PagamentosIntegraisData }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <Card
      className="shadow-subtle border-indigo-200 bg-gradient-to-br from-indigo-50 to-white animate-fade-in-up"
      style={{ animationDelay: '150ms' }}
    >
      <CardHeader className="pb-2 border-b bg-indigo-50/50">
        <CardTitle className="text-lg font-semibold text-indigo-800 uppercase tracking-wide flex items-center gap-2">
          <Banknote className="w-5 h-5 text-indigo-600" />
          Pagamentos Integrais
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-3 h-full">
          <div className="text-center">
            <p className="text-xs font-medium text-indigo-500 uppercase tracking-wider mb-1">
              Vagas Pagas (Sem Entrada)
            </p>
            <p className="text-4xl font-bold text-indigo-700">{data.count}</p>
          </div>
          <div className="w-full pt-3 border-t border-indigo-100">
            <p className="text-xs text-slate-500 text-center mb-1">Valor Total</p>
            <p className="text-xl font-semibold text-indigo-600 text-center">
              {formatCurrency(data.valor)}
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center italic">
            Pagamentos integrais incluídos no total do funil
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function FunnelSection({
  funnels,
  pagamentosIntegrais,
  filtering = false,
}: FunnelSectionProps) {
  const hasPagamentos = pagamentosIntegrais.count > 0
  const gridClass = cn(
    'grid gap-6 mb-6',
    funnels.length === 1 && !hasPagamentos
      ? 'grid-cols-1 max-w-md mx-auto'
      : 'grid-cols-1 lg:grid-cols-2',
  )

  return (
    <div className={cn('relative', gridClass)}>
      {filtering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg animate-fade-in">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-500">Atualizando funil...</span>
          </div>
        </div>
      )}
      {funnels.map((funnel) => {
        const isSkip = funnel.nome.toLowerCase().includes('skip')
        const maxVal = Math.max(funnel.vendaProduto1, funnel.vendaEntrada, funnel.vagasFechadas, 1)
        const isWidening = funnel.vagasFechadas > funnel.vendaEntrada

        const stages: {
          label: string
          value: number
          color: string
          delay: number
          direction: TrapezoidDirection
        }[] = []

        if (isSkip) {
          stages.push({
            label: 'Venda Skip',
            value: funnel.vendaProduto1,
            color: 'bg-slate-200 text-slate-700 border border-slate-300',
            delay: 0,
            direction: getDirection(funnel.vendaProduto1, funnel.vendaEntrada),
          })
          stages.push({
            label: 'Entrada Imersão',
            value: funnel.vendaEntrada,
            color: 'bg-slate-100 text-slate-700 border border-slate-200',
            delay: 50,
            direction: getDirection(funnel.vendaEntrada, funnel.vagasFechadas),
          })
        } else {
          stages.push({
            label: 'Entrada',
            value: funnel.vendaEntrada,
            color: 'bg-slate-100 text-slate-700 border border-slate-200',
            delay: 0,
            direction: getDirection(funnel.vendaEntrada, funnel.vagasFechadas),
          })
        }

        stages.push({
          label: 'Vagas Garantidas',
          value: funnel.vagasFechadas,
          color: cn(
            'text-teal-700 border',
            isWidening
              ? 'bg-teal-100 border-teal-300 ring-2 ring-teal-50'
              : 'bg-teal-50 border-teal-100',
          ),
          delay: isSkip ? 100 : 50,
          direction: 'flat',
        })

        return (
          <Card key={funnel.nome} className="shadow-subtle border-slate-200">
            <CardHeader className="pb-2 border-b bg-slate-50/50">
              <CardTitle className="text-lg font-semibold text-slate-800 uppercase tracking-wide">
                Funil: {getFunnelLabel(funnel.nome)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center max-w-sm mx-auto space-y-1">
                {stages.map((stage, idx) => (
                  <div key={idx} className="w-full flex flex-col items-center">
                    {idx > 0 && (
                      <ConversionArrow
                        pct={
                          isSkip && idx === 1
                            ? funnel.vendaProduto1 > 0
                              ? Math.round((funnel.vendaEntrada / funnel.vendaProduto1) * 100)
                              : 0
                            : funnel.vendaEntrada > 0
                              ? Math.round((funnel.vagasFechadas / funnel.vendaEntrada) * 100)
                              : 0
                        }
                      />
                    )}
                    <FunnelStage
                      label={stage.label}
                      value={stage.value}
                      widthPct={(stage.value / maxVal) * 100}
                      color={stage.color}
                      delay={stage.delay}
                      direction={stage.direction}
                    />
                  </div>
                ))}

                <SchedulingConversion pct={funnel.taxaAgendamento} />

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

      {hasPagamentos && <PagamentosIntegraisCard data={pagamentosIntegrais} />}

      {funnels.length === 0 && !hasPagamentos && (
        <Card className="col-span-1 lg:col-span-2 border-dashed bg-slate-50">
          <CardContent className="py-10 text-center text-slate-500">
            Nenhum dado de funil disponível no momento.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
