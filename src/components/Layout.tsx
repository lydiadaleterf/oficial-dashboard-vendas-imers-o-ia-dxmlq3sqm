import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Geral' },
  { to: '/imersao', label: 'Imersão Labs' },
  { to: '/adapta-native', label: 'Adapta Labs Native' },
]

export default function Layout() {
  const { session, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-slate-900">
              Dashboard BU Labs
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-slate-500">{session.user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="gap-2 text-slate-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
        <nav className="flex gap-1 px-4 lg:px-8 h-10 items-center border-t bg-slate-50/50 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 w-full px-4 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
