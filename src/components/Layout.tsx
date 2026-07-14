import { useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SidebarContent } from '@/components/Sidebar'

const SIDEBAR_WIDTH = 'lg:w-64 lg:shrink-0'

export default function Layout() {
  const { session, loading, signOut } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) return null

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:block fixed inset-y-0 left-0 w-64 z-40`}>
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className={`flex-1 flex flex-col min-w-0 ${SIDEBAR_WIDTH}`}>
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm">
          <Button variant="ghost" size="sm" onClick={() => setMobileOpen(true)} className="gap-2">
            <Menu className="h-5 w-5" />
            <span className="font-semibold text-sm">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="gap-2 text-slate-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline-block">Sair</span>
          </Button>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-30 h-14 items-center justify-end border-b bg-white/95 backdrop-blur px-6 shadow-sm">
          <span className="text-sm text-slate-500 mr-4">{session.user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="gap-2 text-slate-600"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 w-full px-4 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
