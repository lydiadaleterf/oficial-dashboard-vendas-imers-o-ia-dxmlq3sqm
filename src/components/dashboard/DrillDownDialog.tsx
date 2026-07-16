import { useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExternalLink, Inbox } from 'lucide-react'
import {
  type DrillDownType,
  type DrillDownColumn,
  formatCellValue,
  getDrillDownConfig,
} from '@/services/drill-down'
import type { DrillDownData } from '@/services/dashboard'

interface DrillDownDialogProps {
  type: DrillDownType | null
  onClose: () => void
  drillDownData?: DrillDownData
  selectedFunnels?: string[]
}

const TYPE_TO_KEY: Record<DrillDownType, keyof DrillDownData> = {
  entradas: 'entradas',
  'vagas-fechadas': 'vagasFechadas',
  receita: 'receita',
  'entradas-pendentes': 'entradasPendentes',
  reembolsos: 'reembolsos',
  agendamento: 'agendamento',
}

function LinkCell({
  url,
  label,
  variant,
}: {
  url: string
  label: string
  variant: 'hubspot' | 'guru'
}) {
  if (!url) return <span className="text-slate-300">—</span>
  const styles =
    variant === 'hubspot'
      ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
      : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${styles}`}
    >
      <ExternalLink className="w-3 h-3" />
      {label}
    </a>
  )
}

function renderCell(record: Record<string, any>, col: DrillDownColumn) {
  const value = record[col.key]
  if (col.format === 'link') {
    return (
      <LinkCell
        url={value}
        label={col.linkLabel || 'Abrir'}
        variant={col.key === 'link_hubspot' ? 'hubspot' : 'guru'}
      />
    )
  }
  return <span className="text-sm text-slate-700">{formatCellValue(value, col.format)}</span>
}

export function DrillDownDialog({
  type,
  onClose,
  drillDownData,
  selectedFunnels = [],
}: DrillDownDialogProps) {
  const open = type !== null

  const config = useMemo(
    () => (type ? getDrillDownConfig(type, selectedFunnels) : null),
    [type, selectedFunnels],
  )

  const records = useMemo(() => {
    if (!type || !drillDownData) return []
    return drillDownData[TYPE_TO_KEY[type]] || []
  }, [type, drillDownData])

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">
            {config?.title || 'Detalhes'}
          </DialogTitle>
        </DialogHeader>
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <>
            <div className="text-sm text-slate-500 mb-2">
              {records.length} {records.length === 1 ? 'registro' : 'registros'}
            </div>
            <ScrollArea className="flex-1 border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    {config?.columns.map((col) => (
                      <TableHead key={col.key} className="whitespace-nowrap">
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record, idx) => (
                    <TableRow key={idx}>
                      {config?.columns.map((col) => (
                        <TableCell key={col.key} className="whitespace-nowrap">
                          {renderCell(record, col)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
