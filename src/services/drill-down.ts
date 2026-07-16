import { supabase } from '@/lib/supabase/client'
import { getFunnelLabel } from '@/lib/funnel-labels'

export type DrillDownType = 'vagas-fechadas' | 'receita' | 'entradas-pendentes' | 'reembolsos'

export interface DrillDownColumn {
  key: string
  label: string
  format?: 'currency' | 'date' | 'link'
}

export interface DrillDownResult {
  title: string
  columns: DrillDownColumn[]
  records: Record<string, any>[]
}

function formatDate(val: any): string {
  if (!val) return '-'
  try {
    const d = typeof val === 'string' ? val : new Date(val).toISOString()
    const [y, m, day] = d.substring(0, 10).split('-')
    return `${day}/${m}/${y}`
  } catch {
    return String(val)
  }
}

function formatCurrency(val: any): string {
  const num = Number(val || 0)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatCellValue(val: any, format?: 'currency' | 'date' | 'link'): string {
  if (val === null || val === undefined) return '-'
  if (format === 'currency') return formatCurrency(val)
  if (format === 'date') return formatDate(val)
  if (format === 'link') return String(val)
  return String(val)
}

export const VAGAS_FECHADAS_COLUMNS: DrillDownColumn[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'doc', label: 'Documento' },
  { key: 'funil', label: 'Funil' },
  { key: 'data_vaga_fechada', label: 'Data Vaga Fechada', format: 'date' },
  { key: 'link_guru', label: 'Link Guru', format: 'link' },
  { key: 'status_agendamento', label: 'Status Agendamento' },
]

export function filterVagasFechadas(
  records: Record<string, any>[],
  selectedFunnels: string[],
): Record<string, any>[] {
  if (!selectedFunnels || selectedFunnels.length === 0) {
    return records
  }
  return records.filter((r) => {
    const funil = r?.funil
    if (!funil || funil === '') return false
    return selectedFunnels.includes(funil)
  })
}

export async function fetchDrillDownData(
  type: DrillDownType,
  selectedFunnels: string[] = [],
): Promise<DrillDownResult> {
  const funnelLabelSuffix =
    selectedFunnels.length > 0
      ? ` — ${selectedFunnels.map((f) => getFunnelLabel(f)).join(', ')}`
      : ''

  switch (type) {
    case 'vagas-fechadas': {
      let query = supabase
        .from('vagas_fechadas_agendamento')
        .select('nome, email, funil, data_vaga_fechada, status_agendamento')

      if (selectedFunnels.length > 0) {
        query = query.in('funil', selectedFunnels)
      }

      const { data } = await query.order('data_vaga_fechada', { ascending: false })
      return {
        title: 'Vagas Fechadas — Detalhamento' + funnelLabelSuffix,
        columns: [
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'funil', label: 'Funil' },
          { key: 'data_vaga_fechada', label: 'Data Vaga Fechada', format: 'date' as const },
          { key: 'status_agendamento', label: 'Status Agendamento' },
        ],
        records: data || [],
      }
    }
    case 'receita': {
      let query = supabase
        .from('transacoes_imersao_detalhado')
        .select('nome, email, valor_pago, oferta, data_compra, funil, status')
        .eq('is_vaga_fechada', true)
        .not('status', 'ilike', '%reembol%')
        .not('status', 'ilike', '%refund%')

      if (selectedFunnels.length > 0) {
        query = query.in('funil', selectedFunnels)
      }

      const { data } = await query.order('data_compra', { ascending: false })
      return {
        title: 'Receita Total — Detalhamento' + funnelLabelSuffix,
        columns: [
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'valor_pago', label: 'Valor Pago', format: 'currency' as const },
          { key: 'oferta', label: 'Oferta' },
          { key: 'funil', label: 'Funil' },
          { key: 'data_compra', label: 'Data Compra', format: 'date' as const },
        ],
        records: data || [],
      }
    }
    case 'entradas-pendentes': {
      let query = supabase
        .from('entradas_sem_vaga_hubspot')
        .select('nome, email, dt_entrada, dealstage_nome, funil')

      if (selectedFunnels.length > 0) {
        query = query.in('funil', selectedFunnels)
      }

      const { data } = await query.order('dt_entrada', { ascending: false })
      return {
        title: 'Entradas Pendentes — Detalhamento' + funnelLabelSuffix,
        columns: [
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'funil', label: 'Funil' },
          { key: 'dt_entrada', label: 'Data Entrada', format: 'date' as const },
          { key: 'dealstage_nome', label: 'Deal Stage' },
        ],
        records: data || [],
      }
    }
    case 'reembolsos': {
      const { data } = await supabase
        .from('transacoes_imersao_detalhado')
        .select('nome, email, valor_pago, status, data_compra')
        .ilike('status', '%reembol%')
        .order('data_compra', { ascending: false })
      return {
        title: 'Reembolsos — Detalhamento',
        columns: [
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'valor_pago', label: 'Valor Pago', format: 'currency' as const },
          { key: 'status', label: 'Status' },
          { key: 'data_compra', label: 'Data Compra', format: 'date' as const },
        ],
        records: data || [],
      }
    }
  }
}
