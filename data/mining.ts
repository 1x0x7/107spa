// =========================
// 채광 관련 데이터
// =========================
export const MINING_IMAGES: Record<string, string> = {
  corum: '/img/mining/corum.png',
  lifton: '/img/mining/lifton.png',
  serent: '/img/mining/serent.png',
}
/* ===== 기본 수치 ===== */
export const MINING_STAMINA_PER_MINE = 10

export const PICKAXE_STATS: Record<number, { drops: number; relic: number; cobi: number }> = {
  1: { drops: 2, relic: 0.0, cobi: 0.0 },
  2: { drops: 3, relic: 0.01, cobi: 0.01 },
  3: { drops: 3, relic: 0.01, cobi: 0.01 },
  4: { drops: 3, relic: 0.01, cobi: 0.02 },
  5: { drops: 4, relic: 0.02, cobi: 0.02 },
  6: { drops: 4, relic: 0.02, cobi: 0.03 },
  7: { drops: 4, relic: 0.02, cobi: 0.03 },
  8: { drops: 5, relic: 0.03, cobi: 0.04 },
  9: { drops: 5, relic: 0.03, cobi: 0.05 },
  10: { drops: 5, relic: 0.03, cobi: 0.06 },
  11: { drops: 6, relic: 0.05, cobi: 0.07 },
  12: { drops: 6, relic: 0.05, cobi: 0.08 },
  13: { drops: 7, relic: 0.05, cobi: 0.1 },
  14: { drops: 7, relic: 0.05, cobi: 0.13 },
  15: { drops: 12, relic: 0.1, cobi: 0.15 },
}

/* ===== 전문가 확률 테이블 ===== */
export const EXPERT_COBI: Record<number, number> = {
  0: 0, 1: 0.01, 2: 0.015, 3: 0.02, 4: 0.025, 5: 0.03, 6: 0.04, 7: 0.05,
}

export const EXPERT_LUCKY: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 },
  1: { rate: 0.01, count: 1 },
  2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 },
  4: { rate: 0.04, count: 1 },
  5: { rate: 0.05, count: 1 },
  6: { rate: 0.06, count: 1 },
  7: { rate: 0.07, count: 1 },
  8: { rate: 0.08, count: 2 },
  9: { rate: 0.1, count: 2 },
  10: { rate: 0.15, count: 3 },
}

export const EXPERT_FIRE_PICK: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 },
  1: { rate: 0.01, count: 1 },
  2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 },
  4: { rate: 0.04, count: 1 },
  5: { rate: 0.05, count: 1 },
  6: { rate: 0.06, count: 1 },
  7: { rate: 0.07, count: 1 },
  8: { rate: 0.08, count: 1 },
  9: { rate: 0.09, count: 1 },
  10: { rate: 0.15, count: 1 },
}

export const EXPERT_GEM_START: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 },
  1: { rate: 0.03, count: 1 },
  2: { rate: 0.07, count: 1 },
  3: { rate: 0.1, count: 2 },
}

/* ===== 광석 데이터 ===== */
export const ORE_DATA = {
  corum: { name: '코룸', gemName: '그라밋' },
  lifton: { name: '리프톤', gemName: '에메리오' },
  serent: { name: '세렌트', gemName: '샤인플레어' },
} as const

/* ===== 전문가 설명 ===== */
export const MINING_EXPERT_DESC = {
  cobi: [
    '아일랜드에서 채광 시 코비 등장 확률 +1%',
    '아일랜드에서 채광 시 코비 등장 확률 +1.5%',
    '아일랜드에서 채광 시 코비 등장 확률 +2%',
    '아일랜드에서 채광 시 코비 등장 확률 +2.5%',
    '아일랜드에서 채광 시 코비 등장 확률 +3%',
    '아일랜드에서 채광 시 코비 등장 확률 +4%',
    '아일랜드에서 채광 시 코비 등장 확률 +5%',
  ],
  ingot: ['주괴 판매가 +5%', 
    '주괴 판매가 +7%',
    '주괴 판매가 +10%',
    '주괴 판매가 +20%',
    '주괴 판매가 +30%',
    '주괴 판매가 +50%'],
  gemStart: [
    '3% 확률로 보석 1개 드롭',
    '7% 확률로 보석 1개 드롭',
    '10% 확률로 보석 2개 드롭',
  ],
  gemShine: ['보석 판매가 +5%',
    '보석 판매가 +7%',
    '보석 판매가 +10%',
    '보석 판매가 +20%',
    '보석 판매가 +30%',
    '보석 판매가 +50%'],
  lucky: [
    '1% 확률로 광석 +1개 추가 드롭',
    '2% 확률로 광석 +1개 추가 드롭',
    '3% 확률로 광석 +1개 추가 드롭',
    '4% 확률로 광석 +1개 추가 드롭',
    '5% 확률로 광석 +1개 추가 드롭',
    '6% 확률로 광석 +1개 추가 드롭',
    '7% 확률로 광석 +1개 추가 드롭',
    '8% 확률로 광석 +2개 추가 드롭',
    '10% 확률로 광석 +2개 추가 드롭',
    '15% 확률로 광석 +3개 추가 드롭',
  ],
  firePick: [
    '1% 확률로 주괴 +1개 추가 드롭',
    '2% 확률로 주괴 +1개 추가 드롭',
    '3% 확률로 주괴 +1개 추가 드롭',
    '4% 확률로 주괴 +1개 추가 드롭',
    '5% 확률로 주괴 +1개 추가 드롭',
    '6% 확률로 주괴 +1개 추가 드롭',
    '7% 확률로 주괴 +1개 추가 드롭',
    '8% 확률로 주괴 +1개 추가 드롭',
    '9% 확률로 주괴 +1개 추가 드롭',
    '15% 확률로 주괴 +1개 추가 드롭',
  ],
} as const

/* ===== 레시피 ===== */
export interface Recipe {
  name: string
  ingredients: string
  img?:string
}

export const MINING_PROCESS_RECIPES: Recipe[] = [
  { name: '강화 횃불', ingredients: '횃불 4개', img: "toach.png" },
  { name: '코룸 주괴', ingredients: '코룸 16개 + 강화 횃불 2개', img : "corum2.png" },
  { name: '리프톤 주괴', ingredients: '리프톤 15개 + 강화 횃불 4개', img : "lifton2.png" },
  { name: '세렌트 주괴', ingredients: '세렌트 16개 + 강화 횃불 8개', img : "serent2.png" },
]

export const MINING_CRAFT_RECIPES: Recipe[] = [
  { name: '조약돌 뭉치', ingredients: '조약돌 64개', img : "stone1.png" },
  { name: '심층암 조약돌 뭉치', ingredients: '심층암 조약돌 64개', img : "stone2.png" },
  { name: '어빌리티 스톤', ingredients: '코룸 주괴 1개 + 리프톤 주괴 1개 + 세렌트 주괴 1개', img : "a.png" },
  { name: '하급 라이프스톤', ingredients: '조약돌 뭉치 2개 + 구리 블록 8개 + 레드스톤 블록 3개 + 코룸 주괴 1개', img : "low.png" },
  { name: '중급 라이프스톤', ingredients: '심층암 조약돌 뭉치 2개 + 청금석 블록 5개 + 철 블록 5개 + 다이아몬드 블록 3개 + 리프톤 주괴 2개', img : "mid.png" },
  { name: '상급 라이프스톤', ingredients: '구리 블록 30개 + 자수정 블록 20개 + 철 블록 7개 + 금 블록 7개 + 다이아몬드 블록 5개 + 세렌트 주괴 3개', img : "high.png" },
]


/* ===== 핵심 타입 ===== */
export interface MiningSettings {
  pickaxeLevel: number
  cobi: number
  ingot: number
  gemStart: number
  gemShine: number
  lucky: number
  firePick: number
}

export type MiningSkillKey = Exclude<keyof MiningSettings, 'pickaxeLevel'>

export interface ExpertSkill {
  key: MiningSkillKey
  name: string
  max: number
  desc: readonly string[]
}

/* ===== UI용 가공 데이터 ===== */
export const PICKAXE_CONFIG = { min: 1, max: 15 } as const

export const MINING_EXPERT_SKILLS: ExpertSkill[] = [
  { key: 'cobi', name: '코비 전문가', max: 7, desc: MINING_EXPERT_DESC.cobi },
  { key: 'ingot', name: '주괴 전문가', max: 6, desc: MINING_EXPERT_DESC.ingot },
  { key: 'gemStart', name: '보석 스타트', max: 3, desc: MINING_EXPERT_DESC.gemStart },
  { key: 'gemShine', name: '보석 강화', max: 6, desc: MINING_EXPERT_DESC.gemShine },
  { key: 'lucky', name: '럭키 채광', max: 10, desc: MINING_EXPERT_DESC.lucky },
  { key: 'firePick', name: '화염 곡괭이', max: 10, desc: MINING_EXPERT_DESC.firePick },
]
