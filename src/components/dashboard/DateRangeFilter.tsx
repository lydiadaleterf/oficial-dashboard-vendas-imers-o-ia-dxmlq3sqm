import { format, subDays, subMonths } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DateRange {
  startDate: string
  endDate: string
}

export type QuickPeriod = '7d' | '30d' | '3m' | null

interface DateRangeFilterProps {
  activePeriod: QuickPeriod
  onPeriodChange: (period: QuickPeriod) => void
  onDateRangeChange: (range: DateRange) => void
}

const PERIOD_OPTIONS: { value: string; label: string }[] = [
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '3m', label: 'Últimos 3 meses' },
]

function calculatePeriodRange(period: string): DateRange {
  const today = new Date()
  const endDate = format(today, 'yyyy-MM-dd')
  let start: Date
  if (period === '7d') start = subDays(today, 7)
  else if (period === '30d') start = subDays(today, 30)
  else if (period === '3m') start = subMonths(today, 3)
  else start = subDays(today, 30)
  return { startDate: format(start, 'yyyy-MM-dd'), endDate }
}

export function DateRangeFilter({
  activePeriod,
  onPeriodChange,
  onDateRangeChange,
}: DateRangeFilterProps) {
  const handleValueChange = (value: string) => {
    onPeriodChange(value as QuickPeriod)
    onDateRangeChange(calculatePeriodRange(value))
  }

  return (
    <Select value={activePeriod ?? ''} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm">
        <CalendarIcon className="w-3.5 h-3.5 mr-1.5 shrink-0 opacity-60" />
        <SelectValue placeholder="Selecione o período" />
      </SelectTrigger>
      <SelectContent>
        {PERIOD_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-sm">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
