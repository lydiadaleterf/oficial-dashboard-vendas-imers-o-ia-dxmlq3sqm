import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction } from 'lucide-react'

export default function AdaptaNative() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="max-w-md w-full shadow-subtle border-slate-200 bg-card">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-amber-50 rounded-full">
              <Construction className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-slate-800">Em Construção</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-slate-500">
            Esta página está sendo preparada para o lançamento do Adapta Summit.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
