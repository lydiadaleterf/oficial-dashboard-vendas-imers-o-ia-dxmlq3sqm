import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  Smartphone,
  LayoutGrid,
  DollarSign,
  ShoppingCart,
  Ticket,
  AlertCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/format'

interface ProductBreakdownProps {
  row: Record<string, any>
}

interface ProductConfig {
  name: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  titleColor: string
  borderColor: string
  revenueKey: string
  salesKey: string
  ticketKey: string
  specialKey?: string
  specialLabel?: string
}

const PRODUCTS: ProductConfig[] = [
  {
    name: 'Imersão',
    icon: GraduationCap,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    revenueKey: 'receita_imersao',
    salesKey: 'vendas_imersao',
    ticketKey: 'ticket_medio_imersao',
    specialKey: 'imersao_vd_sem_entrada',
    specialLabel: 'VD sem Entrada',
  },
  {
    name: 'Native',
    icon: Smartphone,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    revenueKey: 'receita_native',
    salesKey: 'vendas_native',
    ticketKey: 'ticket_medio_native',
  },
  {
    name: 'Outros',
    icon: LayoutGrid,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    titleColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    revenueKey: 'receita_outros',
    salesKey: 'vendas_outros',
    ticketKey: 'ticket_medio_outros',
  },
]

function MetricRow({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: LucideIcon
  label: string
  value: string
  iconColor: string
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  )
}

export function ProductBreakdown({ row }: ProductBreakdownProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PRODUCTS.map((product, idx) => {
        const Icon = product.icon
        const revenue = row[product.revenueKey]
        const sales = row[product.salesKey]
        const ticket = row[product.ticketKey]
        const special = product.specialKey ? row[product.specialKey] : null

        return (
          <Card
            key={product.name}
            className={`${product.borderColor} animate-fade-in-up`}
            style={{ animationDelay: `${idx * 75}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${product.iconBg}`}>
                  <Icon className={`w-5 h-5 ${product.iconColor}`} />
                </div>
                <CardTitle className={`text-lg font-semibold ${product.titleColor}`}>
                  {product.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              <MetricRow
                icon={DollarSign}
                label="Receita"
                value={formatCurrency(revenue)}
                iconColor="text-emerald-500"
              />
              <MetricRow
                icon={ShoppingCart}
                label="Vendas"
                value={formatNumber(sales)}
                iconColor="text-blue-500"
              />
              <MetricRow
                icon={Ticket}
                label="Ticket Médio"
                value={formatCurrency(ticket)}
                iconColor="text-purple-500"
              />
              {product.specialKey && (
                <MetricRow
                  icon={AlertCircle}
                  label={product.specialLabel!}
                  value={formatNumber(special)}
                  iconColor="text-amber-500"
                />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
