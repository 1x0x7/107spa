// 각인 레벨별 데이터
export const ENGRAVING_DATA = [
  { level: 1, contracts: 3, gold: 200000, ruby: 10 },
  { level: 2, contracts: 6, gold: 400000, ruby: 20 },
  { level: 3, contracts: 9, gold: 600000, ruby: 30 },
  { level: 4, contracts: 12, gold: 600000, ruby: 30 },
]

// 각인석 종류
export const STONE_TYPES = {
  rough: { name: '투박한 각인석', probability: 5, goldCost: 200000, rubyCost: 10 },
  neat: { name: '단정한 각인석', probability: 10, goldCost: 400000, rubyCost: 20 },
  precise: { name: '정교한 각인석', probability: 15, goldCost: 600000, rubyCost: 30 },
}

// 영혼 계약서 종류
export const CONTRACT_TYPES = {
  prosperity: { name: '번영의 영혼 계약서', tool: '세이지 괭이' },
  crushing: { name: '파쇄의 영혼 계약서', tool: '세이지 곡괭이' },
  tide: { name: '만조의 영혼 계약서', tool: '세이지 낚싯대' },
  conquest: { name: '정복의 영혼 계약서', tool: '세이지 대검' },
}

// 기본 시세
export const DEFAULT_PRICES = {
  prosperity: 50000, //번영
  crushing: 73472, //파쇄
  tide: 100000, //만조
  conquest: 150000, //정복
  rough: 0, //투박한
  neat: 0, //단정한
  precise: 0, //정교한
}