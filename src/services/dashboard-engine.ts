import { fetchAllDashboardData } from '@/services/dashboard'
import type {
  DashboardData,
  FunnelData,
  FunnelSelection,
  DateRange,
  RawDashboardData,
  ChartDataPoint,
  TableAgendamentoRow,
  TableEntradasRow,
  SellerDailyEntry,
  SellerRankingEntry,
  GeoDataPoint,
} from '@/services/dashboard'

const safeNum = (val: unknown): number => {
  if (val === null || val === undefined || val === '' || val === 'null' || val === 'NULL') return 0
  const n = Number(val)
  return Number.isFinite(n) ? n : 0
}

const normalizeFunil = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const isRefundStatus = (s: string) => s.includes('reembol') || s.includes('refund')
const isVagaFechada = (v: any) => v === true || v === 'true' || v === 1 || v === '1'

const SCHEDULED_STATUSES = ['confirmed', 'agendado', 'scheduled', 'confirmado']
const UNSCHEDULED_STATUSES = ['nao_agendou', 'nao_agendado', 'not_scheduled', 'no_show']
const FULL_PAYMENT_THRESHOLD = 9000

function parseDate(val: unknown): string | null {
  if (!val) return null
  const s = String(val).trim()
  if (!s || s.toLowerCase() === 'null' || s.toLowerCase() === 'none') return null
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10)
  const brMatch = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`
  const tsMatch = s.match(/^(\d{4})\/(\d{2})\/(\d{2})/)
  if (tsMatch) return `${tsMatch[1]}-${tsMatch[2]}-${tsMatch[3]}`
  return null
}

function filterByDate(
  rows: Record<string, any>[],
  col: string,
  dateRange?: DateRange,
): Record<string, any>[] {
  if (!dateRange) return rows
  return rows.filter((r) => {
    const date = parseDate(r[col])
    if (!date) return false
    if (dateRange.startDate && date < dateRange.startDate) return false
    if (dateRange.endDate && date > dateRange.endDate) return false
    return true
  })
}

function filterByFunnels(rows: Record<string, any>[], ff: string[]): Record<string, any>[] {
  if (!ff || ff.length === 0) return rows
  return rows.filter((r) => ff.includes(r.funil))
}

export function processDashboardData(
  raw: RawDashboardData,
  selectedFunnels: FunnelSelection = [],
  dateRange?: DateRange,
  isPartial = false,
): DashboardData {
  const ff = selectedFunnels.length > 0 ? selectedFunnels : []

  const diario = filterByFunnels(filterByDate(raw.diario, 'dia', dateRange), ff)
  const vagasFechadas = filterByFunnels(
    filterByDate(raw.vagasFechadas, 'data_vaga_fechada', dateRange),
    ff,
  )
  const funilRaw = filterByFunnels(raw.funil, ff)
  const entradasSemVaga = filterByFunnels(
    filterByDate(raw.entradasSemVaga, 'dt_entrada', dateRange),
    ff,
  )
  const vendasVendedor = filterByFunnels(filterByDate(raw.vendasVendedor, 'dia', dateRange), ff)
  const transacoes = filterByFunnels(filterByDate(raw.transacoes, 'data_compra', dateRange), ff)

  const diarioMap = new Map<string, ChartDataPoint>()
  diario.forEach((row) => {
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
  if (vagasFechadas.length > 0) {
    const relevant = vagasFechadas.filter((a) => {
      const s = (a.status_agendamento || '').toLowerCase()
      return SCHEDULED_STATUSES.includes(s) || UNSCHEDULED_STATUSES.includes(s)
    })
    const scheduled = relevant.filter((a) =>
      SCHEDULED_STATUSES.includes((a.status_agendamento || '').toLowerCase()),
    ).length
    taxaAgendamento = relevant.length > 0 ? (scheduled / relevant.length) * 100 : 0
    vagasFechadas
      .filter((a) => UNSCHEDULED_STATUSES.includes((a.status_agendamento || '').toLowerCase()))
      .forEach((a) =>
        agendamentosPendentes.push({
          nome: a.nome,
          email: a.email,
          status_agendamento: a.status_agendamento,
        }),
      )
  }

  const funnelMap = new Map<string, FunnelData>()
  funilRaw.forEach((row) => {
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
        taxaAgendamento: 0,
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
    if (row.vendedor && row.vendedor.trim() && row.vendedor !== 'NULL') {
      fd.sellers.push({ nome: row.vendedor, vendas: safeNum(row.vendas_do_vendedor) })
    }
  })
  const funnels = Array.from(funnelMap.values())

  let parcelado = 0,
    aVista = 0,
    refundCount = 0,
    refundValor = 0,
    kpiReceita = 0
  let pagamentosIntegraisCount = 0,
    pagamentosIntegraisValor = 0
  const fullPaymentByFunil = new Map<string, { count: number; valor: number }>()
  const geoEmailMap = new Map<string, Set<string>>()
  const vendaDireta = funnels.reduce((s, f) => s + f.vendedorQtd, 0)

  transacoes.forEach((row) => {
    const valor = safeNum(row.valor_pago)
    const status = (row.status || '').toLowerCase()
    if (isRefundStatus(status)) {
      refundCount++
      refundValor += valor
    } else {
      if (valor >= FULL_PAYMENT_THRESHOLD) {
        aVista++
        if (isVagaFechada(row.is_vaga_fechada)) {
          pagamentosIntegraisCount++
          pagamentosIntegraisValor += valor
          const fn = row.funil || 'Unknown'
          const ex = fullPaymentByFunil.get(fn) || { count: 0, valor: 0 }
          ex.count++
          ex.valor += valor
          fullPaymentByFunil.set(fn, ex)
        }
      } else if (valor > 0) parcelado++
      if (isVagaFechada(row.is_vaga_fechada)) kpiReceita += valor
    }
    if (isVagaFechada(row.is_vaga_fechada) && row.email) {
      const estado = (row.estado || 'Não informado').trim()
      if (!geoEmailMap.has(estado)) geoEmailMap.set(estado, new Set())
      geoEmailMap.get(estado)!.add(row.email)
    }
  })

  funnels.forEach((f) => {
    const fNorm = normalizeFunil(f.nome)
    fullPaymentByFunil.forEach((v, k) => {
      if (normalizeFunil(k) === fNorm) f.vagasFechadas = Math.max(0, f.vagasFechadas - v.count)
    })
  })

  const scheduledByFunil = new Map<string, number>()
  vagasFechadas.forEach((a) => {
    const s = (a.status_agendamento || '').toLowerCase()
    if (SCHEDULED_STATUSES.includes(s)) {
      const fn = a.funil || 'Unknown'
      scheduledByFunil.set(fn, (scheduledByFunil.get(fn) || 0) + 1)
    }
  })
  funnels.forEach((f) => {
    const fNorm = normalizeFunil(f.nome)
    let scheduled = 0
    scheduledByFunil.forEach((count, k) => {
      if (normalizeFunil(k) === fNorm) scheduled += count
    })
    f.taxaAgendamento = f.vagasFechadas > 0 ? (scheduled / f.vagasFechadas) * 100 : 0
  })

  const closedEmails = new Set<string>()
  vagasFechadas.forEach((v) => {
    const email = (v.email || '').toString().trim().toLowerCase()
    if (email) closedEmails.add(email)
  })
  const entradasPendentesFiltered = entradasSemVaga.filter((e) => {
    const email = (e.email || '').toString().trim().toLowerCase()
    return !closedEmails.has(email)
  })

  const kpiVagas = vagasFechadas.length
  const pmTotal = parcelado + aVista + vendaDireta
  const geoData: GeoDataPoint[] = Array.from(geoEmailMap.entries())
    .map(([estado, emails]) => ({ estado, count: emails.size }))
    .sort((a, b) => b.count - a.count)

  const sellerDailyMap = new Map<string, SellerDailyEntry>()
  vendasVendedor.forEach((row) => {
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
      entradasPendentes: entradasPendentesFiltered.length,
      taxaAgendamento,
    },
    funnels,
    chartData,
    paymentMethods: { parcelado, aVista, vendaDireta, total: pmTotal },
    refunds: { count: refundCount, valor: refundValor },
    pagamentosIntegrais: { count: pagamentosIntegraisCount, valor: pagamentosIntegraisValor },
    geoData,
    sellerRanking,
    sellerDailyData,
    entradasSemVaga: entradasPendentesFiltered as TableEntradasRow[],
    agendamentosPendentes,
    isPartial,
  }
}

export async function fetchDashboardData(
  selectedFunnels: FunnelSelection = [],
  dateRange?: DateRange,
): Promise<DashboardData> {
  const result = await fetchAllDashboardData()
  return processDashboardData(result.data, selectedFunnels, dateRange, result.isPartial)
}
