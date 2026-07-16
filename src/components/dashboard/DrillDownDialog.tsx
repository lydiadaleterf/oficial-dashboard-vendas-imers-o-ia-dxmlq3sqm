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
import { ArrowLeft, ExternalLink } from 'lucide-react'
import {
  DrillDownType,
  DrillDownColumn,
  formatCellValue,
  fetchDrillDownData,
} from '@/services/drill-down'

interface DrillDownDialogProps {
  type: DrillDownType | null
  onClose: () => void
  selectedFunnels?: string[]
  preloadedRecords?: Record<string, any>[]
  preloadedColumns?: DrillDownColumn[]
  preloadedTitle?: string
}

export function DrillDownDialog({
  type,
  onClose,
  selectedFunnels = [],
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
      const result = await fetchDrillDownData(type, selectedFunnels)
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
  }, [type, usePreloaded, selectedFunnels])

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
    ></Dialog>
  )
}
