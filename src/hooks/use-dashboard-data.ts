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
  const [filtering, setFiltering] = useState(false)
  const requestIdRef = useRef(0)
  const funnelsKey = JSON.stringify(selectedFunnels)
  const dateKey = JSON.stringify(dateRange)
  const prevFiltersRef = useRef({ funnelsKey, dateKey })

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

  useEffect(() => {
    const prev = prevFiltersRef.current
    const changed = prev.funnelsKey !== funnelsKey || prev.dateKey !== dateKey
    if (changed && rawData) {
      setFiltering(true)
      const t = setTimeout(() => setFiltering(false), 300)
      prevFiltersRef.current = { funnelsKey, dateKey }
      return () => clearTimeout(t)
    }
    prevFiltersRef.current = { funnelsKey, dateKey }
  }, [funnelsKey, dateKey, rawData])

  const data = useMemo<DashboardData | null>(() => {
    if (!rawData) return null
    return processDashboardData(rawData, selectedFunnels, dateRange, isPartial)
  }, [rawData, funnelsKey, dateKey, isPartial])

  return { data, loading, refreshing, filtering, error, refresh: () => loadData(true) }
}
