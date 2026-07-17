import { useState, useEffect, useCallback } from 'react'
import { fetchAdaptaNativeData, AdaptaNativeData, DateRange } from '@/services/adapta-native'

export const useAdaptaNativeData = (dateRange?: DateRange) => {
  const [data, setData] = useState<AdaptaNativeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      try {
        const result = await fetchAdaptaNativeData(dateRange)
        setData(result)
      } catch (err) {
        console.error('Error fetching adapta native data:', err)
        setError('Falha ao carregar dados do Adapta.')
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [dateRange],
  )

  useEffect(() => {
    loadData()
  }, [loadData])

  const refresh = useCallback(() => loadData(true), [loadData])

  return { data, loading, refreshing, error, refresh }
}
