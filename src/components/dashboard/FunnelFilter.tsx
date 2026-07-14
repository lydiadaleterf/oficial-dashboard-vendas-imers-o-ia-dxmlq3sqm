import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Filter } from 'lucide-react'
import { FUNNEL_OPTIONS, FUNNEL_MAP } from '@/lib/funnel-labels'

interface FunnelFilterProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FunnelFilter({ selected, onChange }: FunnelFilterProps) {
  const currentValue = selected.length === 0 ? 'all' : selected[0]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="text-xs font-medium text-slate-500 shrink-0">Funil:</span>
      <ToggleGroup
        type="single"
        value={currentValue}
        onValueChange={(val) => {
          if (!val) return
          onChange(val === 'all' ? [] : [val])
        }}
        className="gap-1"
      >
        {FUNNEL_OPTIONS.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            className="text-xs px-3 py-1.5 rounded-lg font-medium border"
            aria-label={opt.label}
          >
            {FUNNEL_MAP[opt.value] ?? opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
