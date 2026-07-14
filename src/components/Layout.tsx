import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { session, loading, signOut } = useAuth()

  if (loading) return null

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 font-semibold">
            <div className="bg-slate-900 p-1.5 rounded-md">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:inline-block">Imersão de IA para CEOs</span>
            <span className="sm:hidden">Dashboard</span>
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
