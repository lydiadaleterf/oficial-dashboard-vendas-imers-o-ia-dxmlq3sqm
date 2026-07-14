import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { DrillDownColumn, formatCellValue } from '@/services/drill-down'

interface DrillDownDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  columns: DrillDownColumn[]
  records: Record<string, any>[]
  loading?: boolean
}

export function DrillDownDialog({
  open,
  onOpenChange,
  title,
  columns,
  records,
  loading,
}: DrillDownDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="gap-1 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <span className="ml-2">{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-1 border-t">
          {loading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <p className="text-center py-10 text-slate-500">Nenhum registro encontrado.</p>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, i) => (
                  <TableRow key={i} className="hover:bg-slate-50">
                    {columns.map((col) => (
                      <TableCell key={col.key} className="text-sm text-slate-700">
                        {formatCellValue(record[col.key], col.format)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
