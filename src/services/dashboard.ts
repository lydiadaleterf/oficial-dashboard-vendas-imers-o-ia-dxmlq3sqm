import { supabase } from '@/lib/supabase/client'

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
  entradasSemVaga: TableEntradasRow[]
  agendamentosPendentes: TableAgendamentoRow[]
  isPartial: boolean
}

const isRefundStatus = (status: string) => status.includes('reembol') || status.includes('refund')

export const fetchDashboardData = async (): Promise<DashboardData> => {
  let isPartial = false

  const [
    diarioRes,
    agendamentoRes,
    funilRes,
    entradasRes,
    vendasRes,
    transacoesRes,
    skipDiarioRes,
  ] = await Promise.all([
    supabase.from('dashboard_diario_imersao').select('*').order('dia', { ascending: true }),
    supabase
      .from('vagas_fechadas_agendamento')
      .select('status_agendamento, nome, email')
      .order('data_agendamento', { ascending: false }),
    supabase.from('funil_skip_vs_lancamento_interno').select('*'),
    supabase
      .from('entradas_sem_vaga_hubspot')
      .select('nome, email, dt_entrada, link_hubspot, dealstage_nome')
      .order('dt_entrada', { ascending: false })
      .limit(50),
    supabase
      .from('vendas_vendedor_diario_imersao')
      .select('dia, vendedor, vendas')
      .order('dia', { ascending: false })
      .limit(100),
    supabase
      .from('transacoes_imersao_detalhado')
      .select('valor_pago, oferta, status, estado, is_vaga_fechada, email'),
    supabase
      .from('funil_skip_imersao_diario')
      .select('dia, vendas_skip, vendas_entrada')
      .gte('dia', '2026-06-24')
      .order('dia', { ascending: true }),
  ])

  if (
    diarioRes.error ||
    agendamentoRes.error ||
    funilRes.error ||
    entradasRes.error ||
    vendasRes.error ||
    transacoesRes.error ||
    skipDiarioRes.error
  ) {
    isPartial = true
  }

  let kpiVagas = 0,
    kpiReceita = 0
  const chartData: ChartDataPoint[] = []
  diarioRes.data?.forEach((row) => {
    kpiVagas += Number(row.vagas_fechadas || 0)
    kpiReceita += Number(row.receita_fechada || 0)
    chartData.push({
      dia: row.dia,
      entradas_realizadas: Number(row.entradas_realizadas || 0),
      vagas_fechadas: Number(row.vagas_fechadas || 0),
    })
  })

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

  const funnelMap = new Map<string, FunnelData>()
  funilRes.data?.forEach((row) => {
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
    fd.vendaProduto1 = Math.max(fd.vendaProduto1, Number(row.venda_produto1 || 0))
    fd.vendaEntrada = Math.max(fd.vendaEntrada, Number(row.venda_entrada || 0))
    fd.vagasFechadas = Math.max(fd.vagasFechadas, Number(row.vagas_fechadas || 0))
    fd.selfServiceQtd = Math.max(fd.selfServiceQtd, Number(row.self_service_qtd || 0))
    fd.selfServicePct = Math.max(fd.selfServicePct, Number(row.self_service_pct || 0))
    fd.vendedorPct = Math.max(fd.vendedorPct, Number(row.vendedor_pct || 0))
    const vendedorVendas = Number(row.vendas_do_vendedor || 0)
    fd.vendedorQtd += vendedorVendas
    if (row.vendedor && row.vendedor.trim() && row.vendedor !== 'NULL') {
      fd.sellers.push({ nome: row.vendedor, vendas: vendedorVendas })
    }
  })
  const funnels = Array.from(funnelMap.values())

  const skipDailyData = skipDiarioRes.data || []
  if (skipDailyData.length > 0) {
    const skipFunnel = funnels.find((f) => f.nome.toLowerCase().includes('skip'))
    if (skipFunnel) {
      skipFunnel.vendaProduto1 = skipDailyData.reduce(
        (sum, r) => sum + Number(r.vendas_skip || 0),
        0,
      )
      skipFunnel.vendaEntrada = skipDailyData.reduce(
        (sum, r) => sum + Number(r.vendas_entrada || 0),
        0,
      )
    }
  }

  let parcelado = 0,
    aVista = 0,
    refundCount = 0,
    refundValor = 0
  const geoEmailMap = new Map<string, Set<string>>()
  const vendaDireta = funnels.reduce((s, f) => s + f.vendedorQtd, 0)

  transacoesRes.data?.forEach((row) => {
    const valor = Number(row.valor_pago || 0)
    const status = (row.status || '').toLowerCase()
    if (isRefundStatus(status)) {
      refundCount++
      refundValor += valor
    } else if (valor >= 9000) {
      aVista++
    } else if (valor > 0) {
      parcelado++
    }
    if (row.is_vaga_fechada && row.email) {
      const estado = (row.estado || 'Não informado').trim()
      if (!geoEmailMap.has(estado)) geoEmailMap.set(estado, new Set())
      geoEmailMap.get(estado)!.add(row.email)
    }
  })

  const pmTotal = parcelado + aVista + vendaDireta
  const paymentMethods: PaymentMethodData = { parcelado, aVista, vendaDireta, total: pmTotal }
  const refunds: RefundData = { count: refundCount, valor: refundValor }
  const geoData: GeoDataPoint[] = Array.from(geoEmailMap.entries())
    .map(([estado, emails]) => ({ estado, count: emails.size }))
    .sort((a, b) => b.count - a.count)

  const sellerMap = new Map<string, number>()
  vendasRes.data?.forEach((row) => {
    sellerMap.set(row.vendedor, (sellerMap.get(row.vendedor) || 0) + Number(row.vendas || 0))
  })
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
    paymentMethods,
    refunds,
    geoData,
    sellerRanking,
    entradasSemVaga: entradasRes.data || [],
    agendamentosPendentes,
    isPartial,
  }
}
