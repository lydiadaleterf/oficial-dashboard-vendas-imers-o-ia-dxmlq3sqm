import { Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunnelFilterProps {
  funnels: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FunnelFilter({ funnels, selected, onChange }: FunnelFilterProps) {
  const isAllActive = selected.length === 0
  const isActive = (funnel: string) => isAllActive || selected.includes(funnel)

  const toggle = (funnel: string) => {
    if (isAllActive) {
      onChange(funnels.filter((f) => f !== funnel))
    } else if (selected.includes(funnel)) {
      const next = selected.filter((f) => f !== funnel)
      onChange(next.length === 0 ? funnels : next)
    } else {
      const next = [...selected, funnel]
      onChange(next.length === funnels.length ? [] : next)
    }
  }

  if (funnels.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-xs font-medium text-slate-500 shrink-0">Funil:</span>
      {funnels.map((funnel) => (
        <button
          key={funnel}
          onClick={() => toggle(funnel)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200',
            isActive(funnel)
              ? 'bg-teal-500 text-white border-teal-500 hover:bg-teal-600 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
          )}
        >
          {funnel}
        </button>
      ))}
    </div>
  )
}
