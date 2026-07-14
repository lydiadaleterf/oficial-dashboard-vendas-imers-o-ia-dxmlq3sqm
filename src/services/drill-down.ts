import { supabase } from '@/lib/supabase/client'

export type DrillDownType = 'vagas-fechadas' | 'receita' | 'entradas-pendentes' | 'reembolsos'

export interface DrillDownColumn {
  key: string
  label: string
  format?: 'currency' | 'date'
}

export interface DrillDownResult {
  title: string
  columns: DrillDownColumn[]
  records: Record<string, any>[]
}

function withFunnelFilter(query: any, funnelNames: string[] | null): any {
  if (funnelNames && funnelNames.length > 0) {
    return query.in('funil', funnelNames)
  }
  return query
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

export function formatCellValue(val: any, format?: 'currency' | 'date'): string {
  if (val === null || val === undefined) return '-'
  if (format === 'currency') return formatCurrency(val)
  if (format === 'date') return formatDate(val)
  return String(val)
}

export async function fetchDrillDownData(
  type: DrillDownType,
  funnelNames?: string[] | null,
): Promise<DrillDownResult> {
  const filter = funnelNames && funnelNames.length > 0 ? funnelNames : null

  switch (type) {
    case 'vagas-fechadas': {
      let q = supabase
        .from('vagas_fechadas_agendamento')
        .select('nome, email, data_vaga_fechada, status_agendamento')
      q = withFunnelFilter(q, filter)
      const { data } = await q.order('data_vaga_fechada', { ascending: false }).limit(200)
      return {
        title: 'Vagas Fechadas — Detalhamento',
        columns: [
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'data_vaga_fechada', label: 'Data Vaga Fechada', format: 'date' as const },
          { key: 'status_agendamento', label: 'Status Agendamento' },
        ],
        records: data || [],
      }
    }
    case 'receita': {
      let q = supabase
        .from('transacoes_imersao_detalhado')
        .select('nome, email, valor_pago, oferta, data_compra')
        .eq('is_vaga_fechada', true)
      q = withFunnelFilter(q, filter)
      const { data } = await q.order('data_compra', { ascending: false }).limit(200)
      return {
        title: 'Receita Total — Detalhamento',
        columns: [
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'valor_pago', label: 'Valor Pago', format: 'currency' as const },
          { key: 'oferta', label: 'Oferta' },
          { key: 'data_compra', label: 'Data Compra', format: 'date' as const },
        ],
        records: data || [],
      }
    }
    case 'entradas-pendentes': {
      let q = supabase
        .from('entradas_sem_vaga_hubspot')
        .select('nome, email, dt_entrada, dealstage_nome')
      q = withFunnelFilter(q, filter)
      const { data } = await q.order('dt_entrada', { ascending: false }).limit(200)
      return {
        title: 'Entradas Pendentes — Detalhamento',
        columns: [
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'dt_entrada', label: 'Data Entrada', format: 'date' as const },
          { key: 'dealstage_nome', label: 'Deal Stage' },
        ],
        records: data || [],
      }
    }
    case 'reembolsos': {
      let q = supabase
        .from('transacoes_imersao_detalhado')
        .select('nome, email, valor_pago, status, data_compra')
        .ilike('status', '%reembol%')
      q = withFunnelFilter(q, filter)
      const { data } = await q.order('data_compra', { ascending: false }).limit(200)
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
