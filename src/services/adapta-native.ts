import { supabase } from '@/lib/supabase/client'

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
  dailySales: AdaptaDailySales[]
}

function aggregateLeads(leads: AdaptaLead[], field: keyof AdaptaLead): LeadDistributionItem[] {
  const map = new Map<string, number>()
  leads.forEach((lead) => {
    const val = (lead[field] as string) || 'Não informado'
    map.set(val, (map.get(val) || 0) + 1)
  })
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchAdaptaNativeData(): Promise<AdaptaNativeData> {
  const [leadsRes, salesRes] = await Promise.all([
    (supabase as any).from('adapta_case_leads_hubspot').select('*'),
    (supabase as any)
      .from('adapta_summit_vendas_diario')
      .select('*')
      .order('dia', { ascending: true }),
  ])

  const leads: AdaptaLead[] = leadsRes.data || []
  const dailySales: AdaptaDailySales[] = salesRes.data || []

  return {
    totalLeads: leads.length,
    leadsByOrigemPrimaria: aggregateLeads(leads, 'origem_primaria'),
    leadsByOrigemSecundaria: aggregateLeads(leads, 'origem_secundaria'),
    leadsByUtmSource: aggregateLeads(leads, 'utm_source'),
    dailySales,
  }
}
