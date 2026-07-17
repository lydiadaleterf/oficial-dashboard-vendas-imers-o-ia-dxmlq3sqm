import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SellerRankingEntry } from '@/services/dashboard'
import { Trophy, Medal, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SellerRankingProps {
  data: SellerRankingEntry[]
}

const RANK_CONFIG = [
  { icon: Trophy, className: 'text-amber-500', bg: 'bg-amber-50', bar: 'bg-amber-400' },
  { icon: Medal, className: 'text-slate-400', bg: 'bg-slate-50', bar: 'bg-slate-400' },
  { icon: Award, className: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-400' },
]

export function SellerRanking({ data }: SellerRankingProps) {
  const maxVendas = data.length > 0 ? data[0].totalVendas : 1

  return (
    <Card className="shadow-subtle border-slate-200 flex-1 flex flex-col">
      <CardHeader className="pb-3 border-b bg-white">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
          <Trophy className="w-4 h-4 text-amber-500" />
          Ranking de Vendedores
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="max-h-[400px] overflow-auto p-3 space-y-2">
          {data.length > 0 ? (
            data.map((entry, i) => {
              const rank = i < 3 ? RANK_CONFIG[i] : null
              const widthPct = Math.max((entry.totalVendas / maxVendas) * 100, 8)
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-2.5 transition-colors animate-fade-in-up',
                    rank ? rank.bg : 'hover:bg-slate-50',
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center justify-center w-8 h-8 shrink-0">
                    {rank ? (
                      <rank.icon className={cn('w-5 h-5', rank.className)} />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {entry.vendedor}
                      </span>
                      <span className="text-sm font-bold text-teal-600 ml-2 shrink-0">
                        {entry.totalVendas} {entry.totalVendas === 1 ? 'venda' : 'vendas'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          rank ? rank.bar : 'bg-teal-400',
                        )}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex items-center justify-center py-8 text-sm text-slate-500">
              Sem dados de vendedores
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
