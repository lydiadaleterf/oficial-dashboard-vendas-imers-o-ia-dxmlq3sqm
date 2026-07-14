import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentMethodData, RefundData } from '@/services/dashboard'
import { CreditCard, Banknote, UserCheck, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentMethodsCardProps {
  methods: PaymentMethodData
  refunds: RefundData
}

export function PaymentMethodsCard({ methods, refunds }: PaymentMethodsCardProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val)

  const items = [
    {
      label: 'Parcelado',
      value: methods.parcelado,
      icon: CreditCard,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'À Vista',
      value: methods.aVista,
      icon: Banknote,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Venda Direta (VD)',
      value: methods.vendaDireta,
      icon: UserCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card className="shadow-subtle col-span-1 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Método de Fechamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => {
              const pct = methods.total > 0 ? (item.value / methods.total) * 100 : 0
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg mb-2', item.bg)}>
                    <item.icon className={cn('w-4 h-4', item.color)} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{item.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                  <p className="text-xs font-medium text-slate-400">{pct.toFixed(0)}%</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className={cn('shadow-subtle', refunds.count > 0 ? 'border-red-200 bg-red-50/30' : '')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-red-500" />
            Reembolsos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold text-slate-800">{refunds.count}</p>
            <p className="text-sm text-slate-500">
              {refunds.count > 0
                ? `${formatCurrency(refunds.valor)} reembolsados`
                : 'Nenhum reembolso'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
