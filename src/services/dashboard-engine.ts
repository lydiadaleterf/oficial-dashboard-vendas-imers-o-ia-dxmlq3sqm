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

function isEntradaOffer(oferta: unknown): boolean {
  if (oferta === null || oferta === undefined) return false
  return String(oferta).toLowerCase().includes('entrada')
}

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

function getDedupeKey(row: Record<string, any>): string {
  const doc = (row.doc || '').toString().trim()
  if (doc) return `doc:${doc.toLowerCase()}`
  const email = (row.email || '').toString().trim().toLowerCase()
  if (email) return `email:${email}`
  const dealId = (row.deal_id || '').toString().trim()
  if (dealId) return `deal:${dealId}`
  return ''
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
  const funilDateCol =
    raw.funil.length > 0
      ? Object.keys(raw.funil[0]).find((k) => {
          const lk = k.toLowerCase()
          return (
            lk === 'dia' ||
            lk === 'data' ||
            lk === 'date' ||
            lk === 'data_funil' ||
            lk === 'created'
          )
        }) || null
      : null
  const funilRaw = filterByFunnels(
    funilDateCol ? filterByDate(raw.funil, funilDateCol, dateRange) : raw.funil,
    ff,
  )
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

  // Deduplicate vagasFechadas by email — one vaga per person.
  const vagasFechadasSeenEmails = new Set<string>()
  const dedupedVagasFechadas = vagasFechadas.filter((v) => {
    const email = (v.email || '').toString().trim().toLowerCase()
    if (email && vagasFechadasSeenEmails.has(email)) return false
    if (email) vagasFechadasSeenEmails.add(email)
    return true
  })

  let taxaAgendamento = 0
  const agendamentosPendentes: TableAgendamentoRow[] = []
  if (dedupedVagasFechadas.length > 0) {
    const relevant = dedupedVagasFechadas.filter((a) => {
      const s = (a.status_agendamento || '').toLowerCase()
      return SCHEDULED_STATUSES.includes(s) || UNSCHEDULED_STATUSES.includes(s)
    })
    const scheduled = relevant.filter((a) =>
      SCHEDULED_STATUSES.includes((a.status_agendamento || '').toLowerCase()),
    ).length
    taxaAgendamento = relevant.length > 0 ? (scheduled / relevant.length) * 100 : 0
    dedupedVagasFechadas
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
    // venda_produto1, venda_entrada, and vagas_fechadas are funnel-level
    // metrics repeated in every per-seller row. Only take from the first
    // row to prevent multi-row (triple) counting.
    if (fd.vendaProduto1 === 0 && safeNum(row.venda_produto1) > 0) {
      fd.vendaProduto1 = safeNum(row.venda_produto1)
    }
    if (fd.vendaEntrada === 0 && safeNum(row.venda_entrada) > 0) {
      fd.vendaEntrada = safeNum(row.venda_entrada)
    }
    if (fd.vagasFechadas === 0 && safeNum(row.vagas_fechadas) > 0) {
      fd.vagasFechadas = safeNum(row.vagas_fechadas)
    }
    // self_service_qtd, vendedor_qtd, and vendas_do_vendedor are per-seller values
    fd.selfServiceQtd += safeNum(row.self_service_qtd)
    fd.vendedorQtd += safeNum(row.vendedor_qtd)
    if (row.vendedor && row.vendedor.trim() && row.vendedor !== 'NULL') {
      const existing = fd.sellers.find((s) => s.nome === row.vendedor)
      if (existing) {
        existing.vendas += safeNum(row.vendas_do_vendedor)
      } else {
        fd.sellers.push({ nome: row.vendedor, vendas: safeNum(row.vendas_do_vendedor) })
      }
    }
  })
  const funnels = Array.from(funnelMap.values())
  funnels.forEach((f) => {
    const total = f.selfServiceQtd + f.vendedorQtd
    f.selfServicePct = total > 0 ? (f.selfServiceQtd / total) * 100 : 0
    f.vendedorPct = total > 0 ? (f.vendedorQtd / total) * 100 : 0
  })
  const FULL_TICKET_VALUE = 10000
  const vagasGarantidasByFunil = new Map<string, number>()
  const vagasGarantidasSeenKeys = new Set<string>()
  transacoes.forEach((row) => {
    const status = (row.status || '').toLowerCase()
    if (isRefundStatus(status)) return
    const oferta = String(row.oferta || '').toLowerCase()
    if (oferta.includes('entrada')) return
    const valor = safeNum(row.valor_pago)
    if (valor !== FULL_TICKET_VALUE) return
    const dk = getDedupeKey(row)
    const fn = row.funil || 'Unknown'
    const compositeKey = `${fn}|${dk}`
    if (dk !== '' && vagasGarantidasSeenKeys.has(compositeKey)) return
    if (dk) vagasGarantidasSeenKeys.add(compositeKey)
    vagasGarantidasByFunil.set(fn, (vagasGarantidasByFunil.get(fn) || 0) + 1)
  })
  funnels.forEach((f) => {
    const fNorm = normalizeFunil(f.nome)
    let count = 0
    vagasGarantidasByFunil.forEach((v, k) => {
      if (normalizeFunil(k) === fNorm) count += v
    })
    f.vagasFechadas = count
  })

  let parcelado = 0,
    aVista = 0,
    refundCount = 0,
    refundValor = 0,
    kpiReceita = 0,
    approvedCount = 0
  let pagamentosIntegraisCount = 0,
    pagamentosIntegraisValor = 0
  const fullPaymentByFunil = new Map<string, { count: number; valor: number }>()
  const geoEmailMap = new Map<string, Set<string>>()
  const vendaDireta = funnels.reduce((s, f) => s + f.vendedorQtd, 0)

  const seenApprovedEntradaKeys = new Set<string>()
  const seenNonRefundKeys = new Set<string>()
  const seenRefundKeys = new Set<string>()

  transacoes.forEach((row) => {
    const valor = safeNum(row.valor_pago)
    const status = (row.status || '').toLowerCase()
    const dedupeKey = getDedupeKey(row)

    if (status === 'approved' && isEntradaOffer(row.oferta)) {
      if (dedupeKey === '' || !seenApprovedEntradaKeys.has(dedupeKey)) {
        if (dedupeKey) seenApprovedEntradaKeys.add(dedupeKey)
        approvedCount++
      }
    }

    if (isRefundStatus(status)) {
      if (dedupeKey === '' || !seenRefundKeys.has(dedupeKey)) {
        if (dedupeKey) seenRefundKeys.add(dedupeKey)
        refundCount++
        refundValor += valor
      }
    } else {
      if (dedupeKey !== '' && seenNonRefundKeys.has(dedupeKey)) return
      if (dedupeKey) seenNonRefundKeys.add(dedupeKey)

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

  if (!funilDateCol) {
    const entradasByFunil = new Map<string, number>()
    const seenEntradaFunilKeys = new Set<string>()
    transacoes.forEach((row) => {
      if ((row.status || '').toLowerCase() === 'approved' && isEntradaOffer(row.oferta)) {
        const fn = row.funil || 'Unknown'
        const dk = getDedupeKey(row)
        const compositeKey = `${fn}|${dk}`
        if (dk === '' || !seenEntradaFunilKeys.has(compositeKey)) {
          if (dk) seenEntradaFunilKeys.add(compositeKey)
          entradasByFunil.set(fn, (entradasByFunil.get(fn) || 0) + 1)
        }
      }
    })
    funnels.forEach((f) => {
      const fNorm = normalizeFunil(f.nome)
      let count = 0
      entradasByFunil.forEach((v, k) => {
        if (normalizeFunil(k) === fNorm) count += v
      })
      f.vendaEntrada = count
    })
  }

  const scheduledByFunil = new Map<string, number>()
  dedupedVagasFechadas.forEach((a) => {
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
  dedupedVagasFechadas.forEach((v) => {
    const email = (v.email || '').toString().trim().toLowerCase()
    if (email) closedEmails.add(email)
  })
  const entradasPendentesSeenEmails = new Set<string>()
  const entradasPendentesFiltered = entradasSemVaga.filter((e) => {
    const email = (e.email || '').toString().trim().toLowerCase()
    if (closedEmails.has(email)) return false
    if ('oferta' in e && !isEntradaOffer(e.oferta)) return false
    if (email) {
      if (entradasPendentesSeenEmails.has(email)) return false
      entradasPendentesSeenEmails.add(email)
    }
    return true
  })

  const totalVagasFechadas = dedupedVagasFechadas.length
  const kpiEntradasPendentes = entradasPendentesFiltered.length
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

  const hubspotLinkMap = new Map<string, string>()
  transacoes.forEach((row) => {
    const email = (row.email || '').toString().trim().toLowerCase()
    if (email && row.link_hubspot && !hubspotLinkMap.has(email)) {
      hubspotLinkMap.set(email, row.link_hubspot)
    }
  })

  const enrichedVagasFechadas: Record<string, any>[] = []
  dedupedVagasFechadas.forEach((v) => {
    const email = (v.email || '').toString().trim().toLowerCase()
    enrichedVagasFechadas.push({
      ...v,
      link_hubspot: email ? hubspotLinkMap.get(email) || null : null,
    })
  })

  const drillDownEntradas: Record<string, any>[] = []
  const drillDownEntradaKeys = new Set<string>()
  transacoes.forEach((t) => {
    if ((t.status || '').toLowerCase() !== 'approved' || !isEntradaOffer(t.oferta)) return
    const dk = getDedupeKey(t)
    if (dk === '' || !drillDownEntradaKeys.has(dk)) {
      if (dk) drillDownEntradaKeys.add(dk)
      drillDownEntradas.push(t)
    }
  })

  const drillDownReceita: Record<string, any>[] = []
  const drillDownReceitaKeys = new Set<string>()
  transacoes.forEach((t) => {
    if (!isVagaFechada(t.is_vaga_fechada) || isRefundStatus((t.status || '').toLowerCase())) return
    const dk = getDedupeKey(t)
    if (dk === '' || !drillDownReceitaKeys.has(dk)) {
      if (dk) drillDownReceitaKeys.add(dk)
      drillDownReceita.push(t)
    }
  })

  const drillDownReembolsos: Record<string, any>[] = []
  const drillDownReembolsoKeys = new Set<string>()
  transacoes.forEach((t) => {
    if (!isRefundStatus((t.status || '').toLowerCase())) return
    const dk = getDedupeKey(t)
    if (dk === '' || !drillDownReembolsoKeys.has(dk)) {
      if (dk) drillDownReembolsoKeys.add(dk)
      drillDownReembolsos.push(t)
    }
  })

  const drillDownRecords = {
    entradas: drillDownEntradas,
    vagasFechadas: enrichedVagasFechadas,
    receita: drillDownReceita,
    entradasPendentes: entradasPendentesFiltered as Record<string, any>[],
    reembolsos: drillDownReembolsos,
    agendamento: enrichedVagasFechadas,
  }

  return {
    kpis: {
      entradas: approvedCount,
      vagasFechadas: totalVagasFechadas,
      receitaFechada: kpiReceita,
      entradasPendentes: kpiEntradasPendentes,
      taxaAgendamento,
      refunded: refundCount,
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
    drillDown: drillDownRecords,
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
