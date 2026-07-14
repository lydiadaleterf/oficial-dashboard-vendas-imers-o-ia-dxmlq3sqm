import { useState, useEffect, useCallback, useRef } from 'react'
import { DashboardData, FunnelSelection, fetchDashboardData } from '@/services/dashboard'

export const useDashboardData = (selectedFunnels: FunnelSelection = []) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const funnelsKey = JSON.stringify(selectedFunnels)

  const loadData = useCallback(
    async (isRefresh = false) => {
      const requestId = ++requestIdRef.current

      if (isRefresh) setRefreshing(true)
      else {
        setData(null)
        setLoading(true)
      }

      setError(null)

      try {
        const result = await fetchDashboardData(selectedFunnels)
        if (requestId !== requestIdRef.current) return
        setData(result)
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
    },
    [funnelsKey],
  )

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, loading, refreshing, error, refresh: () => loadData(true) }
}
