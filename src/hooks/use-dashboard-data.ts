import { useState, useEffect, useCallback } from 'react'
import { DashboardData, fetchDashboardData } from '@/services/dashboard'

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    setError(null)

    try {
      const result = await fetchDashboardData()
      setData(result)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Falha ao carregar os dados do dashboard.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, loading, refreshing, error, refresh: () => loadData(true) }
}
