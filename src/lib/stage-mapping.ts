const STAGE_ID_MAP: Record<string, string> = {
  appointmentscheduled: 'Reunião Agendada',
  qualifiedtobuy: 'Lead Qualificado',
  presentationscheduled: 'Apresentação Agendada',
  decisionmakerboughtin: 'Decisor Engajado',
  contractsent: 'Link Pagamento Enviado',
  closedwon: 'Ganho',
  closedlost: 'Perdido',
  '1': 'Novo Lead',
  '2': 'Tentativa 01',
  '3': 'Tentativa 02',
  '4': 'Tentativa 03',
  '5': 'Tentativa 04',
  '6': 'Tentativa 05',
  '7': 'Conectado',
  '8': 'Reunião Agendada',
  '9': 'Em Negociação',
  '10': 'Link Pagamento Enviado',
  '11': 'Ganho',
  '12': 'Perdido',
}

const STAGE_NAME_NORMALIZE: Record<string, string> = {
  'novo lead': 'Novo Lead',
  'tentativa 01': 'Tentativa 01',
  'tentativa 02': 'Tentativa 02',
  'tentativa 03': 'Tentativa 03',
  'tentativa 04': 'Tentativa 04',
  'tentativa 05': 'Tentativa 05',
  conectado: 'Conectado',
  'reunião agendada': 'Reunião Agendada',
  'reuniao agendada': 'Reunião Agendada',
  'em negociação': 'Em Negociação',
  'em negociacao': 'Em Negociação',
  'link pagamento enviado': 'Link Pagamento Enviado',
  ganho: 'Ganho',
  perdido: 'Perdido',
  'lead qualificado': 'Lead Qualificado',
  qualifiedtobuy: 'Lead Qualificado',
  appointmentscheduled: 'Reunião Agendada',
  presentationscheduled: 'Apresentação Agendada',
  decisionmakerboughtin: 'Decisor Engajado',
  contractsent: 'Link Pagamento Enviado',
  closedwon: 'Ganho',
  closedlost: 'Perdido',
}

export function mapStageIdToName(stageId: string | null): string {
  if (!stageId || stageId.trim() === '') return 'Não informado'

  const trimmed = stageId.trim()
  const lower = trimmed.toLowerCase()

  if (STAGE_ID_MAP[lower]) return STAGE_ID_MAP[lower]
  if (STAGE_ID_MAP[trimmed]) return STAGE_ID_MAP[trimmed]
  if (STAGE_NAME_NORMALIZE[lower]) return STAGE_NAME_NORMALIZE[lower]
  if (STAGE_NAME_NORMALIZE[trimmed]) return STAGE_NAME_NORMALIZE[trimmed]

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
    return 'Unknown Stage'
  }

  return trimmed
}
