import { Construction, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Native() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="max-w-md w-full shadow-subtle border-dashed border-2 border-slate-200">
        <CardContent className="flex flex-col items-center text-center py-16 px-8">
          <div className="bg-slate-100 p-5 rounded-full mb-6 relative">
            <Construction className="h-14 w-14 text-slate-400" />
            <Sparkles className="h-5 w-5 text-teal-500 absolute -top-1 -right-1" />
          </div>
          <h1 className="text-2xl font-bold text-slate-700 mb-3">Em Breve</h1>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            A seção Native está em construção. Em breve você poderá acompanhar novos produtos por
            aqui.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Desenvolvimento em andamento
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
