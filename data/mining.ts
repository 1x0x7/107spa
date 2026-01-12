// 채광 관련 데이터

export const MINING_STAMINA_PER_MINE = 10

export const PICKAXE_STATS: Record<number, { drops: number; relic: number; cobi: number }> = {
  1:  { drops: 2,  relic: 0.00, cobi: 0.00 },
  2:  { drops: 3,  relic: 0.01, cobi: 0.01 },
  3:  { drops: 3,  relic: 0.01, cobi: 0.01 },
  4:  { drops: 3,  relic: 0.01, cobi: 0.02 },
  5:  { drops: 4,  relic: 0.02, cobi: 0.02 },
  6:  { drops: 4,  relic: 0.02, cobi: 0.03 },
  7:  { drops: 4,  relic: 0.02, cobi: 0.03 },
  8:  { drops: 5,  relic: 0.03, cobi: 0.04 },
  9:  { drops: 5,  relic: 0.03, cobi: 0.05 },
  10: { drops: 5,  relic: 0.03, cobi: 0.06 },
  11: { drops: 6,  relic: 0.05, cobi: 0.07 },
  12: { drops: 6,  relic: 0.05, cobi: 0.08 },
  13: { drops: 7,  relic: 0.05, cobi: 0.10 },
  14: { drops: 7,  relic: 0.05, cobi: 0.13 },
  15: { drops: 12, relic: 0.10, cobi: 0.15 }
}

export const EXPERT_COBI: Record<number, number> = {
  0: 0, 1: 0.01, 2: 0.015, 3: 0.02, 4: 0.025, 5: 0.03, 6: 0.04, 7: 0.05
}

export const EXPERT_LUCKY: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.01, count: 1 }, 2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 }, 4: { rate: 0.04, count: 1 }, 5: { rate: 0.05, count: 1 },
  6: { rate: 0.06, count: 1 }, 7: { rate: 0.07, count: 1 }, 8: { rate: 0.08, count: 2 },
  9: { rate: 0.10, count: 2 }, 10: { rate: 0.15, count: 3 }
}

export const EXPERT_FIRE_PICK: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.01, count: 1 }, 2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 }, 4: { rate: 0.04, count: 1 }, 5: { rate: 0.05, count: 1 },
  6: { rate: 0.06, count: 1 }, 7: { rate: 0.07, count: 1 }, 8: { rate: 0.08, count: 1 },
  9: { rate: 0.09, count: 1 }, 10: { rate: 0.15, count: 1 }
}

export const EXPERT_GEM_START: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.03, count: 1 }, 2: { rate: 0.07, count: 1 }, 3: { rate: 0.10, count: 2 }
}

export const ORE_DATA: Record<string, { name: string; gemName: string }> = {
  corum: { name: '코룸', gemName: '그라밋' },
  lifton: { name: '리프톤', gemName: '에메리오' },
  serent: { name: '세렌트', gemName: '샤인플레어' }
}

export const MINING_EXPERT_DESC = {
  cobi: [
    "아일랜드에서 채광 시 코비 등장 확률 +1%", "코비 등장 확률 +1.5%", "코비 등장 확률 +2%",
    "코비 등장 확률 +2.5%", "코비 등장 확률 +3%", "코비 등장 확률 +4%", "코비 등장 확률 +5%"
  ],
  ingot: ["주괴 판매가 +5%", "+7%", "+10%", "+20%", "+30%", "+50%"],
  gemStart: ["3% 확률로 보석 1개 드롭", "7% 확률로 보석 1개 드롭", "10% 확률로 보석 2개 드롭"],
  gemShine: ["보석 판매가 +5%", "+7%", "+10%", "+20%", "+30%", "+50%"],
  lucky: [
    "1% 확률로 광석 +1개", "2% 확률로 광석 +1개", "3% 확률로 광석 +1개", "4% 확률로 광석 +1개",
    "5% 확률로 광석 +1개", "6% 확률로 광석 +1개", "7% 확률로 광석 +1개", "8% 확률로 광석 +2개",
    "10% 확률로 광석 +2개", "15% 확률로 광석 +3개"
  ],
  firePick: [
    "1% 확률로 광석→주괴", "2% 확률", "3% 확률", "4% 확률", "5% 확률",
    "6% 확률", "7% 확률", "8% 확률", "9% 확률", "15% 확률"
  ]
}

export const MINING_PROCESS_RECIPES = [
  { name: "코룸 조각", ingredients: "코룸 광석 16개" },
  { name: "리프톤 조각", ingredients: "리프톤 광석 16개" },
  { name: "세렌트 조각", ingredients: "세렌트 광석 16개" },
  { name: "코룸 주괴", ingredients: "코룸 광석 16개" },
  { name: "리프톤 주괴", ingredients: "리프톤 광석 16개" },
  { name: "세렌트 주괴", ingredients: "세렌트 광석 16개" }
]

export const MINING_CRAFT_RECIPES = [
  { name: "어빌리티스톤", ingredients: "코룸 조각 4개 + 리프톤 조각 4개 + 세렌트 조각 4개" },
  { name: "하급 라이프스톤", ingredients: "코룸 주괴 2개 + 리프톤 주괴 2개 + 세렌트 주괴 2개" },
  { name: "중급 라이프스톤", ingredients: "하급 라이프스톤 3개 + 각 주괴 4개" },
  { name: "상급 라이프스톤", ingredients: "중급 라이프스톤 3개 + 각 주괴 6개" }
]
