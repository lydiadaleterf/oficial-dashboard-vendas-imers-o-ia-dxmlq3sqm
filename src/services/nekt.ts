import pb from '@/lib/pocketbase/client'

export const NEKT_QUERIES = {
  SCORECARD: 'SELECT * FROM "nekt_b2b"."scorecard_visao_geral"',
  VAGAS_FECHADAS: 'SELECT * FROM "nekt_b2b"."vagas_fechadas_agendamento"',
  DASHBOARD_DIARIO: 'SELECT * FROM "nekt_b2b"."dashboard_diario_imersao"',
  FUNIL_SKIP_LANCAMENTO: 'SELECT * FROM "nekt_b2b"."funil_skip_vs_lancamento_interno"',
  ENTRADAS_SEM_VAGA: 'SELECT * FROM "nekt_b2b"."entradas_sem_vaga_hubspot"',
  VENDAS_VENDEDOR_DIARIO: 'SELECT * FROM "nekt_b2b"."vendas_vendedor_diario_imersao"',
  TRANSACOES_DETALHADO: 'SELECT * FROM "nekt_b2b"."transacoes_imersao_detalhado"',
} as const

export async function nektQuery(sql: string): Promise<Record<string, any>[]> {
  const res = await pb.send('/backend/v1/nekt/query', {
    method: 'POST',
    body: JSON.stringify({ sql }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (res.error) throw new Error(res.error)
  if (!res.data) return []
  return Array.isArray(res.data) ? res.data : [res.data]
}
