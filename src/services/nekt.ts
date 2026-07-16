import pb from '@/lib/pocketbase/client'

export const NEKT_QUERIES = {
  SCORECARD: 'SELECT * FROM "nekt_b2b"."scorecard_visao_geral"',
  VAGAS_FECHADAS:
    'SELECT nome, email, doc, funil, data_vaga_fechada, link_guru, status_agendamento FROM "nekt_b2b"."vagas_fechadas_agendamento"',
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
