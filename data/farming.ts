// 재배 관련 데이터

export const FARMING_STAMINA_PER_HARVEST = 10

export const HOE_STATS: Record<number, { drops: number; seed: number }> = {
  1: { drops: 2, seed: 0 }, 2: { drops: 2, seed: 0.01 }, 3: { drops: 3, seed: 0.01 },
  4: { drops: 3, seed: 0.02 }, 5: { drops: 3, seed: 0.02 }, 6: { drops: 4, seed: 0.03 },
  7: { drops: 4, seed: 0.03 }, 8: { drops: 4, seed: 0.04 }, 9: { drops: 5, seed: 0.05 },
  10: { drops: 5, seed: 0.05 }, 11: { drops: 5, seed: 0.07 }, 12: { drops: 6, seed: 0.07 },
  13: { drops: 6, seed: 0.09 }, 14: { drops: 7, seed: 0.09 }, 15: { drops: 10, seed: 0.15 }
}

export const EXPERT_GIFT: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.01, count: 1 }, 2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 }, 4: { rate: 0.04, count: 1 }, 5: { rate: 0.05, count: 2 },
  6: { rate: 0.06, count: 2 }, 7: { rate: 0.07, count: 3 }, 8: { rate: 0.08, count: 4 },
  9: { rate: 0.09, count: 5 }, 10: { rate: 0.10, count: 8 }
}

export const EXPERT_HARVEST: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.01, count: 1 }, 2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 }, 4: { rate: 0.04, count: 1 }, 5: { rate: 0.05, count: 2 },
  6: { rate: 0.07, count: 2 }, 7: { rate: 0.10, count: 3 }
}

export const EXPERT_FIRE_HOE: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.01, count: 1 }, 2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 2 }, 4: { rate: 0.04, count: 2 }, 5: { rate: 0.05, count: 2 },
  6: { rate: 0.06, count: 3 }, 7: { rate: 0.07, count: 3 }, 8: { rate: 0.08, count: 5 },
  9: { rate: 0.09, count: 5 }, 10: { rate: 0.15, count: 7 }
}

export const CROP_DATA: Record<string, { name: string }> = {
  tomato: { name: '토마토' },
  onion: { name: '양파' },
  garlic: { name: '마늘' }
}

export const FARMING_EXPERT_DESC = {
  gift: [
    "채집 시 1% 확률로 씨앗 +1개", "2% 확률로 씨앗 +1개", "3% 확률로 씨앗 +1개",
    "4% 확률로 씨앗 +1개", "5% 확률로 씨앗 +2개", "6% 확률로 씨앗 +2개",
    "7% 확률로 씨앗 +3개", "8% 확률로 씨앗 +4개", "9% 확률로 씨앗 +5개", "10% 확률로 씨앗 +8개"
  ],
  harvest: [
    "수확 시 1% 확률로 농작물 +1개", "2% 확률로 +1개", "3% 확률로 +1개",
    "4% 확률로 +1개", "5% 확률로 +2개", "7% 확률로 +2개", "10% 확률로 +3개"
  ],
  pot: ["3세트 이상 판매 시 1% 보너스", "2% 보너스", "3% 보너스", "4% 보너스", "7% 보너스"],
  money: [
    "요리 판매가 +1%", "+2%", "+3%", "+4%", "+5%", "+6%", "+10%", "+15%", "+30%", "+50%"
  ],
  king: ["대왕 작물 확률 +0.5%", "+1%", "+3%", "+5%"],
  seedBonus: [
    "수확 시 1% 확률로 씨앗 드롭", "2%", "3%", "4%", "5%", "6%", "7%", "10%", "20%", "30%"
  ],
  fire: [
    "채집 시 1% 확률로 베이스 1개", "2% 확률로 베이스 1개", "3% 확률로 베이스 2개",
    "4% 확률로 베이스 2개", "5% 확률로 베이스 2개", "6% 확률로 베이스 3개",
    "7% 확률로 베이스 3개", "8% 확률로 베이스 5개", "9% 확률로 베이스 5개", "15% 확률로 베이스 7개"
  ]
}

export const COOKING_RECIPES = [
  { name: "토마토 스파게티", ingredients: "토마토 베이스 1개 + 호박 묶음 1개", minPrice: 243, maxPrice: 810 },
  { name: "어니언 링", ingredients: "양파 베이스 2개 + 요리용 소금 1개", minPrice: 388, maxPrice: 1296 },
  { name: "갈릭 케이크", ingredients: "마늘 베이스 1개 + 당근 묶음 1개", minPrice: 243, maxPrice: 810 },
  { name: "삼겹살 토마토 찌개", ingredients: "토마토 베이스 2개 + 비트 묶음 + 소금 + 돼지고기", minPrice: 576, maxPrice: 1921 },
  { name: "삼색 아이스크림", ingredients: "양파 베이스 2개 + 수박 묶음 + 코코넛 + 설탕 + 우유", minPrice: 758, maxPrice: 2527 },
  { name: "마늘 양갈비 핫도그", ingredients: "마늘 베이스 2개 + 감자 묶음 + 오일 + 양고기", minPrice: 549, maxPrice: 1832 },
  { name: "달콤 시리얼", ingredients: "토마토 베이스 2개 + 열매 묶음 + 파인애플 + 밀가루 + 오일", minPrice: 589, maxPrice: 1964 },
  { name: "로스트 치킨 파이", ingredients: "마늘 베이스 2개 + 당근 묶음 + 버터 + 닭고기", minPrice: 675, maxPrice: 2253 },
  { name: "스윗 치킨 햄버거", ingredients: "토마토+양파 베이스 + 비트+열매 묶음 + 닭고기", minPrice: 1083, maxPrice: 3612 },
  { name: "토마토 파인애플 피자", ingredients: "토마토+마늘 베이스 + 파인애플 + 치즈 + 스테이크", minPrice: 878, maxPrice: 2930 },
  { name: "양파 수프", ingredients: "양파 베이스 2개 + 마늘 + 감자 + 코코넛 + 버터 + 돼지고기", minPrice: 1000, maxPrice: 3335 },
  { name: "허브 삼겹살 찜", ingredients: "마늘+양파 베이스 + 호박 + 소금 + 오일 + 삼겹살", minPrice: 749, maxPrice: 2499 },
  { name: "토마토 라자냐", ingredients: "토마토+양파+마늘 베이스 + 당근+호박 + 밀가루 + 양고기", minPrice: 1253, maxPrice: 4177 },
  { name: "딥 크림 빠네", ingredients: "토마토+양파+마늘 베이스 + 수박+감자 + 치즈 + 우유", minPrice: 1151, maxPrice: 3837 },
  { name: "트리플 소갈비 꼬치", ingredients: "토마토+양파+마늘 베이스 + 당근+비트 + 설탕 + 갈비", minPrice: 1291, maxPrice: 4307 }
]

export const PROCESSING_RECIPES = [
  { name: "토마토 베이스", materials: "토마토 8개" },
  { name: "양파 베이스", materials: "양파 8개" },
  { name: "마늘 베이스", materials: "마늘 8개" },
  { name: "당근 묶음", materials: "당근 64개" },
  { name: "감자 묶음", materials: "감자 64개" },
  { name: "비트 묶음 x2", materials: "비트 64개" },
  { name: "호박 묶음 x2", materials: "호박 64개" },
  { name: "수박 묶음 x2", materials: "수박 64개" }
]
