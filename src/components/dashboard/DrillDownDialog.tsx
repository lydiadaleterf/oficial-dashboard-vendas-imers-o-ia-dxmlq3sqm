import { useState, useEffect, useCallback } from 'react'
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
import {
  DrillDownType,
  DrillDownColumn,
  formatCellValue,
  fetchDrillDownData,
} from '@/services/drill-down'

interface DrillDownDialogProps {
  type: DrillDownType | null
  onClose: () => void
  preloadedRecords?: Record<string, any>[]
  preloadedColumns?: DrillDownColumn[]
  preloadedTitle?: string
}

export function DrillDownDialog({
  type,
  onClose,
  preloadedRecords,
  preloadedColumns,
  preloadedTitle,
}: DrillDownDialogProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [columns, setColumns] = useState<DrillDownColumn[]>([])
  const [records, setRecords] = useState<Record<string, any>[]>([])

  const open = type !== null
  const usePreloaded = type === 'vagas-fechadas' && preloadedRecords !== undefined

  const loadData = useCallback(async () => {
    if (!type || usePreloaded) return
    setLoading(true)
    try {
      const result = await fetchDrillDownData(type)
      setTitle(result?.title ?? '')
      setColumns(result?.columns ?? [])
      setRecords(result?.records ?? [])
    } catch {
      setTitle('Erro')
      setColumns([])
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [type, usePreloaded])

  useEffect(() => {
    if (usePreloaded) {
      setLoading(false)
      setTitle(preloadedTitle ?? '')
      setColumns(preloadedColumns ?? [])
      setRecords(preloadedRecords ?? [])
    } else if (type) {
      loadData()
    }
  }, [type, usePreloaded, preloadedRecords, preloadedColumns, preloadedTitle, loadData])

  const safeColumns = columns ?? []
  const safeRecords = records ?? []

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
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
          ) : safeRecords.length === 0 ? (
            <p className="text-center py-10 text-slate-500">Nenhum registro encontrado.</p>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow>
                  {safeColumns.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeRecords.map((record, i) => (
                  <TableRow key={i} className="hover:bg-slate-50">
                    {safeColumns.map((col) => (
                      <TableCell key={col.key} className="text-sm text-slate-700">
                        {col.format === 'link' && record?.[col.key] ? (
                          <a
                            href={record[col.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Abrir link
                          </a>
                        ) : (
                          formatCellValue(record?.[col.key], col.format)
                        )}
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
