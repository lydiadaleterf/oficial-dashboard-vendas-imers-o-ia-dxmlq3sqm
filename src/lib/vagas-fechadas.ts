import type { DrillDownColumn } from '@/services/drill-down'

export const VAGAS_FECHADAS_COLUMNS: DrillDownColumn[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'funil', label: 'Funil' },
  { key: 'data_vaga_fechada', label: 'Data Vaga Fechada', format: 'date' },
  { key: 'status_agendamento', label: 'Status Agendamento' },
  { key: 'link_guru', label: 'Guru', format: 'link', linkLabel: 'Guru' },
  { key: 'link_hubspot', label: 'HubSpot', format: 'link', linkLabel: 'HubSpot' },
]

export function filterVagasFechadas(
  data: Record<string, any>[] | undefined,
  selectedFunnels: string[],
): Record<string, any>[] {
  if (!data || !Array.isArray(data)) return []
  if (!selectedFunnels || selectedFunnels.length === 0) return data
  return data.filter((row) => {
    const funil = row.funil || row.FUNIL || row.Funil
    return funil && selectedFunnels.includes(funil)
  })
}
