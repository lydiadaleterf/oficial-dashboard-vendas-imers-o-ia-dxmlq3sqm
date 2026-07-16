import { format, subDays, subMonths, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DateRange } from '@/services/dashboard'

export type { DateRange }

export type QuickPeriod = '7d' | '30d' | '3m' | 'all' | 'custom'

interface DateRangeFilterProps {
  activePeriod: QuickPeriod
  onPeriodChange: (period: QuickPeriod) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  dateRange?: DateRange
}

const PERIOD_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Todo o período' },
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
  dateRange,
}: DateRangeFilterProps) {
  const handlePresetChange = (value: string) => {
    onPeriodChange(value as QuickPeriod)
    if (value === 'all') {
      onDateRangeChange(undefined)
    } else {
      onDateRangeChange(calculatePeriodRange(value))
    }
  }

  const handleCalendarSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range?.from) return
    onPeriodChange('custom')
    const startDate = format(range.from, 'yyyy-MM-dd')
    const endDate = format(range.to ?? range.from, 'yyyy-MM-dd')
    onDateRangeChange({ startDate, endDate })
  }

  const dateLabel = !dateRange
    ? 'Todo o período'
    : `${format(parseISO(dateRange.startDate), 'dd/MM/yyyy', { locale: ptBR })} — ${format(parseISO(dateRange.endDate), 'dd/MM/yyyy', { locale: ptBR })}`

  const selectedRange = dateRange
    ? { from: parseISO(dateRange.startDate), to: parseISO(dateRange.endDate) }
    : undefined

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <Select value={activePeriod} onValueChange={handlePresetChange}>
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
          <SelectItem value="custom" disabled className="text-sm">
            Personalizado
          </SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto h-9 text-sm font-normal justify-start"
          >
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5 shrink-0 opacity-60" />
            <span className="truncate">{dateLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-auto shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            locale={ptBR}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
