import { useState, useEffect, useCallback } from 'react'
import { AdaptaNativeData, fetchAdaptaNativeData } from '@/services/adapta-native'

export const useAdaptaNativeData = () => {
  const [data, setData] = useState<AdaptaNativeData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    setError(null)

    try {
      const result = await fetchAdaptaNativeData()
      setData(result)
    } catch (err) {
      console.error('Error fetching Adapta Native data:', err)
      setError('Falha ao carregar os dados.')
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
