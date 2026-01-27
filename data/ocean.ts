// 해양 관련 데이터

export const FISH_IMAGES: Record<string, string> = {
  oyster: '/img/ocean/oyster.png',
  conch: '/img/ocean/conch.png',
  octopus: '/img/ocean/octopus.png',
  seaweed: '/img/ocean/seaweed.png',
  urchin: '/img/ocean/urchin.png',
}


export const OCEAN_STAMINA_PER_GATHER = 15

export const ROD_DATA: Record<number, { drop: number; clamRate: number }> = {
  1: { drop: 2, clamRate: 0.01 },
  2: { drop: 2, clamRate: 0.01 }, 3: { drop: 3, clamRate: 0.02 },
  4: { drop: 3, clamRate: 0.02 }, 5: { drop: 3, clamRate: 0.02 }, 6: { drop: 4, clamRate: 0.03 },
  7: { drop: 4, clamRate: 0.03 }, 8: { drop: 4, clamRate: 0.03 }, 9: { drop: 5, clamRate: 0.05 },
  10: { drop: 5, clamRate: 0.05 }, 11: { drop: 5, clamRate: 0.07 }, 12: { drop: 6, clamRate: 0.07 },
  13: { drop: 6, clamRate: 0.09 }, 14: { drop: 7, clamRate: 0.09 }, 15: { drop: 10, clamRate: 0.15 }
}

export const EXPERT_DEEP_SEA: Record<number, number> = {
  0: 0, 1: 0.05, 2: 0.07, 3: 0.10, 4: 0.15, 5: 0.20
}

export const EXPERT_STAR: Record<number, number> = {
  0: 0, 1: 0.01, 2: 0.03, 3: 0.05, 4: 0.07, 5: 0.10, 6: 0.15
}

export const EXPERT_CLAM_REFILL: Record<number, number> = {
  0: 0, 1: 0.01, 2: 0.02, 3: 0.03, 4: 0.04, 5: 0.05, 6: 0.06, 7: 0.07, 8: 0.08, 9: 0.09, 10: 0.10
}

export const PREMIUM_RATE: Record<number, number> = {
  0: 0, 1: 0.05, 2: 0.07, 3: 0.10, 4: 0.15, 5: 0.20, 6: 0.30, 7: 0.40, 8: 0.50
}

export const GOLD_PRICES = {
  '1star': { A: 5669, K: 5752, L: 5927 },
  '2star': { CORE: 12231, POTION: 12354, WING: 12527 },
  '3star': { AQUA: 20863, NAUTILUS: 21107, SPINE: 21239 }
}

export const FISH_DATA: Record<string, { name: string }> = {
  oyster: { name: '굴' }, conch: { name: '소라' }, octopus: { name: '문어' },
  seaweed: { name: '미역' }, urchin: { name: '성게' }
}

export const OCEAN_EXPERT_DESC = {
  clamSell: ["공예품 판매가 +5%", "공예품 판매가 +7%", "공예품 판매가 +10%", "공예품 판매가 +15%",
           "공예품 판매가 +20%", "공예품 판매가 +30%", "공예품 판매가 +40%", "공예품 판매가 +50%"],
  premium: ["연금품 판매가 +5%", "연금품 판매가 +7%", "연금품 판매가 +10%", "연금품 판매가 +15%",
           "연금품 판매가 +20%", "연금품 판매가 +30%", "연금품 판매가 +40%", "연금품 판매가 +50%"],
  deepSea: ["수중 어획 시 5% 확률로 추가 드롭", "수중 어획 시 7% 확률로 추가 드롭", "수중 어획 시 10% 확률로 추가 드롭",
           "수중 어획 시 15% 확률로 추가 드롭", "수중 어획 시 20% 확률로 추가 드롭"],
  star: ["3성 등급 확률 +1%", "3성 등급 확률 +3%", "3성 등급 확률 +5%", "3성 등급 확률 +7%",
         "3성 등급 확률 +10%", "3성 등급 확률 +15%"],
  clamRefill: ["조개 등장 확률 +1%", "조개 등장 확률 +2%", "조개 등장 확률 +3%", "조개 등장 확률 +4%", "조개 등장 확률 +5%",
     "조개 등장 확률 +6%", "조개 등장 확률 +7%", "조개 등장 확률 +8%", "조개 등장 확률 +9%", "조개 등장 확률 +10%"]
}

export const RECIPES_1STAR = [
  { name: "추출된 희석액", ingredients: "침식 방어의 핵 ★ 3개 + 방어 오염의 결정 ★★ 2개 + 타락 침식의 영약 ★★★ 1개", price: "17,566G" },
  { name: "수호의 정수 (2개)", ingredients: "굴★ 2개 + 점토 2개", price: "" },
  { name: "파동의 정수 (2개)", ingredients: "소라★ 2개 + 모래 4개", price: "" },
  { name: "혼란의 정수 (2개)", ingredients: "문어★ 2개 + 흙 8개", price: "" },
  { name: "생명의 정수 (2개)", ingredients: "미역★ 2개 + 자갈 4개", price: "" },
  { name: "부식의 정수 (2개)", ingredients: "성게★ 2개 + 화강암 2개", price: "" },

  { name: "물결 수호의 핵", ingredients: "수호의 정수 + 파동의 정수 + 익히지 않은 새우", price: "" },
  { name: "파동 오염의 핵", ingredients: "파동의 정수 + 혼란의 정수 + 익히지 않은 도미", price: "" },
  { name: "질서 파괴의 핵", ingredients: "혼란의 정수 + 생명의 정수 + 익히지 않은 청어", price: "" },
  { name: "활력 붕괴의 핵", ingredients: "생명의 정수 + 부식의 정수 + 금붕어", price: "" },
  { name: "침식 방어의 핵", ingredients: "부식의 정수 + 수호의 정수 + 농어", price: "" },

  { name: "영생의 아쿠티스", ingredients: "물결 수호의 핵 + 질서 파괴의 핵 + 활력 붕괴의 핵", price: "5,669G" },
  { name: "크라켄의 광란체", ingredients: "질서 파괴의 핵 + 활력 붕괴의 핵 + 파동 오염의 핵", price: "5,752G" },
  { name: "리바이던의 깃털", ingredients: "침식 방어의 핵 + 파동 오염의 핵 + 물결 수호의 핵", price: "5,927G" },
]


export const RECIPES_2STAR = [
  { name: "수호 에센스 (2개)", ingredients: "굴★★ 2개 + 해초 4개 + 참나무 잎 6개", price: "" },
  { name: "파동 에센스 (2개)", ingredients: "소라★★ 2개 + 해초 4개 + 가문비나무 잎 6개", price: "" },
  { name: "혼란 에센스 (2개)", ingredients: "문어★★ 2개 + 해초 4개 + 자작나무 잎 6개", price: "" },
  { name: "생명 에센스 (2개)", ingredients: "미역★★ 2개 + 해초 4개 + 아카시아나무 잎 6개", price: "" },
  { name: "부식 에센스 (2개)", ingredients: "성게★★ 2개 + 해초 4개 + 벚나무 잎 6개", price: "" },

  { name: "활기 보존의 결정", ingredients: "수호 에센스 + 생명 에센스 + 켈프 4개 + 청금석 블록 1개", price: "" },
  { name: "파도 침식의 결정", ingredients: "파동 에센스 + 부식 에센스 + 켈프 4개 + 레드스톤 블록 1개", price: "" },
  { name: "방어 오염의 결정", ingredients: "혼란 에센스 + 수호 에센스 + 켈프 4개 + 철 주괴 3개", price: "" },
  { name: "격류 재생의 결정", ingredients: "생명 에센스 + 파동 에센스 + 켈프 4개 + 금 주괴 2개", price: "" },
  { name: "맹독 혼란의 결정", ingredients: "부식 에센스 + 혼란 에센스 + 켈프 4개 + 다이아몬드 1개", price: "" },

  { name: "해구 파동의 코어", ingredients: "활기 보존의 결정 + 파도 침식의 결정 + 격류 재생의 결정", price: "12,231G" },
  { name: "침묵의 심해 비약", ingredients: "파도 침식의 결정 + 격류 재생의 결정 + 맹독 혼란의 결정", price: "12,354G" },
  { name: "청해룡의 날개", ingredients: "방어 오염의 결정 + 맹독 혼란의 결정 + 활기 보존의 결정", price: "12,527G" },
]


export const RECIPES_3STAR = [
  { name: "수호의 엘릭서", ingredients: "굴★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 네더랙 8개", price: "" },
  { name: "파동의 엘릭서", ingredients: "소라★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 마그마 블록 4개", price: "" },
  { name: "혼란의 엘릭서", ingredients: "문어★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 영혼 흙 4개", price: "" },
  { name: "생명의 엘릭서", ingredients: "미역★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 진홍빛 자루 4개", price: "" },
  { name: "부식의 엘릭서", ingredients: "성게★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 뒤틀린 자루 4개", price: "" },

  { name: "불멸 재생의 영약", ingredients: "수호의 엘릭서 + 생명의 엘릭서 + 말린 켈프 6개 + 발광 열매 4개 + 죽은 관 산호 블록 2개", price: "" },
  { name: "파동 장벽의 영약", ingredients: "파동의 엘릭서 + 수호의 엘릭서 + 말린 켈프 6개 + 발광 열매 4개 + 죽은 사방산호 블록 2개", price: "" },
  { name: "타락 침식의 영약", ingredients: "혼란의 엘릭서 + 부식의 엘릭서 + 말린 켈프 6개 + 발광 열매 4개 + 죽은 거품 산호 블록 2개", price: "" },
  { name: "생명 광란의 영약", ingredients: "생명의 엘릭서 + 혼란의 엘릭서 + 말린 켈프 6개 + 발광 열매 4개 + 죽은 불 산호 블록 2개", price: "" },
  { name: "맹독 파동의 영약", ingredients: "부식의 엘릭서 + 파동의 엘릭서 + 말린 켈프 6개 + 발광 열매 4개 + 죽은 뇌 산호 블록 2개", price: "" },

  { name: "아쿠아 펄스 파편", ingredients: "불멸 재생의 영약 + 파동 장벽의 영약 + 맹독 파동의 영약", price: "20,863G" },
  { name: "나우틸러스의 손", ingredients: "파동 장벽의 영약 + 생명 광란의 영약 + 불멸 재생의 영약", price: "21,107G" },
  { name: "무저의 척추", ingredients: "타락 침식의 영약 + 맹독 파동의 영약 + 생명 광란의 영약", price: "21,239G" },
]


export const RECIPES_CRAFT = [
  { name: "금속 재활용품 (2개)", ingredients: "캔 2개", minPrice: "", maxPrice: "" },
  { name: "합금 재활용품 (2개)", ingredients: "통조림 2개", minPrice: "", maxPrice: "" },
  { name: "합성수지 재활용품 (2개)", ingredients: "비닐봉지 2개", minPrice: "", maxPrice: "" },
  { name: "플라스틱 재활용품 (2개)", ingredients: "페트병 2개", minPrice: "", maxPrice: "" },
  { name: "섬유 재활용품 (2개)", ingredients: "신발 2개", minPrice: "", maxPrice: "" },

  { name: "조개껍데기 브로치", ingredients: "깨진 조개껍데기 1개 + 노란빛 진주 1개 + 금속 재활용품 1개 + 거미줄 4개", minPrice: "0G", maxPrice: "50,000G" },
  { name: "푸른 향수병", ingredients: "깨진 조개껍데기 2개 + 푸른빛 진주 1개 + 합성수지 재활용품 1개 + 플라스틱 재활용품 1개 + 양동이 8개", minPrice: "0G", maxPrice: "100,000G" },
  { name: "자개 손거울", ingredients: "깨진 조개껍데기 3개 + 청록빛 진주 1개 + 합금 재활용품 2개 + 플라스틱 재활용품 2개 + 유리판 16개", minPrice: "0G", maxPrice: "200,000G" },
  { name: "분홍 헤어핀", ingredients: "깨진 조개껍데기 4개 + 분홍빛 진주 1개 + 합성수지 재활용품 3개 + 섬유 재활용품 3개 + 대나무 64개 + 분홍 꽃잎 16개", minPrice: "0G", maxPrice: "300,000G" },
  { name: "자개 부채", ingredients: "깨진 조개껍데기 5개 + 보라빛 진주 1개 + 합금 재활용품 5개 + 합성수지 재활용품 5개 + 막대기 64개 + 자수정 조각 16개", minPrice: "0G", maxPrice: "500,000G" },
  { name: "흑진주 시계", ingredients: "깨진 조개껍데기 7개 + 흑진주 1개 + 금속 재활용품 7개 + 합금 재활용품 7개 + 섬유 재활용품 7개 + 흑요석 16개 + 시계 8개", minPrice: "0G", maxPrice: "700,000G" },
]

