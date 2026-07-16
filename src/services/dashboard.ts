import { nektQuery, NEKT_QUERIES } from '@/services/nekt'

export type FunnelSelection = string[]

export interface DateRange {
  startDate: string
  endDate: string
}

export interface KPIData {
  vagasFechadas: number
  receitaFechada: number
  entradasPendentes: number
  taxaAgendamento: number
}

export interface FunnelSellerInfo {
  nome: string
  vendas: number
}

export interface FunnelData {
  nome: string
  vendaProduto1: number
  vendaEntrada: number
  vagasFechadas: number
  selfServiceQtd: number
  selfServicePct: number
  vendedorQtd: number
  vendedorPct: number
  sellers: FunnelSellerInfo[]
  taxaAgendamento: number
}

export interface ChartDataPoint {
  dia: string
  entradas_realizadas: number
  vagas_fechadas: number
  receita_fechada: number
}

export interface PaymentMethodData {
  parcelado: number
  aVista: number
  vendaDireta: number
  total: number
}

export interface RefundData {
  count: number
  valor: number
}

export interface PagamentosIntegraisData {
  count: number
  valor: number
}

export interface GeoDataPoint {
  estado: string
  count: number
}

export interface SellerRankingEntry {
  vendedor: string
  totalVendas: number
}

export interface SellerDailyEntry {
  dia: string
  vendedor: string
  vendas: number
}

export interface TableEntradasRow {
  nome: string | null
  email: string
  dt_entrada: string | null
  link_hubspot: string | null
  dealstage_nome: string | null
}

export interface TableAgendamentoRow {
  nome: string | null
  email: string
  status_agendamento: string | null
}

export interface DashboardData {
  kpis: KPIData
  funnels: FunnelData[]
  chartData: ChartDataPoint[]
  paymentMethods: PaymentMethodData
  refunds: RefundData
  pagamentosIntegrais: PagamentosIntegraisData
  geoData: GeoDataPoint[]
  sellerRanking: SellerRankingEntry[]
  sellerDailyData: SellerDailyEntry[]
  entradasSemVaga: TableEntradasRow[]
  agendamentosPendentes: TableAgendamentoRow[]
  isPartial: boolean
}

export interface RawDashboardData {
  diario: Record<string, any>[]
  vagasFechadas: Record<string, any>[]
  funil: Record<string, any>[]
  entradasSemVaga: Record<string, any>[]
  vendasVendedor: Record<string, any>[]
  transacoes: Record<string, any>[]
}

export interface FetchResult {
  data: RawDashboardData
  isPartial: boolean
}

export async function fetchAllDashboardData(): Promise<FetchResult> {
  const results = await Promise.allSettled([
    nektQuery(NEKT_QUERIES.DASHBOARD_DIARIO),
    nektQuery(NEKT_QUERIES.VAGAS_FECHADAS),
    nektQuery(NEKT_QUERIES.FUNIL_SKIP_LANCAMENTO),
    nektQuery(NEKT_QUERIES.ENTRADAS_SEM_VAGA),
    nektQuery(NEKT_QUERIES.VENDAS_VENDEDOR_DIARIO),
    nektQuery(NEKT_QUERIES.TRANSACOES_DETALHADO),
  ])

  const getData = (r: PromiseSettledResult<Record<string, any>[]>) =>
    r.status === 'fulfilled' ? r.value : []

  return {
    data: {
      diario: getData(results[0]),
      vagasFechadas: getData(results[1]),
      funil: getData(results[2]),
      entradasSemVaga: getData(results[3]),
      vendasVendedor: getData(results[4]),
      transacoes: getData(results[5]),
    },
    isPartial: results.some((r) => r.status === 'rejected'),
  }
}

export { processDashboardData, fetchDashboardData } from '@/services/dashboard-engine'
