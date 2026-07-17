import { supabase } from '@/lib/supabase/client'
import { mapStageIdToName } from '@/lib/stage-mapping'
import type { DateRange } from '@/services/dashboard'

export type { DateRange }

export interface AdaptaLead {
  deal_id: string
  origem_primaria: string | null
  origem_secundaria: string | null
  utm_source: string | null
  dealstage: string | null
  data_criacao: string | null
}

export interface AdaptaDailySales {
  dia: string
  oferta: string | null
  status: string | null
  vendas: number | null
  receita: number | null
}

export interface LeadDistributionItem {
  label: string
  count: number
}

export interface AdaptaNativeData {
  totalLeads: number
  leadsByOrigemPrimaria: LeadDistributionItem[]
  leadsByOrigemSecundaria: LeadDistributionItem[]
  leadsByUtmSource: LeadDistributionItem[]
  leadsByDealStage: LeadDistributionItem[]
  dailySales: AdaptaDailySales[]
  rawLeads: AdaptaLead[]
}

function aggregateLeads(leads: AdaptaLead[], field: keyof AdaptaLead): LeadDistributionItem[] {
  const map = new Map<string, number>()
  leads.forEach((lead) => {
    const rawVal = (lead[field] as string) || ''
    const label = field === 'dealstage' ? mapStageIdToName(rawVal) : rawVal || 'Não informado'
    map.set(label, (map.get(label) || 0) + 1)
  })
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

function filterLeadsByDate(leads: AdaptaLead[], dateRange?: DateRange): AdaptaLead[] {
  if (!dateRange) return leads
  const { startDate, endDate } = dateRange
  return leads.filter((lead) => {
    if (!lead.data_criacao) return false
    const leadDate = lead.data_criacao.slice(0, 10)
    return leadDate >= startDate && leadDate <= endDate
  })
}

function filterSalesByDate(sales: AdaptaDailySales[], dateRange?: DateRange): AdaptaDailySales[] {
  if (!dateRange) return sales
  const { startDate, endDate } = dateRange
  return sales.filter((sale) => {
    if (!sale.dia) return false
    const saleDate = sale.dia.slice(0, 10)
    return saleDate >= startDate && saleDate <= endDate
  })
}

export async function fetchAdaptaNativeData(dateRange?: DateRange): Promise<AdaptaNativeData> {
  const [leadsRes, salesRes] = await Promise.all([
    (supabase as any).from('adapta_case_leads_hubspot').select('*'),
    (supabase as any)
      .from('adapta_summit_vendas_diario')
      .select('*')
      .order('dia', { ascending: true }),
  ])

  const allLeads: AdaptaLead[] = leadsRes.data || []
  const allSales: AdaptaDailySales[] = salesRes.data || []

  const leads = filterLeadsByDate(allLeads, dateRange)
  const dailySales = filterSalesByDate(allSales, dateRange)

  return {
    totalLeads: leads.length,
    leadsByOrigemPrimaria: aggregateLeads(leads, 'origem_primaria'),
    leadsByOrigemSecundaria: aggregateLeads(leads, 'origem_secundaria'),
    leadsByUtmSource: aggregateLeads(leads, 'utm_source'),
    leadsByDealStage: aggregateLeads(leads, 'dealstage'),
    dailySales,
    rawLeads: leads,
  }
}
