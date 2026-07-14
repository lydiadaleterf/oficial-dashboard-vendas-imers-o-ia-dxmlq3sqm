import { useState, useEffect, useCallback } from 'react'
import { fetchAdaptaNativeData, AdaptaNativeData } from '@/services/adapta-native'

export const useAdaptaNativeData = () => {
  const [data, setData] = useState<AdaptaNativeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAdaptaNativeData()
      setData(result)
    } catch (err) {
      console.error('Error fetching adapta native data:', err)
      setError('Falha ao carregar dados do Adapta.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, loading, error, refresh: loadData }
}
