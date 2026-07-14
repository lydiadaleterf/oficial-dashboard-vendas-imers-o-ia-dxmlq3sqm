import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { session, loading, signOut } = useAuth()

  if (loading) return null

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/95 backdrop-blur px-4 lg:px-8 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold tracking-tight text-slate-900">
            Dashboard de Vendas — Imersão IA para CEOs
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
      </header>

      <main className="flex-1 w-full px-4 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
