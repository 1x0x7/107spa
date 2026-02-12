// =========================
// 사냥 관련 데이터
// =========================

// 전리품 이미지
export const HUNTING_IMAGES: Record<string, string> = {
  deer: '/img/hunting/deer_antler.png',
  meerkat: '/img/hunting/meerkat_tail.png',
  giraffe: '/img/hunting/giraffe_hide.png',
  elephant: '/img/hunting/elephant_tusk.png',
  hippo: '/img/hunting/hippo_tusk.png',
  flamingo: '/img/hunting/flamingo_beak.png',
  turkey: '/img/hunting/turkey_feather.png',
  bear: '/img/hunting/bear_paw.png',
}

/* ===== 기본 수치 ===== */
export const HUNTING_STAMINA_PER_HUNT = 10  // 사냥 1회당 스태미나 소모

/* ===== 콤보 시스템 ===== */
// 콤보별 전리품 추가 드롭 확률
export const COMBO_DROP_RATE: Record<number, number> = {
  1: 0,
  2: 0.01,
  3: 0.01,
  4: 0.02,
  5: 0.03,
  6: 0.04,
  7: 0.05,
  8: 0.06,
  9: 0.08,
  10: 0.10,
  11: 0.12,
  12: 0.14,
  13: 0.16,
  14: 0.18,
  15: 0.21,
  16: 0.24,
  17: 0.27,
  18: 0.31,
  19: 0.35,
  20: 0.40,
}

// 끝까지 간다! 레벨별 최대 콤보
export const EXPERT_ALL_THE_WAY: Record<number, number> = {
  0: 0,   // 콤보 비활성화
  1: 5,
  2: 7,
  3: 10,
  4: 15,
  5: 20,
}

/* ===== 세이지 대검 스탯 ===== */
export const SWORD_STATS: Record<number, { attack: number; drops: number; relicChance: number }> = {
  1:  { attack: 45,  drops: 1,  relicChance: 0.01 },
  2:  { attack: 50,  drops: 2,  relicChance: 0.03 },
  3:  { attack: 55,  drops: 2,  relicChance: 0.03 },
  4:  { attack: 60,  drops: 2,  relicChance: 0.05 },
  5:  { attack: 65,  drops: 3,  relicChance: 0.05 },
  6:  { attack: 70,  drops: 3,  relicChance: 0.07 },
  7:  { attack: 75,  drops: 3,  relicChance: 0.07 },
  8:  { attack: 80,  drops: 4,  relicChance: 0.10 },
  9:  { attack: 85,  drops: 4,  relicChance: 0.10 },
  10: { attack: 140, drops: 6,  relicChance: 0.15 },
  11: { attack: 160, drops: 6,  relicChance: 0.15 },
  12: { attack: 180, drops: 7,  relicChance: 0.20 },
  13: { attack: 200, drops: 7,  relicChance: 0.20 },
  14: { attack: 250, drops: 8,  relicChance: 0.25 },
  15: { attack: 300, drops: 10, relicChance: 0.30 },
}

/* ===== 전문가 확률 테이블 ===== */
// 추가 손질 (extraProcessing)
export const EXPERT_EXTRA_PROCESSING: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 },
  1: { rate: 0.01, count: 1 },
  2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 },
  4: { rate: 0.04, count: 1 },
  5: { rate: 0.05, count: 1 },
  6: { rate: 0.07, count: 2 },
  7: { rate: 0.10, count: 2 },
}

// 남들과는 다르게 (differentFromOthers) - 콤보 시 전리품 추가 확률 증가
export const EXPERT_DIFFERENT: Record<number, number> = {
  0: 0,
  1: 0.03,
  2: 0.05,
  3: 0.07,
  4: 0.10,
  5: 0.15,
  6: 0.20,
  7: 0.30,
}

// 변종 개체 (mutantSpecies)
export const EXPERT_MUTANT: Record<number, { rate: number; count: number }> = {
  0:  { rate: 0, count: 0 },
  1:  { rate: 0.01, count: 1 },
  2:  { rate: 0.02, count: 1 },
  3:  { rate: 0.03, count: 1 },
  4:  { rate: 0.04, count: 1 },
  5:  { rate: 0.05, count: 1 },
  6:  { rate: 0.06, count: 1 },
  7:  { rate: 0.07, count: 1 },
  8:  { rate: 0.08, count: 1 },
  9:  { rate: 0.09, count: 1 },
  10: { rate: 0.15, count: 1 },
}

/* ===== 동물 데이터 ===== */
export const ANIMAL_DATA = {
  deer: { name: '사슴', lootName: '사슴의 뿔', soulName: '사슴의 영혼' },
  meerkat: { name: '미어캣', lootName: '미어캣의 꼬리', soulName: '미어캣의 영혼' },
  giraffe: { name: '기린', lootName: '기린의 가죽', soulName: '기린의 영혼' },
  elephant: { name: '코끼리', lootName: '코끼리의 상아', soulName: '코끼리의 영혼' },
  hippo: { name: '하마', lootName: '하마의 송곳니', soulName: '하마의 영혼' },
  flamingo: { name: '플라밍고', lootName: '플라밍고의 부리', soulName: '플라밍고의 영혼' },
  turkey: { name: '칠면조', lootName: '칠면조의 깃털', soulName: '칠면조의 영혼' },
  bear: { name: '곰', lootName: '곰의 발바닥', soulName: '곰의 영혼' },
} as const

/* ===== 전문가 설명 ===== */
export const HUNTING_EXPERT_DESC = {
  allTheWay: [
    '초식 동물 사냥 시 최대 5콤보까지 달성',
    '초식 동물 사냥 시 최대 7콤보까지 달성',
    '초식 동물 사냥 시 최대 10콤보까지 달성',
    '초식 동물 사냥 시 최대 15콤보까지 달성',
    '초식 동물 사냥 시 최대 20콤보까지 달성',
  ],
  worthProof: [
    '영혼 판매가 +5%',
    '영혼 판매가 +7%',
    '영혼 판매가 +10%',
    '영혼 판매가 +20%',
    '영혼 판매가 +30%',
    '영혼 판매가 +50%',
  ],
  extraProcessing: [
    '초식 동물 사냥 시 1% 확률로 전리품 +1',
    '초식 동물 사냥 시 2% 확률로 전리품 +1',
    '초식 동물 사냥 시 3% 확률로 전리품 +1',
    '초식 동물 사냥 시 4% 확률로 전리품 +1',
    '초식 동물 사냥 시 5% 확률로 전리품 +1',
    '초식 동물 사냥 시 7% 확률로 전리품 +2',
    '초식 동물 사냥 시 10% 확률로 전리품 +2',
  ],
  differentFromOthers: [
    '콤보 활성화 시 전리품 추가 드롭 확률 +3%',
    '콤보 활성화 시 전리품 추가 드롭 확률 +5%',
    '콤보 활성화 시 전리품 추가 드롭 확률 +7%',
    '콤보 활성화 시 전리품 추가 드롭 확률 +10%',
    '콤보 활성화 시 전리품 추가 드롭 확률 +15%',
    '콤보 활성화 시 전리품 추가 드롭 확률 +20%',
    '콤보 활성화 시 전리품 추가 드롭 확률 +30%',
  ],
  mutantSpecies: [
    '사냥 시 1% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 2% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 3% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 4% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 5% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 6% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 7% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 8% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 9% 확률로 동물에 맞는 영혼 +1',
    '사냥 시 15% 확률로 동물에 맞는 영혼 +1',
  ],
} as const

// ==================== 영혼 가공 시설 ====================
export const SOUL_PROCESSING = [
  { 
    name: '영혼 불꽃', 
    ingredients: '좀비의 심장 1개 + 스켈레톤 심장 1개 + 거미의 심장 1개 + 크리퍼의 심장 1개',
    price: '2,000 G',
    img : "soul.png"
  },
  { name: '사슴의 영혼', ingredients: '사슴의 뿔 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "dear_soul.png" },
  { name: '미어캣의 영혼', ingredients: '미어캣의 꼬리 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "meerkat_soul.png" },
  { name: '기린의 영혼', ingredients: '기린의 가죽 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "giraffe_soul.png" },
  { name: '코끼리의 영혼', ingredients: '코끼리의 상아 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "elephant_soul.png" },
  { name: '하마의 영혼', ingredients: '하마의 송곳니 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "hippo_soul.png" },
  { name: '플라밍고의 영혼', ingredients: '플라밍고의 부리 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "flamingo_soul.png" },
  { name: '칠면조의 영혼', ingredients: '칠면조의 깃털 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "turkey_soul.png" },
  { name: '곰의 영혼', ingredients: '곰의 발바닥 8개 + 영혼 불꽃 3개', price: '2,000 G', img: "bear_soul.png" },
] as const

// ==================== 영혼 계약서 (강화 제작 시설) ====================
export const SOUL_CONTRACTS = [
  { 
    name: '번영의 영혼 계약서 (재배)', 
    ingredients: '사슴의 영혼 1개 + 미어캣의 영혼 1개',
    img: "f.png"
  },
  { 
    name: '파쇄의 영혼 계약서 (채광)', 
    ingredients: '기린의 영혼 1개 + 코끼리의 영혼 1개',
    img: "m.png"
  },
  { 
    name: '만조의 영혼 계약서 (해양)', 
    ingredients: '하마의 영혼 1개 + 플라밍고의 영혼 1개',
    img: "o.png"
  },
  { 
    name: '정복의 영혼 계약서 (사냥)', 
    ingredients: '칠면조의 영혼 1개 + 곰의 영혼 1개',
    img: "h.png"
  },
] as const

/* ===== 핵심 타입 ===== */
export interface HuntingSettings {
  swordLevel: number
  allTheWay: number
  worthProof: number
  extraProcessing: number
  differentFromOthers: number
  mutantSpecies: number
}

export type HuntingSkillKey = Exclude<keyof HuntingSettings, 'swordLevel'>

export interface ExpertSkill {
  key: HuntingSkillKey
  name: string
  max: number
  desc: readonly string[]
}

/* ===== UI용 가공 데이터 ===== */
export const SWORD_CONFIG = { min: 1, max: 15 } as const

export const HUNTING_EXPERT_SKILLS: ExpertSkill[] = [
  { key: 'allTheWay', name: '끝까지 간다!', max: 5, desc: HUNTING_EXPERT_DESC.allTheWay },
  { key: 'worthProof', name: '값어치 증명', max: 6, desc: HUNTING_EXPERT_DESC.worthProof },
  { key: 'extraProcessing', name: '추가 손질', max: 7, desc: HUNTING_EXPERT_DESC.extraProcessing },
  { key: 'differentFromOthers', name: '남들과는 다르게', max: 7, desc: HUNTING_EXPERT_DESC.differentFromOthers },
  { key: 'mutantSpecies', name: '변종 개체', max: 10, desc: HUNTING_EXPERT_DESC.mutantSpecies },
]