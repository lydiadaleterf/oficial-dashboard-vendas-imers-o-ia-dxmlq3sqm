import { useState, useEffect, useCallback, useRef } from 'react'
import { nektQuery } from '@/services/nekt'

export function useNektData(sql: string) {
  const [data, setData] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const loadData = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)
    try {
      const result = await nektQuery(sql)
      if (requestId === requestIdRef.current) {
        setData([...result])
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [sql])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, loading, error, refresh: loadData }
}
