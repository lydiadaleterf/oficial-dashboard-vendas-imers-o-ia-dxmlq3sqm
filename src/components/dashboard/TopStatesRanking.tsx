import { useMemo } from 'react'
import { GeoDataPoint } from '@/services/dashboard'
import { normalizeStateCode, getStateName } from './brazil-states'

interface TopStatesRankingProps {
  geoData: GeoDataPoint[]
}

export function TopStatesRanking({ geoData }: TopStatesRankingProps) {
  const topStates = useMemo(() => {
    const map = new Map<string, number>()
    geoData.forEach(({ estado, count }) => {
      const code = normalizeStateCode(estado)
      if (code) {
        map.set(code, (map.get(code) || 0) + count)
      }
    })
    return Array.from(map.entries())
      .map(([code, count]) => ({ code, name: getStateName(code), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [geoData])

  if (topStates.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-2">Sem dados</p>
  }

  return (
    <div className="space-y-1.5">
      {topStates.map((state, i) => (
        <div key={state.code} className="flex items-center gap-2 text-sm">
          <span className="text-slate-400 font-medium w-5">{i + 1}º</span>
          <span className="text-slate-700 font-medium flex-1 truncate">{state.name}</span>
          <span className="text-teal-600 font-bold">{state.count}</span>
        </div>
      ))}
    </div>
  )
}
