import { useState } from 'react'
import { format, subDays, subMonths, parseISO, isBefore, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, AlertCircle } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export interface DateRange {
  startDate: string
  endDate: string
}

export type QuickPeriod = '7d' | '30d' | '3m' | null

interface DateRangeFilterProps {
  dateRange: DateRange
  activePeriod: QuickPeriod
  onDateRangeChange: (range: DateRange) => void
  onPeriodChange: (period: QuickPeriod) => void
}

const PERIOD_LABELS: Record<string, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '3m': 'Últimos 3 meses',
}

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
  dateRange,
  activePeriod,
  onDateRangeChange,
  onPeriodChange,
}: DateRangeFilterProps) {
  const [error, setError] = useState<string | null>(null)

  const startDate = parseISO(dateRange.startDate)
  const endDate = parseISO(dateRange.endDate)

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return
    const newStart = format(date, 'yyyy-MM-dd')
    if (isAfter(date, endDate)) {
      setError('A data de início não pode ser posterior à data final.')
      return
    }
    setError(null)
    onPeriodChange(null)
    onDateRangeChange({ ...dateRange, startDate: newStart })
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return
    const newEnd = format(date, 'yyyy-MM-dd')
    if (isBefore(date, startDate)) {
      setError('A data final não pode ser anterior à data de início.')
      return
    }
    setError(null)
    onPeriodChange(null)
    onDateRangeChange({ ...dateRange, endDate: newEnd })
  }

  const handlePeriodSelect = (period: string) => {
    if (!period) {
      onPeriodChange(null)
      return
    }
    setError(null)
    onPeriodChange(period as QuickPeriod)
    onDateRangeChange(calculatePeriodRange(period))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
        <ToggleGroup
          type="single"
          value={activePeriod ?? ''}
          onValueChange={handlePeriodSelect}
          className="gap-1"
        >
          {Object.entries(PERIOD_LABELS).map(([value, label]) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="text-xs px-3 py-1.5 rounded-lg font-medium border"
              aria-label={label}
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex items-center gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal text-xs h-9',
                  !dateRange.startDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                {dateRange.startDate
                  ? format(startDate, 'dd/MM/yyyy', { locale: ptBR })
                  : 'Data Início'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                locale={ptBR}
                disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-slate-400 text-xs">—</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal text-xs h-9',
                  !dateRange.endDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                {dateRange.endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data Final'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                locale={ptBR}
                disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-500 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
