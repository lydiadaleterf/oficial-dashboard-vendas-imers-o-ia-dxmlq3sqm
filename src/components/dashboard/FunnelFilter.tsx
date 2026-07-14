import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Filter } from 'lucide-react'

interface FunnelFilterProps {
  available: string[]
  selected: string[]
  onToggle: (name: string) => void
}

export function FunnelFilter({ available, selected, onToggle }: FunnelFilterProps) {
  if (available.length === 0) return null

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
        <Filter className="w-4 h-4" />
        Funis:
      </span>
      {available.map((name) => {
        const isActive = selected.includes(name)
        return (
          <Button
            key={name}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggle(name)}
            className={cn(
              'transition-all duration-200',
              isActive
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-white text-slate-600 hover:bg-slate-100',
            )}
          >
            {name}
          </Button>
        )
      })}
    </div>
  )
}
