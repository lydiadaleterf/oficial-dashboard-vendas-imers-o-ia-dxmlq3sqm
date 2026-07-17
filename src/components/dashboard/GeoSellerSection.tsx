import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GeoBarChart } from '@/components/dashboard/GeoBarChart'
import { SellerDailyStackedChart } from '@/components/dashboard/SellerDailyStackedChart'
import { GeoDataPoint, SellerDailyEntry } from '@/services/dashboard'
import { MapPin } from 'lucide-react'

interface GeoSellerSectionProps {
  geoData: GeoDataPoint[]
  sellerDailyData: SellerDailyEntry[]
}

export function GeoSellerSection({ geoData, sellerDailyData }: GeoSellerSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <SellerDailyStackedChart data={sellerDailyData} />
      <Card className="shadow-subtle border-slate-200 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Distribuição Geográfica
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">Vagas fechadas por estado (ranking)</p>
        </CardHeader>
        <CardContent className="flex-1">
          {geoData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
              <MapPin className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">Sem dados disponíveis</p>
              <p className="text-xs mt-1">
                Não há registros geográficos para o período selecionado.
              </p>
            </div>
          ) : (
            <GeoBarChart geoData={geoData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
