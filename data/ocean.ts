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
  1: { drop: 2, clamRate: 0.01 }, 2: { drop: 2, clamRate: 0.01 }, 3: { drop: 3, clamRate: 0.02 },
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
  clamSell: ["공예품 판매가 +5%", "+7%", "+10%", "+15%", "+20%", "+30%", "+40%", "+50%"],
  premium: ["연금품 판매가 +5%", "+7%", "+10%", "+15%", "+20%", "+30%", "+40%", "+50%"],
  deepSea: ["수중 어획 시 5% 확률로 추가 드롭", "7%", "10%", "15%", "20%"],
  star: ["3성 등급 확률 +1%", "+3%", "+5%", "+7%", "+10%", "+15%"],
  clamRefill: ["조개 등장 확률 +1%", "+2%", "+3%", "+4%", "+5%", "+6%", "+7%", "+8%", "+9%", "+10%"]
}

export const RECIPES_1STAR = [
  { name: "수호의 정수 (2개)", ingredients: "굴★ 2개 + 점토 1개", price: "-" },
  { name: "파동의 정수 (2개)", ingredients: "소라★ 2개 + 모래 2개", price: "-" },
  { name: "혼란의 정수 (2개)", ingredients: "문어★ 2개 + 흙 4개", price: "-" },
  { name: "생명의 정수 (2개)", ingredients: "미역★ 2개 + 자갈 2개", price: "-" },
  { name: "부식의 정수 (2개)", ingredients: "성게★ 2개 + 화강암 1개", price: "-" },
  { name: "물결 수호의 핵", ingredients: "수호 정수 + 파동 정수 + 새우", price: "-" },
  { name: "파동 오염의 핵", ingredients: "파동 정수 + 혼란 정수 + 도미", price: "-" },
  { name: "질서 파괴의 핵", ingredients: "혼란 정수 + 생명 정수 + 청어", price: "-" },
  { name: "활력 붕괴의 핵", ingredients: "생명 정수 + 부식 정수 + 금붕어", price: "-" },
  { name: "침식 방어의 핵", ingredients: "부식 정수 + 수호 정수 + 농어", price: "-" },
  { name: "영생의 아쿠티스 ★", ingredients: "물결수호 + 질서파괴 + 활력붕괴 핵", price: "5,669" },
  { name: "크라켄의 광란체 ★", ingredients: "질서파괴 + 활력붕괴 + 파동오염 핵", price: "5,752" },
  { name: "리바이던의 깃털 ★", ingredients: "침식방어 + 파동오염 + 물결수호 핵", price: "5,927" }
]

export const RECIPES_2STAR = [
  { name: "수호 에센스 (2개)", ingredients: "굴★★ 2개 + 해초 2개 + 참나무 잎 4개", price: "-" },
  { name: "파동 에센스 (2개)", ingredients: "소라★★ 2개 + 해초 2개 + 가문비나무 잎 4개", price: "-" },
  { name: "혼란 에센스 (2개)", ingredients: "문어★★ 2개 + 해초 2개 + 자작나무 잎 4개", price: "-" },
  { name: "생명 에센스 (2개)", ingredients: "미역★★ 2개 + 해초 2개 + 아카시아나무 잎 4개", price: "-" },
  { name: "부식 에센스 (2개)", ingredients: "성게★★ 2개 + 해초 2개 + 벚나무 잎 4개", price: "-" },
  { name: "활기 보존의 결정", ingredients: "수호 + 생명 에센스 + 켈프 + 청금석", price: "-" },
  { name: "파도 침식의 결정", ingredients: "파동 + 부식 에센스 + 켈프 + 레드스톤", price: "" },
  { name: "방어 오염의 결정", ingredients: "혼란 + 수호 에센스 + 켈프 + 철", price: "-" },
  { name: "격류 재생의 결정", ingredients: "생명 + 파동 에센스 + 켈프 + 금", price: "-" },
  { name: "맹독 혼란의 결정", ingredients: "부식 + 혼란 에센스 + 켈프 + 다이아", price: "-" },
  { name: "해구의 파동 코어 ★★", ingredients: "활기보존 + 파도침식 + 격류재생 결정", price: "12,231" },
  { name: "침묵의 심해 비약 ★★", ingredients: "파도침식 + 격류재생 + 맹독혼란 결정", price: "12,354" },
  { name: "청해룡의 날개 ★★", ingredients: "방어오염 + 맹독혼란 + 활기보존 결정", price: "12,527" }
]

export const RECIPES_3STAR = [
  { name: "수호의 엘릭서", ingredients: "굴★★★ + 불우렁쉥이 + 유리병 3개 + 네더랙 4개", price: "-" },
  { name: "파동의 엘릭서", ingredients: "소라★★★ + 불우렁쉥이 + 유리병 3개 + 마그마 블록 2개", price: "-" },
  { name: "혼란의 엘릭서", ingredients: "문어★★★ + 불우렁쉥이 + 유리병 3개 + 영혼 흙 2개", price: "-" },
  { name: "생명의 엘릭서", ingredients: "미역★★★ + 불우렁쉥이 + 유리병 3개 + 진홍빛 자루 2개", price: "-" },
  { name: "부식의 엘릭서", ingredients: "성게★★★ + 불우렁쉥이 + 유리병 3개 + 뒤틀린 자루 2개", price: "-" },
  { name: "불멸 재생의 영약", ingredients: "수호+생명 엘릭서 + 말린 켈프 + 발광 열매 + 죽은 산호", price: "-" },
  { name: "파동 장벽의 영약", ingredients: "파동+수호 엘릭서 + 말린 켈프 + 발광 열매 + 죽은 산호", price: "-" },
  { name: "타락 침식의 영약", ingredients: "혼란+부식 엘릭서 + 말린 켈프 + 발광 열매 + 죽은 산호", price: "-" },
  { name: "생명 광란의 영약", ingredients: "생명+혼란 엘릭서 + 말린 켈프 + 발광 열매 + 죽은 산호", price: "-" },
  { name: "맹독 파동의 영약", ingredients: "부식+파동 엘릭서 + 말린 켈프 + 발광 열매 + 죽은 산호", price: "-" },
  { name: "아쿠아 펄스 파편 ★★★", ingredients: "불멸재생 + 파동장벽 + 맹독파동 영약", price: "20,863" },
  { name: "나우틸러스의 손 ★★★", ingredients: "파동장벽 + 생명광란 + 불멸재생 영약", price: "21,107" },
  { name: "무저의 척추 ★★★", ingredients: "타락침식 + 맹독파동 + 생명광란 영약", price: "21,239" }
]

export const RECIPES_CRAFT = [
  { name: "금속 재활용품", ingredients: "캔 2개", minPrice: "-", maxPrice: "-" },
  { name: "합금 재활용품", ingredients: "통조림 2개", minPrice: "-", maxPrice: "-" },
  { name: "조개껍데기 브로치", ingredients: "깨진 조개 + 노란빛 진주 + 금속 재활용 + 거미줄", minPrice: "0", maxPrice: "50,000" },
  { name: "푸른 향수병", ingredients: "깨진 조개 2개 + 푸른빛 진주 + 재활용품 + 양동이", minPrice: "0", maxPrice: "100,000" },
  { name: "자개 손거울", ingredients: "깨진 조개 3개 + 청록빛 진주 + 재활용품 + 유리판", minPrice: "0", maxPrice: "200,000" },
  { name: "분홍 헤어핀", ingredients: "깨진 조개 4개 + 분홍빛 진주 + 재활용품 + 대나무 + 꽃잎", minPrice: "0", maxPrice: "300,000" },
  { name: "자개 부채", ingredients: "깨진 조개 5개 + 보라빛 진주 + 재활용품 + 막대기 + 자수정", minPrice: "0", maxPrice: "500,000" },
  { name: "흑진주 시계", ingredients: "깨진 조개 7개 + 흑진주 + 재활용품 + 흑요석 + 시계", minPrice: "0", maxPrice: "700,000" }
]
