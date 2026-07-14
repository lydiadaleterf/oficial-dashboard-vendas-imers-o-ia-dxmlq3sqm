import { useState, useMemo } from 'react'
import { GeoDataPoint } from '@/services/dashboard'
import { BRAZIL_STATES, normalizeStateCode } from './brazil-states'

interface BrazilMapProps {
  geoData: GeoDataPoint[]
}

function getStateColor(count: number, maxCount: number): string {
  if (count === 0 || maxCount === 0) return '#e2e8f0'
  const ratio = Math.log(count + 1) / Math.log(maxCount + 1)
  const r = Math.round(204 + (13 - 204) * ratio)
  const g = Math.round(251 + (148 - 251) * ratio)
  const b = Math.round(241 + (136 - 241) * ratio)
  return `rgb(${r}, ${g}, ${b})`
}

const LEGEND_COLORS = ['#e2e8f0', '#ccfbf1', '#5eead4', '#14b8a6', '#0d9488']

export function BrazilMap({ geoData }: BrazilMapProps) {
  const [hovered, setHovered] = useState<{ code: string; name: string; count: number } | null>(null)

  const dataMap = useMemo(() => {
    const map = new Map<string, number>()
    geoData.forEach(({ estado, count }) => {
      const code = normalizeStateCode(estado)
      if (code) {
        map.set(code, (map.get(code) || 0) + count)
      }
    })
    return map
  }, [geoData])

  const maxCount = useMemo(() => Math.max(1, ...dataMap.values()), [dataMap])

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 500 500" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {BRAZIL_STATES.map((state) => {
          const count = dataMap.get(state.code) || 0
          const fill = getStateColor(count, maxCount)
          const isHovered = hovered?.code === state.code
          return (
            <path
              key={state.code}
              d={state.path}
              fill={fill}
              stroke="#fff"
              strokeWidth={isHovered ? 2 : 1}
              className="cursor-pointer transition-all duration-200"
              style={isHovered ? { filter: 'brightness(1.15)' } : undefined}
              onMouseEnter={() => setHovered({ code: state.code, name: state.name, count })}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}
      </svg>
      {hovered && (
        <div className="absolute top-0 left-0 pointer-events-none bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-20">
          <div className="font-semibold">{hovered.name}</div>
          <div className="text-teal-300">
            {hovered.count} vaga{hovered.count !== 1 ? 's' : ''} fechada
            {hovered.count !== 1 ? 's' : ''}
          </div>
        </div>
      )}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-500">
        <span>0</span>
        <div className="flex h-3 w-32 rounded-full overflow-hidden border border-slate-200">
          {LEGEND_COLORS.map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <span>{maxCount}</span>
      </div>
    </div>
  )
}
