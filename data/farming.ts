// 재배 관련 데이터
export const MINING_IMAGES: Record<string, string> = {
}

export const FARMING_STAMINA_PER_HARVEST = 7

// 괭이 레벨별 씨앗 드롭 수 (아일랜드 채집용) - 원본 JS 기준
// 괭이 레벨별 씨앗 드롭 수 (아일랜드 채집용)
export const HOE_DROPS: Record<number, number> = {
  0: 1,
  1: 2,
  2: 3,
  3: 3,
  4: 3,
  5: 4,
  6: 4,
  7: 4,
  8: 5,
  9: 5,
  10: 6,
  11: 8,
  12: 8,
  13: 10,
  14: 10,
  15: 15
}


// 괭이 강화 스펙 (위키 기준 - 마을 수확용)
// 괭이 강화 스펙 (위키/표 기준 - 마을 수확용)
export const HOE_STATS: Record<number, { drops: number; seed: number }> = {
  1:  { drops: 2, seed: 0 },
  2:  { drops: 3, seed: 0 },
  3:  { drops: 3, seed: 0 },
  4:  { drops: 3, seed: 0 },
  5:  { drops: 4, seed: 0 },

  6:  { drops: 4, seed: 0 },
  7:  { drops: 4, seed: 0 },
  8:  { drops: 5, seed: 0 },
  9:  { drops: 5, seed: 0 },
  10: { drops: 6, seed: 0 },

  11: { drops: 8, seed: 0 },
  12: { drops: 8, seed: 0 },
  13: { drops: 10, seed: 0 },
  14: { drops: 10, seed: 0 },
  15: { drops: 15, seed: 0 }
}


// 전문가: 자연이 주는 선물 (아일랜드 채집 시 씨앗 추가)
export const EXPERT_GIFT: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.01, count: 1 }, 2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 }, 4: { rate: 0.04, count: 1 }, 5: { rate: 0.05, count: 2 },
  6: { rate: 0.06, count: 2 }, 7: { rate: 0.07, count: 3 }, 8: { rate: 0.08, count: 4 },
  9: { rate: 0.09, count: 5 }, 10: { rate: 0.10, count: 8 }
}

// 전문가: 오늘도 풍년이다! (마을 수확 시 농작물 추가)
export const EXPERT_HARVEST: Record<number, { rate: number; count: number }> = {
  0: { rate: 0, count: 0 }, 1: { rate: 0.01, count: 1 }, 2: { rate: 0.02, count: 1 },
  3: { rate: 0.03, count: 1 }, 4: { rate: 0.04, count: 1 }, 5: { rate: 0.05, count: 2 },
  6: { rate: 0.07, count: 2 }, 7: { rate: 0.10, count: 3 }
}

// 전문가: 불붙은 괭이 (아일랜드 채집 시 베이스 추가)
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

// 작물별 수확 배율
export const CROP_DROP_RATE: Record<string, number> = { 
  tomato: 2.0, 
  onion: 1.5, 
  garlic: 2.5 
}

// 대왕 작물 기본 확률
export const KING_CROP_BASE_CHANCE = 0.02
export const KING_CROP_MULTIPLIER = 7

// 전문가: 대왕 작물 확률
export const EXPERT_KING_DATA = [
  { bonus: 0, desc: "효과 없음" },
  { bonus: 0.005, desc: "+0.5%" },
  { bonus: 0.01, desc: "+1%" },
  { bonus: 0.03, desc: "+3%" },
  { bonus: 0.05, desc: "+5%" }
]

// 전문가: 요리 판매가 보너스
export const EXPERT_MONEY_DATA = [
  { bonus: 0, desc: "효과 없음" },
  { bonus: 0.01, desc: "+1%" },
  { bonus: 0.02, desc: "+2%" },
  { bonus: 0.03, desc: "+3%" },
  { bonus: 0.04, desc: "+4%" },
  { bonus: 0.05, desc: "+5%" },
  { bonus: 0.06, desc: "+6%" },
  { bonus: 0.10, desc: "+10%" },
  { bonus: 0.15, desc: "+15%" },
  { bonus: 0.30, desc: "+30%" },
  { bonus: 0.50, desc: "+50%" }
]

// 전문가: 수확 보너스 (효율 계산용)
export const EXPERT_HARVEST_DATA = [
  { rate: 0, count: 0, desc: "효과 없음" },
  { rate: 0.01, count: 1, desc: "수확 시 1% 확률로 +1개" },
  { rate: 0.02, count: 1, desc: "수확 시 2% 확률로 +1개" },
  { rate: 0.03, count: 1, desc: "수확 시 3% 확률로 +1개" },
  { rate: 0.04, count: 1, desc: "수확 시 4% 확률로 +1개" },
  { rate: 0.05, count: 2, desc: "수확 시 5% 확률로 +2개" },
  { rate: 0.07, count: 2, desc: "수확 시 7% 확률로 +2개" },
  { rate: 0.10, count: 3, desc: "수확 시 10% 확률로 +3개" }
]

export const FARMING_EXPERT_DESC = {
  gift: [
    "채집 시 1% 확률로 씨앗 +1개",
    "채집 시 2% 확률로 씨앗 +1개",
    "채집 시 3% 확률로 씨앗 +1개",
    "채집 시 4% 확률로 씨앗 +1개",
    "채집 시 5% 확률로 씨앗 +2개",
    "채집 시 6% 확률로 씨앗 +2개",
    "채집 시 7% 확률로 씨앗 +3개",
    "채집 시 8% 확률로 씨앗 +4개",
    "채집 시 9% 확률로 씨앗 +5개",
    "채집 시 10% 확률로 씨앗 +8개"
  ],
  harvest: [
    "수확 시 1% 확률로 농작물 +1개",
    "수확 시 2% 확률로 농작물 +1개",
    "수확 시 3% 확률로 농작물 +1개",
    "수확 시 4% 확률로 농작물 +1개",
    "수확 시 5% 확률로 농작물 +2개",
    "수확 시 7% 확률로 농작물 +2개",
    "수확 시 10% 확률로 농작물 +3개"
  ],
  pot: [
    "3세트 이상 판매 시 1% 보너스",
    "3세트 이상 판매 시 2% 보너스",
    "3세트 이상 판매 시 3% 보너스",
    "3세트 이상 판매 시 4% 보너스",
    "3세트 이상 판매 시 7% 보너스"
  ],
  money: [
    "요리 판매가 +1%",
    "요리 판매가 +2%",
    "요리 판매가 +3%",
    "요리 판매가 +4%",
    "요리 판매가 +5%",
    "요리 판매가 +6%",
    "요리 판매가 +10%",
    "요리 판매가 +15%",
    "요리 판매가 +30%",
    "요리 판매가 +50%"
  ],
  king: [
    "대왕 작물 확률 +0.5%", 
    "대왕 작물 확률 +1%", 
    "대왕 작물 확률 +3%",
    "대왕 작물 확률 +5%"
  ],
  seedBonus: [
    "수확 시 1% 확률로 씨앗 드롭",
    "수확 시 2% 확률로 씨앗 드롭",
    "수확 시 3% 확률로 씨앗 드롭",
    "수확 시 4% 확률로 씨앗 드롭",
    "수확 시 5% 확률로 씨앗 드롭",
    "수확 시 6% 확률로 씨앗 드롭",
    "수확 시 7% 확률로 씨앗 드롭",
    "수확 시 10% 확률로 씨앗 드롭",
    "수확 시 20% 확률로 씨앗 드롭",
    "수확 시 30% 확률로 씨앗 드롭"
  ],
  fire: [
    "채집 시 1% 확률로 베이스 1개 추가 드롭",
    "채집 시 2% 확률로 베이스 1개 추가 드롭",
    "채집 시 3% 확률로 베이스 2개 추가 드롭",
    "채집 시 4% 확률로 베이스 2개 추가 드롭",
    "채집 시 5% 확률로 베이스 2개 추가 드롭",
    "채집 시 6% 확률로 베이스 3개 추가 드롭",
    "채집 시 7% 확률로 베이스 3개 추가 드롭",
    "채집 시 8% 확률로 베이스 5개 추가 드롭",
    "채집 시 9% 확률로 베이스 5개 추가 드롭",
    "채집 시 15% 확률로 베이스 7개 추가 드롭"
  ]
}

// 기본 시세 설정 (3일마다 수정)
export const DEFAULT_PRICES: Record<string, number> = {
  "토마토 스파게티": 267,
  "어니언 링": 419,
  "갈릭 케이크": 508,
  "삼겹살 토마토 찌개": 1049,
  "삼색 아이스크림": 2642,
  "마늘 양갈비 핫도그": 1292,
  "달콤 시리얼": 1599,
  "로스트 치킨 파이": 1471,
  "스윗 치킨 햄버거": 982,
  "토마토 파인애플 피자": 3050,
  "양파 수프": 2434,
  "허브 삼겹살 찜": 1881,
  "토마토 라자냐": 1259,
  "딥 크림 빠네": 2779,
  "트리플 소갈비 꼬치": 1335
}

// 효율 계산용 요리 레시피 데이터 (베이스 필요량 포함)
export interface EfficiencyRecipe {
  name: string
  bases: { tomato: number; onion: number; garlic: number }
  minPrice: number
  maxPrice: number
  img: string
  ingredients: string
}

export const EFFICIENCY_RECIPES: EfficiencyRecipe[] = [
  { name: "토마토 스파게티", bases: { tomato: 1, onion: 0, garlic: 0 }, minPrice: 259, maxPrice: 864, img: "food_tomato_spaghetti.png", ingredients: "토마토 베이스 1개 + 호박 묶음 1개" },
  { name: "어니언 링", bases: { tomato: 0, onion: 1, garlic: 0 }, minPrice: 307, maxPrice: 1026, img: "food_onion_ring.png", ingredients: "양파 베이스 2개 + 요리용 소금 1개" },
  { name: "갈릭 케이크", bases: { tomato: 0, onion: 0, garlic: 1 }, minPrice: 226, maxPrice: 756, img: "food_garlic_cake.png", ingredients: "마늘 베이스 1개 + 당근 묶음 1개" },
  { name: "삼겹살 토마토 찌개", bases: { tomato: 2, onion: 0, garlic: 0 }, minPrice: 611, maxPrice: 2039, img: "food_pork_tomato_stew.png", ingredients: "토마토 베이스 2개 + 비트 묶음 1개 + 요리용 소금 1개 + 익힌 돼지고기 1개 + 익힌 돼지 삼겹살 1개" },
  { name: "삼색 아이스크림", bases: { tomato: 0, onion: 2, garlic: 0 }, minPrice: 906, maxPrice: 3022, img: "food_icecream_triple.png", ingredients: "양파 베이스 2개 + 수박 묶음 1개 + 코코넛 1개 + 설탕 큐브 1개 + 요리용 우유 1개" },
  { name: "마늘 양갈비 핫도그", bases: { tomato: 0, onion: 0, garlic: 2 }, minPrice: 513, maxPrice: 1713, img: "food_garlic_lamb_hotdog.png", ingredients: "마늘 베이스 2개 + 감자 묶음 1개 + 오일 1개 + 익힌 양고기 1개 + 익힌 양 갈비살 1개" },
  { name: "달콤 시리얼", bases: { tomato: 2, onion: 0, garlic: 0 }, minPrice: 773, maxPrice: 2578, img: "food_sweet_cereal.png", ingredients: "토마토 베이스 2개 + 달콤한 열매 묶음 1개 + 파인애플 1개 + 밀가루 반죽 1개 + 오일 1개" },
  { name: "로스트 치킨 파이", bases: { tomato: 0, onion: 0, garlic: 2 }, minPrice: 640, maxPrice: 2134, img: "food_roast_chicken_pie.png", ingredients: "마늘 베이스 2개 + 당근 묶음 1개 + 버터 조각 1개 + 익힌 닭고기 1개 + 익힌 닭 다리살 1개" },
  { name: "스윗 치킨 햄버거", bases: { tomato: 1, onion: 1, garlic: 0 }, minPrice: 970, maxPrice: 3234, img: "food_sweet_chicken_burger.png", ingredients: "토마토 베이스 1개 + 양파 베이스 1개 + 비트 묶음 1개 + 달콤한 열매 묶음 1개 + 익힌 닭 가슴살 1개 + 익힌 닭 다리살 1개" },
  { name: "토마토 파인애플 피자", bases: { tomato: 2, onion: 0, garlic: 2 }, minPrice: 1036, maxPrice: 3455, img: "food_tomato_pineapple_pizza.png", ingredients: "토마토 베이스 2개 + 마늘 베이스 2개 + 파인애플 1개 + 치즈 조각 1개 + 스테이크 1개 + 익힌 소 등심 1개" },
  { name: "양파 수프", bases: { tomato: 0, onion: 2, garlic: 1 }, minPrice: 1139, maxPrice: 3797, img: "food_onion_soup.png", ingredients: "양파 베이스 2개 + 마늘 베이스 1개 + 감자 묶음 1개 + 코코넛 1개 + 버터 조각 1개 + 익힌 돼지 앞다리살 1개" },
  { name: "허브 삼겹살 찜", bases: { tomato: 0, onion: 1, garlic: 2 }, minPrice: 894, maxPrice: 2982, img: "food_herb_pork_steam.png", ingredients: "마늘 베이스 2개 + 양파 베이스 1개 + 호박 묶음 1개 + 요리용 소금 1개 + 오일 1개 + 익힌 돼지 삼겹살 1개" },
  { name: "토마토 라자냐", bases: { tomato: 1, onion: 1, garlic: 1 }, minPrice: 1253, maxPrice: 4177, img: "food_tomato_lasagna.png", ingredients: "토마토 베이스 1개 + 양파 베이스 1개 + 마늘 베이스 1개 + 당근 묶음 1개 + 호박 묶음 1개 + 밀가루 반죽 1개 + 익힌 양 다리살 1개" },
  { name: "딥 크림 빠네", bases: { tomato: 1, onion: 1, garlic: 1 }, minPrice: 1151, maxPrice: 3837, img: "food_cream_pane.png", ingredients: "토마토 베이스 1개 + 양파 베이스 1개 + 마늘 베이스 1개 + 수박 묶음 1개 + 감자 묶음 1개 + 치즈 조각 1개 + 요리용 우유 1개" },
  { name: "트리플 소갈비 꼬치", bases: { tomato: 1, onion: 1, garlic: 1 }, minPrice: 1291, maxPrice: 4307, img: "food_beef_rib_skewer.png", ingredients: "토마토 베이스 1개 + 양파 베이스 1개 + 마늘 베이스 1개 + 당근 묶음 1개 + 비트 묶음 1개 + 설탕 큐브 1개 + 익힌 소 갈비살 1개" }
]

// 씨앗 이미지
export const SEED_IMAGES: Record<string, string> = {
  tomato: "/img/farming/tomato_seed.png",
  onion: "/img/farming/onion_seed.png",
  garlic: "/img/farming/garlic_seed.png"
}

// 씨앗 이름
export const SEED_NAMES: Record<string, string> = {
  tomato: "토마토 씨앗",
  onion: "양파 씨앗",
  garlic: "마늘 씨앗"
}

export const COOKING_RECIPES = [
  { name: "토마토 스파게티", ingredients: "토마토 베이스 1개 + 호박 묶음 1개", minPrice: 259, maxPrice: 864 },
  { name: "어니언 링", ingredients: "양파 베이스 2개 + 요리용 소금 1개", minPrice: 307, maxPrice: 1026 },
  { name: "갈릭 케이크", ingredients: "마늘 베이스 1개 + 당근 묶음 1개", minPrice: 226, maxPrice: 756 },
  { name: "삼겹살 토마토 찌개", ingredients: "토마토 베이스 2개 + 비트 묶음 + 소금 + 돼지고기", minPrice: 611, maxPrice: 2039 },
  { name: "삼색 아이스크림", ingredients: "양파 베이스 2개 + 수박 묶음 + 코코넛 + 설탕 + 우유", minPrice: 906, maxPrice: 3022 },
  { name: "마늘 양갈비 핫도그", ingredients: "마늘 베이스 2개 + 감자 묶음 + 오일 + 양고기", minPrice: 513, maxPrice: 1713 },
  { name: "달콤 시리얼", ingredients: "토마토 베이스 2개 + 열매 묶음 + 파인애플 + 밀가루 + 오일", minPrice: 773, maxPrice: 2578 },
  { name: "로스트 치킨 파이", ingredients: "마늘 베이스 2개 + 당근 묶음 + 버터 + 닭고기", minPrice: 640, maxPrice: 2134 },
  { name: "스윗 치킨 햄버거", ingredients: "토마토+양파 베이스 + 비트+열매 묶음 + 닭고기", minPrice: 970, maxPrice: 3234 },
  { name: "토마토 파인애플 피자", ingredients: "토마토+마늘 베이스 + 파인애플 + 치즈 + 스테이크", minPrice: 1036, maxPrice: 3455 },
  { name: "양파 수프", ingredients: "양파 베이스 2개 + 마늘 + 감자 + 코코넛 + 버터 + 돼지고기", minPrice: 1139, maxPrice: 3797 },
  { name: "허브 삼겹살 찜", ingredients: "마늘+양파 베이스 + 호박 + 소금 + 오일 + 삼겹살", minPrice: 894, maxPrice: 2982 },
  { name: "토마토 라자냐", ingredients: "토마토+양파+마늘 베이스 + 당근+호박 + 밀가루 + 양고기", minPrice: 1253, maxPrice: 4177 },
  { name: "딥 크림 빠네", ingredients: "토마토+양파+마늘 베이스 + 수박+감자 + 치즈 + 우유", minPrice: 1151, maxPrice: 3837 },
  { name: "트리플 소갈비 꼬치", ingredients: "토마토+양파+마늘 베이스 + 당근+비트 + 설탕 + 갈비", minPrice: 1291, maxPrice: 4307 }
]

export const PROCESSING_RECIPES = [
  { name: "당근 묶음", materials: "당근 64개", img:"carrot.png" },
  { name: "감자 묶음", materials: "감자 64개", img:"potato.png" },
  { name: "비트 묶음 x2", materials: "비트 64개", img:"beat.png" },
  { name: "호박 묶음 x2", materials: "호박 64개", img:"pumpkin.png" },
  { name: "수박 묶음 x2", materials: "수박 64개", img:"watermelon.png" },
  { name: "달콤한 열매 묶음", materials: "달콤한 열매 64개", img:"sweet.png" },
  { name: "설탕 큐브", materials: "사탕수수 64개", img:"sugar.png" },
  { name: "요리용 소금", materials: "소금 16개", img:"salt.png" },
  { name: "토마토 베이스", materials: "토마토 8개", img:"tomato_base.png" },
  { name: "양파 베이스", materials: "양파 8개", img:"onion_base.png" },
  { name: "마늘 베이스", materials: "마늘 8개", img:"garlic_base.png" },
  { name: "치즈 조각", materials: "요리용 우유 8개 + 소금 8개", img:"chesse.png" },
  { name: "밀가루 반죽", materials: "밀 12개 + 요리용 달걀 4개", img:"kneading.png" },
  { name: "버터 조각", materials: "요리용 우유 8개 + 소금 4개 + 오일 4개", img:"butter.png" },
]