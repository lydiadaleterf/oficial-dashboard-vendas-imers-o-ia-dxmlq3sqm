import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, Activity, BarChart3, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/imersao-labs', label: 'Imersão Labs', icon: BarChart3 },
  { to: '/adapta-labs-native', label: 'Adapta Labs Native', icon: Sparkles },
]

export default function Layout() {
  const { session, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-semibold">
              <div className="bg-slate-900 p-1.5 rounded-md">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:inline-block">Dashboard</span>
            </div>
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                      isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline-block">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 hidden md:block">{session.user.email}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="gap-2 text-slate-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Sair</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1 w-full mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </div>
    </main>
  )
}
