import { supabase } from '@/lib/supabase/client'

export type FunnelSelection = string[]

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
  geoData: GeoDataPoint[]
  sellerRanking: SellerRankingEntry[]
  sellerDailyData: SellerDailyEntry[]
  entradasSemVaga: TableEntradasRow[]
  agendamentosPendentes: TableAgendamentoRow[]
  isPartial: boolean
}

const isRefundStatus = (s: string) => s.includes('reembol') || s.includes('refund')

const safeNum = (val: unknown): number => {
  if (val === null || val === undefined || val === '' || val === 'null' || val === 'NULL') return 0
  const n = Number(val)
  return Number.isFinite(n) ? n : 0
}

export const fetchDashboardData = async (
  selectedFunnels: FunnelSelection = [],
  dateRange?: { startDate: string; endDate: string },
): Promise<DashboardData> => {
  let isPartial = false
  const ff = selectedFunnels.length > 0 ? selectedFunnels : undefined
  const applyFF = (q: any) => (ff ? q.in('funil', ff) : q)
  const applyFilters = (q: any, dateColumn?: string) => {
    let query = applyFF(q)
    if (dateColumn && dateRange) {
      if (dateRange.startDate) query = query.gte(dateColumn, dateRange.startDate)
      if (dateRange.endDate) query = query.lte(dateColumn, dateRange.endDate + 'T23:59:59')
    }
    return query
  }

  console.debug(
    '[Dashboard] selectedFunnels (technical/unaccented values):',
    JSON.stringify(selectedFunnels),
  )

  const [diarioRes, agendamentoRes, funilRes, entradasRes, vendasRes, transacoesRes] =
    await Promise.all([
      applyFilters(
        supabase.from('dashboard_diario_imersao').select('*').order('dia', { ascending: true }),
        'dia',
      ),
      applyFilters(
        supabase
          .from('vagas_fechadas_agendamento')
          .select('status_agendamento, nome, email')
          .order('data_agendamento', { ascending: false }),
        'data_agendamento',
      ),
      applyFilters(supabase.from('funil_skip_vs_lancamento_interno').select('*')),
      applyFilters(
        supabase
          .from('entradas_sem_vaga_hubspot')
          .select('nome, email, dt_entrada, link_hubspot, dealstage_nome')
          .order('dt_entrada', { ascending: false }),
        'dt_entrada',
      ),
      applyFilters(
        supabase
          .from('vendas_vendedor_diario_imersao')
          .select('dia, vendedor, vendas')
          .order('dia', { ascending: false }),
        'dia',
      ),
      applyFilters(
        supabase
          .from('transacoes_imersao_detalhado')
          .select('valor_pago, oferta, status, estado, is_vaga_fechada, email'),
        'data_compra',
      ),
    ])

  if (
    diarioRes.error ||
    agendamentoRes.error ||
    funilRes.error ||
    entradasRes.error ||
    vendasRes.error ||
    transacoesRes.error
  ) {
    isPartial = true
  }

  console.debug('=== RAW funil_skip_vs_lancamento_interno ===', JSON.stringify(funilRes.data))
  console.debug('=== RAW dashboard_diario_imersao (filtrado) ===', JSON.stringify(diarioRes.data))

  console.debug('[Dashboard] selectedFunnels:', selectedFunnels)
  console.debug('[Dashboard] diario rows count:', diarioRes.data?.length ?? 0)
  const distinctFunnels = [...new Set(diarioRes.data?.map((r) => r.funil).filter(Boolean) ?? [])]
  console.debug('[Dashboard] distinct funnels in diario data:', distinctFunnels)

  const diarioMap = new Map<string, ChartDataPoint>()
  diarioRes.data?.forEach((row) => {
    if (!row.dia) return
    if (!diarioMap.has(row.dia)) {
      diarioMap.set(row.dia, {
        dia: row.dia,
        entradas_realizadas: 0,
        vagas_fechadas: 0,
        receita_fechada: 0,
      })
    }
    const e = diarioMap.get(row.dia)!
    e.entradas_realizadas += safeNum(row.entradas_realizadas)
    e.vagas_fechadas += safeNum(row.vagas_fechadas)
    e.receita_fechada += safeNum(row.receita_fechada)
  })
  const chartData: ChartDataPoint[] = Array.from(diarioMap.values()).sort((a, b) =>
    a.dia.localeCompare(b.dia),
  )

  let taxaAgendamento = 0
  const agendamentosPendentes: TableAgendamentoRow[] = []
  const agData = agendamentoRes.data || []
  if (agData.length > 0) {
    const confirmed = agData.filter(
      (a) => a.status_agendamento?.toLowerCase() === 'confirmed',
    ).length
    taxaAgendamento = (confirmed / agData.length) * 100
    agData
      .filter((a) => a.status_agendamento?.toLowerCase() === 'nao_agendou')
      .forEach((a) =>
        agendamentosPendentes.push({
          nome: a.nome,
          email: a.email,
          status_agendamento: a.status_agendamento,
        }),
      )
  }

  const funilData = (funilRes.data || []).filter((r) => !ff || ff.includes(r.funil))
  const funnelMap = new Map<string, FunnelData>()
  funilData.forEach((row) => {
    const name = row.funil
    if (!funnelMap.has(name)) {
      funnelMap.set(name, {
        nome: name,
        vendaProduto1: 0,
        vendaEntrada: 0,
        vagasFechadas: 0,
        selfServiceQtd: 0,
        selfServicePct: 0,
        vendedorQtd: 0,
        vendedorPct: 0,
        sellers: [],
      })
    }
    const fd = funnelMap.get(name)!
    fd.vendaProduto1 = Math.max(fd.vendaProduto1, safeNum(row.venda_produto1))
    fd.vendaEntrada = Math.max(fd.vendaEntrada, safeNum(row.venda_entrada))
    fd.vagasFechadas = Math.max(fd.vagasFechadas, safeNum(row.vagas_fechadas))
    fd.selfServiceQtd = Math.max(fd.selfServiceQtd, safeNum(row.self_service_qtd))
    fd.selfServicePct = Math.max(fd.selfServicePct, safeNum(row.self_service_pct))
    fd.vendedorPct = Math.max(fd.vendedorPct, safeNum(row.vendedor_pct))
    fd.vendedorQtd = Math.max(fd.vendedorQtd, safeNum(row.vendedor_qtd))
    const vv = safeNum(row.vendas_do_vendedor)
    if (row.vendedor && row.vendedor.trim() && row.vendedor !== 'NULL') {
      fd.sellers.push({ nome: row.vendedor, vendas: vv })
    }
  })
  const funnels = Array.from(funnelMap.values())
  const kpiVagas = dateRange
    ? chartData.reduce((sum, d) => sum + d.vagas_fechadas, 0)
    : funnels.reduce((sum, f) => sum + f.vagasFechadas, 0)
  console.debug(
    '[Dashboard] KPI vagasFechadas from funil_skip_vs_lancamento_interno:',
    kpiVagas,
    'funnels:',
    funnels.length,
    funnels.map((f) => ({ nome: f.nome, vagasFechadas: f.vagasFechadas })),
  )

  let parcelado = 0,
    aVista = 0,
    refundCount = 0,
    refundValor = 0,
    kpiReceita = 0

  console.debug(
    '[Dashboard] aggregated receita from diario:',
    kpiReceita,
    'chartData points:',
    chartData.length,
  )
  const geoEmailMap = new Map<string, Set<string>>()
  const vendaDireta = funnels.reduce((s, f) => s + f.vendedorQtd, 0)
  transacoesRes.data?.forEach((row) => {
    const valor = safeNum(row.valor_pago)
    const status = (row.status || '').toLowerCase()
    if (isRefundStatus(status)) {
      refundCount++
      refundValor += valor
    } else {
      if (valor >= 9000) aVista++
      else if (valor > 0) parcelado++
      if (row.is_vaga_fechada) {
        kpiReceita += valor
      }
    }
    if (row.is_vaga_fechada && row.email) {
      const estado = (row.estado || 'Não informado').trim()
      if (!geoEmailMap.has(estado)) geoEmailMap.set(estado, new Set())
      geoEmailMap.get(estado)!.add(row.email)
    }
  })
  const pmTotal = parcelado + aVista + vendaDireta
  const geoData: GeoDataPoint[] = Array.from(geoEmailMap.entries())
    .map(([estado, emails]) => ({ estado, count: emails.size }))
    .sort((a, b) => b.count - a.count)

  const sellerDailyMap = new Map<string, SellerDailyEntry>()
  vendasRes.data?.forEach((row) => {
    const key = `${row.dia}|${row.vendedor}`
    if (!sellerDailyMap.has(key))
      sellerDailyMap.set(key, { dia: row.dia, vendedor: row.vendedor, vendas: 0 })
    sellerDailyMap.get(key)!.vendas += safeNum(row.vendas)
  })
  const sellerDailyData = Array.from(sellerDailyMap.values()).sort((a, b) => {
    if (a.dia !== b.dia) return b.dia.localeCompare(a.dia)
    return b.vendas - a.vendas
  })
  const sellerMap = new Map<string, number>()
  sellerDailyData.forEach((e) =>
    sellerMap.set(e.vendedor, (sellerMap.get(e.vendedor) || 0) + e.vendas),
  )
  const sellerRanking: SellerRankingEntry[] = Array.from(sellerMap.entries())
    .map(([vendedor, totalVendas]) => ({ vendedor, totalVendas }))
    .sort((a, b) => b.totalVendas - a.totalVendas)

  return {
    kpis: {
      vagasFechadas: kpiVagas,
      receitaFechada: kpiReceita,
      entradasPendentes: entradasRes.data?.length || 0,
      taxaAgendamento,
    },
    funnels,
    chartData,
    paymentMethods: { parcelado, aVista, vendaDireta, total: pmTotal },
    refunds: { count: refundCount, valor: refundValor },
    geoData,
    sellerRanking,
    sellerDailyData,
    entradasSemVaga: entradasRes.data || [],
    agendamentosPendentes,
    isPartial,
  }
}
