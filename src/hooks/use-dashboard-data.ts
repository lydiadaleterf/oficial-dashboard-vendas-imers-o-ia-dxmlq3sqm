import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  fetchAllDashboardData,
  processDashboardData,
  type DashboardData,
  type FunnelSelection,
  type DateRange,
  type RawDashboardData,
} from '@/services/dashboard'

export const useDashboardData = (selectedFunnels: FunnelSelection = [], dateRange?: DateRange) => {
  const [rawData, setRawData] = useState<RawDashboardData | null>(null)
  const [isPartial, setIsPartial] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const funnelsKey = JSON.stringify(selectedFunnels)
  const dateKey = JSON.stringify(dateRange)

  const loadData = useCallback(async (isRefresh = false) => {
    const requestId = ++requestIdRef.current
    if (isRefresh) setRefreshing(true)
    else {
      setRawData(null)
      setLoading(true)
    }
    setError(null)
    try {
      const result = await fetchAllDashboardData()
      if (requestId !== requestIdRef.current) return
      setRawData(result.data)
      setIsPartial(result.isPartial)
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      console.error('Error fetching dashboard data:', err)
      setError('Falha ao carregar os dados do dashboard.')
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const data = useMemo<DashboardData | null>(() => {
    if (!rawData) return null
    return processDashboardData(rawData, selectedFunnels, dateRange, isPartial)
  }, [rawData, funnelsKey, dateKey, isPartial])

  return { data, loading, refreshing, error, refresh: () => loadData(true) }
}
