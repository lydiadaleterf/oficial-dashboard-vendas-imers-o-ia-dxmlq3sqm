import { getFunnelLabel } from '@/lib/funnel-labels'

export type DrillDownType =
  | 'entradas'
  | 'vagas-fechadas'
  | 'receita'
  | 'entradas-pendentes'
  | 'reembolsos'
  | 'agendamento'

export interface DrillDownColumn {
  key: string
  label: string
  format?: 'currency' | 'date' | 'link'
  linkLabel?: string
}

export interface DrillDownConfig {
  title: string
  columns: DrillDownColumn[]
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

const COLUMNS = {
  nome: { key: 'nome', label: 'Nome' },
  email: { key: 'email', label: 'Email' },
  funil: { key: 'funil', label: 'Funil' },
  valorPago: { key: 'valor_pago', label: 'Valor Pago', format: 'currency' as const },
  oferta: { key: 'oferta', label: 'Oferta' },
  dataCompra: { key: 'data_compra', label: 'Data Compra', format: 'date' as const },
  dataVagaFechada: {
    key: 'data_vaga_fechada',
    label: 'Data Vaga Fechada',
    format: 'date' as const,
  },
  statusAgendamento: { key: 'status_agendamento', label: 'Status Agendamento' },
  status: { key: 'status', label: 'Status' },
  dtEntrada: { key: 'dt_entrada', label: 'Data Entrada', format: 'date' as const },
  dealstageNome: { key: 'dealstage_nome', label: 'Deal Stage' },
  linkGuru: {
    key: 'link_guru',
    label: 'Digital Guru',
    format: 'link' as const,
    linkLabel: 'Guru',
  },
  linkHubspot: {
    key: 'link_hubspot',
    label: 'HubSpot',
    format: 'link' as const,
    linkLabel: 'HubSpot',
  },
}

const COLUMN_SETS: Record<DrillDownType, DrillDownColumn[]> = {
  entradas: [
    COLUMNS.nome,
    COLUMNS.email,
    COLUMNS.valorPago,
    COLUMNS.oferta,
    COLUMNS.funil,
    COLUMNS.dataCompra,
    COLUMNS.linkGuru,
    COLUMNS.linkHubspot,
  ],
  'vagas-fechadas': [
    COLUMNS.nome,
    COLUMNS.email,
    COLUMNS.funil,
    COLUMNS.dataVagaFechada,
    COLUMNS.statusAgendamento,
    COLUMNS.linkGuru,
    COLUMNS.linkHubspot,
  ],
  receita: [
    COLUMNS.nome,
    COLUMNS.email,
    COLUMNS.valorPago,
    COLUMNS.oferta,
    COLUMNS.funil,
    COLUMNS.dataCompra,
    COLUMNS.linkGuru,
    COLUMNS.linkHubspot,
  ],
  'entradas-pendentes': [
    COLUMNS.nome,
    COLUMNS.email,
    COLUMNS.funil,
    COLUMNS.dtEntrada,
    COLUMNS.dealstageNome,
    COLUMNS.linkHubspot,
  ],
  reembolsos: [
    COLUMNS.nome,
    COLUMNS.email,
    COLUMNS.valorPago,
    COLUMNS.status,
    COLUMNS.dataCompra,
    COLUMNS.linkGuru,
    COLUMNS.linkHubspot,
  ],
  agendamento: [
    COLUMNS.nome,
    COLUMNS.email,
    COLUMNS.funil,
    COLUMNS.dataVagaFechada,
    COLUMNS.statusAgendamento,
    COLUMNS.linkGuru,
    COLUMNS.linkHubspot,
  ],
}

const TITLE_MAP: Record<DrillDownType, string> = {
  entradas: 'Entradas Aprovadas',
  'vagas-fechadas': 'Vagas Fechadas',
  receita: 'Receita Total',
  'entradas-pendentes': 'Entradas Pendentes',
  reembolsos: 'Reembolsos',
  agendamento: 'Agendamentos',
}

export function getDrillDownConfig(
  type: DrillDownType,
  selectedFunnels: string[] = [],
): DrillDownConfig {
  const suffix =
    selectedFunnels.length > 0
      ? ` — ${selectedFunnels.map((f) => getFunnelLabel(f)).join(', ')}`
      : ''
  return {
    title: `Detalhes: ${TITLE_MAP[type]}${suffix}`,
    columns: COLUMN_SETS[type] || [],
  }
}
