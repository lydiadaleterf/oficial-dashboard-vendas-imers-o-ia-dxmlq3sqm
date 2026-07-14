import { supabase } from '@/lib/supabase/client'

export interface KPIData {
  entradas: number
  vagasFechadas: number
  receitaFechada: number
  taxaAgendamento: number
}

export interface FunnelSellerInfo {
  nome: string
  vendas: number
}

export interface FunnelData {
  nome: string
  vendaEntrada: number
  vagasFechadas: number
  selfServiceQtd: number
  vendedorQtd: number
  sellers: FunnelSellerInfo[]
}

export interface ChartDataPoint {
  dia: string
  entradas_realizadas: number
  vagas_fechadas: number
}

export interface TableEntradasRow {
  nome: string | null
  email: string
  dt_entrada: string | null
  link_hubspot: string | null
}

export interface TableAgendamentoRow {
  nome: string | null
  email: string
  status_agendamento: string | null
}

export interface TableVendasRow {
  dia: string
  vendedor: string
  vendas: number | null
}

export interface DashboardData {
  kpis: KPIData
  funnels: FunnelData[]
  chartData: ChartDataPoint[]
  entradasSemVaga: TableEntradasRow[]
  agendamentosPendentes: TableAgendamentoRow[]
  vendasPorVendedor: TableVendasRow[]
  isPartial: boolean
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  let isPartial = false

  // 1. KPIs & Chart from dashboard_diario_imersao
  const { data: diarioData, error: errDiario } = await supabase
    .from('dashboard_diario_imersao')
    .select('*')
    .order('dia', { ascending: true })

  if (errDiario) isPartial = true

  let kpiEntradas = 0
  let kpiVagas = 0
  let kpiReceita = 0
  const chartData: ChartDataPoint[] = []

  if (diarioData) {
    diarioData.forEach((row) => {
      kpiEntradas += Number(row.entradas_realizadas || 0)
      kpiVagas += Number(row.vagas_fechadas || 0)
      kpiReceita += Number(row.receita_fechada || 0)
      chartData.push({
        dia: row.dia,
        entradas_realizadas: Number(row.entradas_realizadas || 0),
        vagas_fechadas: Number(row.vagas_fechadas || 0),
      })
    })
  }

  // 2. Agendamento Stats
  const { data: agendamentoData, error: errAgendamento } = await supabase
    .from('vagas_fechadas_agendamento')
    .select('status_agendamento, nome, email')
    .order('data_agendamento', { ascending: false })

  if (errAgendamento) isPartial = true

  let taxaAgendamento = 0
  const agendamentosPendentes: TableAgendamentoRow[] = []

  if (agendamentoData && agendamentoData.length > 0) {
    const total = agendamentoData.length
    const confirmed = agendamentoData.filter(
      (a) => a.status_agendamento?.toLowerCase() === 'confirmed',
    ).length
    taxaAgendamento = (confirmed / total) * 100

    agendamentoData
      .filter((a) => a.status_agendamento?.toLowerCase() === 'nao_agendou')
      .forEach((a) => {
        agendamentosPendentes.push({
          nome: a.nome,
          email: a.email,
          status_agendamento: a.status_agendamento,
        })
      })
  }

  // 3. Funnel Data
  const { data: funilDataRaw, error: errFunil } = await supabase
    .from('funil_skip_vs_lancamento_interno')
    .select('*')

  if (errFunil) isPartial = true

  const funnelMap = new Map<string, FunnelData>()

  if (funilDataRaw) {
    funilDataRaw.forEach((row) => {
      const funilName = row.funil
      if (!funnelMap.has(funilName)) {
        funnelMap.set(funilName, {
          nome: funilName,
          vendaEntrada: 0,
          vagasFechadas: 0,
          selfServiceQtd: 0,
          vendedorQtd: 0,
          sellers: [],
        })
      }
      const fd = funnelMap.get(funilName)!
      // We assume each row brings unique partial values or duplicates that need careful handling.
      // Based on typical schemas with composite PKs, values might be distributed.
      // We will sum them up. If they are pre-aggregated per funnel across rows, we might overcount.
      // To be safe against overcounting on duplicated global totals, we will use MAX for funnel-wide metrics if they seem repeated,
      // but SUM for seller specific ones. Let's just SUM everything for simplicity as per standard reporting unless data is weird.

      // Usually venda_entrada is total for funnel, we might just take the max if it's repeated.
      fd.vendaEntrada = Math.max(fd.vendaEntrada, Number(row.venda_entrada || 0))
      fd.vagasFechadas = Math.max(fd.vagasFechadas, Number(row.vagas_fechadas || 0))
      fd.selfServiceQtd = Math.max(fd.selfServiceQtd, Number(row.self_service_qtd || 0))

      // Seller specific
      const vendedorVendas = Number(row.vendas_do_vendedor || 0)
      fd.vendedorQtd += vendedorVendas

      if (row.vendedor && row.vendedor !== 'NULL' && row.vendedor.trim() !== '') {
        fd.sellers.push({
          nome: row.vendedor,
          vendas: vendedorVendas,
        })
      }
    })
  }

  const funnels = Array.from(funnelMap.values())

  // 4. Entradas sem Vaga
  const { data: entradasRaw, error: errEntradas } = await supabase
    .from('entradas_sem_vaga_hubspot')
    .select('nome, email, dt_entrada, link_hubspot')
    .order('dt_entrada', { ascending: false })
    .limit(50)

  if (errEntradas) isPartial = true

  // 5. Vendas por Vendedor Diário
  const { data: vendasVendedorRaw, error: errVendedor } = await supabase
    .from('vendas_vendedor_diario_imersao')
    .select('dia, vendedor, vendas')
    .order('dia', { ascending: false })
    .limit(50)

  if (errVendedor) isPartial = true

  return {
    kpis: {
      entradas: kpiEntradas,
      vagasFechadas: kpiVagas,
      receitaFechada: kpiReceita,
      taxaAgendamento,
    },
    funnels,
    chartData,
    entradasSemVaga: entradasRaw || [],
    agendamentosPendentes,
    vendasPorVendedor: vendasVendedorRaw || [],
    isPartial,
  }
}
