import { cn } from '@/lib/utils'

const STAGE_GRAY = ['novo lead']
const STAGE_LIGHT_GREEN = [
  'tentativa 01',
  'tentativa 02',
  'tentativa 03',
  'tentativa 04',
  'tentativa 05',
]
const STAGE_GREEN = [
  'conectado',
  'reunião agendada',
  'em negociação',
  'link pagamento enviado',
  'ganho',
]
const STAGE_RED = ['perdido']

type StageColorKey = 'gray' | 'lightGreen' | 'green' | 'red'

const STAGE_MAP: Record<string, StageColorKey> = {}

function populateMap(stages: string[], key: StageColorKey) {
  stages.forEach((s) => {
    STAGE_MAP[s.toLowerCase().trim()] = key
  })
}

populateMap(STAGE_GRAY, 'gray')
populateMap(STAGE_LIGHT_GREEN, 'lightGreen')
populateMap(STAGE_GREEN, 'green')
populateMap(STAGE_RED, 'red')

const COLOR_CLASSES: Record<StageColorKey, string> = {
  gray: 'bg-gray-100 text-gray-700 border-gray-300',
  lightGreen: 'bg-green-100 text-green-800 border-green-300',
  green: 'bg-green-500 text-white border-green-600',
  red: 'bg-red-500 text-white border-red-600',
}

export function getDealStageColor(stageName: string | null): string {
  if (!stageName) return COLOR_CLASSES.gray
  const key = STAGE_MAP[stageName.toLowerCase().trim()]
  return key ? COLOR_CLASSES[key] : COLOR_CLASSES.gray
}

export function dealStageBadgeClass(stageName: string | null): string {
  return cn('text-[10px] font-medium border', getDealStageColor(stageName))
}
