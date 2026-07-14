export interface BrazilState {
  code: string
  name: string
  path: string
}

export const BRAZIL_STATES: BrazilState[] = [
  { code: 'RR', name: 'Roraima', path: 'M230 20 L290 20 L295 60 L255 75 L230 50 Z' },
  {
    code: 'AM',
    name: 'Amazonas',
    path: 'M125 55 L290 55 L290 75 L260 80 L250 175 L195 185 L160 175 L135 140 L125 105 Z',
  },
  { code: 'AP', name: 'Amapá', path: 'M335 45 L390 50 L390 80 L360 85 L335 75 Z' },
  {
    code: 'PA',
    name: 'Pará',
    path: 'M290 75 L390 80 L390 100 L365 105 L365 185 L295 185 L290 80 Z',
  },
  { code: 'AC', name: 'Acre', path: 'M75 135 L135 140 L140 180 L100 195 L75 170 Z' },
  { code: 'RO', name: 'Rondônia', path: 'M100 185 L160 185 L165 225 L125 235 L100 210 Z' },
  {
    code: 'MT',
    name: 'Mato Grosso',
    path: 'M160 175 L290 175 L295 240 L270 285 L210 285 L175 255 L160 220 Z',
  },
  {
    code: 'MS',
    name: 'Mato Grosso do Sul',
    path: 'M210 285 L270 285 L275 330 L235 340 L210 315 Z',
  },
  { code: 'GO', name: 'Goiás', path: 'M285 200 L330 205 L335 260 L300 270 L285 250 Z' },
  { code: 'DF', name: 'Distrito Federal', path: 'M300 245 L318 245 L318 260 L300 260 Z' },
  { code: 'TO', name: 'Tocantins', path: 'M310 185 L358 190 L362 255 L330 265 L310 245 Z' },
  { code: 'MA', name: 'Maranhão', path: 'M380 160 L435 165 L440 235 L405 245 L380 220 Z' },
  { code: 'PI', name: 'Piauí', path: 'M375 235 L425 240 L430 295 L395 305 L375 285 Z' },
  { code: 'CE', name: 'Ceará', path: 'M425 205 L468 210 L472 260 L440 270 L425 240 Z' },
  { code: 'RN', name: 'Rio Grande do Norte', path: 'M468 215 L490 220 L492 248 L468 248 Z' },
  { code: 'PB', name: 'Paraíba', path: 'M460 248 L482 250 L484 275 L460 275 Z' },
  { code: 'PE', name: 'Pernambuco', path: 'M420 260 L458 265 L462 295 L425 305 L420 282 Z' },
  { code: 'AL', name: 'Alagoas', path: 'M425 295 L452 298 L455 318 L428 318 Z' },
  { code: 'SE', name: 'Sergipe', path: 'M405 300 L425 302 L428 322 L405 320 Z' },
  {
    code: 'BA',
    name: 'Bahia',
    path: 'M330 235 L415 240 L415 250 L405 252 L410 320 L395 340 L365 340 L350 310 L330 290 Z',
  },
  {
    code: 'MG',
    name: 'Minas Gerais',
    path: 'M305 270 L378 272 L385 320 L370 370 L335 380 L315 358 L305 320 Z',
  },
  { code: 'ES', name: 'Espírito Santo', path: 'M375 320 L392 322 L395 360 L378 360 Z' },
  { code: 'RJ', name: 'Rio de Janeiro', path: 'M335 370 L372 370 L378 395 L340 395 Z' },
  { code: 'SP', name: 'São Paulo', path: 'M250 335 L335 338 L340 380 L305 390 L260 378 Z' },
  { code: 'PR', name: 'Paraná', path: 'M240 378 L305 380 L310 420 L265 430 L240 410 Z' },
  { code: 'SC', name: 'Santa Catarina', path: 'M240 420 L285 422 L290 450 L245 450 Z' },
  { code: 'RS', name: 'Rio Grande do Sul', path: 'M220 450 L295 452 L305 482 L245 492 L215 480 Z' },
]

const STATE_NAME_TO_CODE: Record<string, string> = {
  acre: 'AC',
  alagoas: 'AL',
  amapa: 'AP',
  amazonas: 'AM',
  bahia: 'BA',
  ceara: 'CE',
  'distrito federal': 'DF',
  'espirito santo': 'ES',
  goias: 'GO',
  maranhao: 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  para: 'PA',
  paraiba: 'PB',
  parana: 'PR',
  pernambuco: 'PE',
  piaui: 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  rondonia: 'RO',
  roraima: 'RR',
  'santa catarina': 'SC',
  'sao paulo': 'SP',
  sergipe: 'SE',
  tocantins: 'TO',
}

function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function normalizeStateCode(estado: string): string | null {
  const trimmed = estado.trim().toUpperCase()
  if (trimmed.length === 2 && /^[A-Z]{2}$/.test(trimmed)) return trimmed
  const normalized = normalizeString(estado)
  return STATE_NAME_TO_CODE[normalized] || null
}

export function getStateName(code: string): string {
  return BRAZIL_STATES.find((s) => s.code === code)?.name || code
}
