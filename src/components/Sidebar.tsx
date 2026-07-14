import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Sparkles, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/imersao-labs', label: 'Imersão Labs', icon: BarChart3 },
  { to: '/native', label: 'Native', icon: Sparkles },
]

interface SidebarContentProps {
  onNavigate?: () => void
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const location = useLocation()

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800">
        <div className="bg-teal-500 p-1.5 rounded-md">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-sm tracking-tight">Dashboard</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-teal-500/15 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-slate-800">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Dashboard de Vendas
          <br />
          Imersão IA para CEOs
        </p>
      </div>
    </div>
  )
}
