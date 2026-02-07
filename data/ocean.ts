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
  0: 0, 1: 0.05, 2: 0.07, 3: 0.09, 4: 0.12, 5: 0.15, 6: 0.20, 7: 0.25, 8: 0.30
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
  premium: ["연금품 판매가 +5%", "연금품 판매가 +7%", "연금품 판매가 +9%", "연금품 판매가 +12%",
           "연금품 판매가 +15%", "연금품 판매가 +20%", "연금품 판매가 +25%", "연금품 판매가 +30%"],
  deepSea: ["수중 어획 시 5% 확률로 추가 드롭", "수중 어획 시 7% 확률로 추가 드롭", "수중 어획 시 10% 확률로 추가 드롭",
           "수중 어획 시 15% 확률로 추가 드롭", "수중 어획 시 20% 확률로 추가 드롭"],
  star: ["3성 등급 확률 +1%", "3성 등급 확률 +3%", "3성 등급 확률 +5%", "3성 등급 확률 +7%",
         "3성 등급 확률 +10%", "3성 등급 확률 +15%"],
  clamRefill: ["조개 등장 확률 +1%", "조개 등장 확률 +2%", "조개 등장 확률 +3%", "조개 등장 확률 +4%", "조개 등장 확률 +5%",
     "조개 등장 확률 +6%", "조개 등장 확률 +7%", "조개 등장 확률 +8%", "조개 등장 확률 +9%", "조개 등장 확률 +10%"]
}

export const RECIPES_1STAR = [
  { name: "(0성) 추출된 희석액", ingredients: "침식방어의 핵★3개 + 방어오염의 결정★★2개 + 타락침식의 영약★★★1개", price: "17,566G", img: "hehe.png" },
  { name: "수호의 정수 (2개)", ingredients: "굴★ 2개 + 점토 2개", price: "", img : "essence_guard.png" },
  { name: "파동의 정수 (2개)", ingredients: "소라★ 2개 + 모래 4개", price: "", img : "essence_wave.png" },
  { name: "혼란의 정수 (2개)", ingredients: "문어★ 2개 + 흙 8개", price: "", img : "essence_chaos.png" },
  { name: "생명의 정수 (2개)", ingredients: "미역★ 2개 + 자갈 4개", price: "", img : "essence_life.png" },
  { name: "부식의 정수 (2개)", ingredients: "성게★ 2개 + 화강암 2개", price: "", img : "essence_decay.png" },

  { name: "물결 수호의 핵", ingredients: "수호의 정수 + 파동의 정수 + 익히지 않은 새우", price: "", img : "core_wg.png" },
  { name: "파동 오염의 핵", ingredients: "파동의 정수 + 혼란의 정수 + 익히지 않은 도미", price: "", img : "core_wp.png" },
  { name: "질서 파괴의 핵", ingredients: "혼란의 정수 + 생명의 정수 + 익히지 않은 청어", price: "", img : "core_od.png" },
  { name: "활력 붕괴의 핵", ingredients: "생명의 정수 + 부식의 정수 + 금붕어", price: "", img : "core_vd.png" },
  { name: "침식 방어의 핵", ingredients: "부식의 정수 + 수호의 정수 + 농어", price: "", img : "core_ed.png" },

  { name: "영생의 아쿠티스", ingredients: "물결 수호의 핵 + 질서 파괴의 핵 + 활력 붕괴의 핵", price: "5,669G", img : "akutis.png" },
  { name: "크라켄의 광란체", ingredients: "질서 파괴의 핵 + 활력 붕괴의 핵 + 파동 오염의 핵", price: "5,752G", img : "kraken.png" },
  { name: "리바이던의 깃털", ingredients: "침식 방어의 핵 + 파동 오염의 핵 + 물결 수호의 핵", price: "5,927G", img : "feather.png" },
]


export const RECIPES_2STAR = [
  { name: "수호 에센스 (2개)", ingredients: "굴★★ 2개 + 해초 6개 + 참나무 잎 6개", price: "", img : "essence_guard_2.png" },
  { name: "파동 에센스 (2개)", ingredients: "소라★★ 2개 + 해초 6개 + 가문비나무 잎 6개", price: "", img : "essence_wave_2.png" },
  { name: "혼란 에센스 (2개)", ingredients: "문어★★ 2개 + 해초 6개 + 자작나무 잎 6개", price: "", img : "essence_chaos_2.png" },
  { name: "생명 에센스 (2개)", ingredients: "미역★★ 2개 + 해초 6개 + 아카시아나무 잎 6개", price: "", img : "essence_life_2.png" },
  { name: "부식 에센스 (2개)", ingredients: "성게★★ 2개 + 해초 6개 + 벚나무 잎 6개", price: "", img : "essence_decay_2.png" },

  { name: "활기 보존의 결정", ingredients: "수호 에센스 + 생명 에센스 + 켈프 8개 + 청금석 블록 1개", price: "", img : "crystal_vital.png" },
  { name: "파도 침식의 결정", ingredients: "파동 에센스 + 부식 에센스 + 켈프 8개 + 레드스톤 블록 1개", price: "", img : "crystal_erosion.png" },
  { name: "방어 오염의 결정", ingredients: "혼란 에센스 + 수호 에센스 + 켈프 8개 + 철 주괴 3개", price: "", img : "crystal_defense.png" },
  { name: "격류 재생의 결정", ingredients: "생명 에센스 + 파동 에센스 + 켈프 8개 + 금 주괴 2개", price: "", img : "crystal_regen.png" },
  { name: "맹독 혼란의 결정", ingredients: "부식 에센스 + 혼란 에센스 + 켈프 8개 + 다이아몬드 1개", price: "", img : "crystal_poison.png" },

  { name: "해구 파동의 코어", ingredients: "활기 보존의 결정 + 파도 침식의 결정 + 격류 재생의 결정", price: "12,231G", img : "hadal_core.png" },
  { name: "침묵의 심해 비약", ingredients: "파도 침식의 결정 + 격류 재생의 결정 + 맹독 혼란의 결정", price: "12,354G", img : "silent_deep.png" },
  { name: "청해룡의 날개", ingredients: "방어 오염의 결정 + 맹독 혼란의 결정 + 활기 보존의 결정", price: "12,527G", img : "wing.png" },
]


export const RECIPES_3STAR = [
  { name: "수호의 엘릭서", ingredients: "굴★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 네더랙 8개", price: "", img : "elixir-guard.png" },
  { name: "파동의 엘릭서", ingredients: "소라★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 마그마 블록 4개", price: "", img : "elixir-wave.png" },
  { name: "혼란의 엘릭서", ingredients: "문어★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 영혼 흙 4개", price: "", img : "elixir-chaos.png" },
  { name: "생명의 엘릭서", ingredients: "미역★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 진홍빛 자루 4개", price: "", img : "elixir-life.png" },
  { name: "부식의 엘릭서", ingredients: "성게★★★ 1개 + 불우렁쉥이 2개 + 유리병 3개 + 뒤틀린 자루 4개", price: "", img : "elixir-decay.png" },

  { name: "불멸 재생의 영약", ingredients: "수호의 엘릭서 + 생명의 엘릭서 + 말린 켈프 12개 + 발광 열매 4개 + 죽은 관 산호 블록 2개", price: "", img : "potion-immortal.png" },
  { name: "파동 장벽의 영약", ingredients: "파동의 엘릭서 + 수호의 엘릭서 + 말린 켈프 12개 + 발광 열매 4개 + 죽은 사방산호 블록 2개", price: "", img : "potion-barrier.png" },
  { name: "타락 침식의 영약", ingredients: "혼란의 엘릭서 + 부식의 엘릭서 + 말린 켈프 12개 + 발광 열매 4개 + 죽은 거품 산호 블록 2개", price: "", img : "potion-corrupt.png" },
  { name: "생명 광란의 영약", ingredients: "생명의 엘릭서 + 혼란의 엘릭서 + 말린 켈프 12개 + 발광 열매 4개 + 죽은 불 산호 블록 2개", price: "", img : "potion-frenzy.png" },
  { name: "맹독 파동의 영약", ingredients: "부식의 엘릭서 + 파동의 엘릭서 + 말린 켈프 12개 + 발광 열매 4개 + 죽은 뇌 산호 블록 2개", price: "", img : "potion-venom.png" },

  { name: "아쿠아 펄스 파편", ingredients: "불멸 재생의 영약 + 파동 장벽의 영약 + 맹독 파동의 영약", price: "20,863G", img : "aqua_pulse.png" },
  { name: "나우틸러스의 손", ingredients: "파동 장벽의 영약 + 생명 광란의 영약 + 불멸 재생의 영약", price: "21,107G", img : "hand.png" },
  { name: "무저의 척추", ingredients: "타락 침식의 영약 + 맹독 파동의 영약 + 생명 광란의 영약", price: "21,239G", img : "spine.png" },
]


// 재료 툴팁 데이터 (마우스 호버 시 표시)
export interface IngredientInfo {
  text: string;
  icon?: string;
}

export interface TooltipItem {
  name: string;
  icon?: string;
}

export const INGREDIENT_TOOLTIPS: Record<string, { ingredients: TooltipItem[] }> = {
  // === 1성 정수 ===
  '수호': {
    ingredients: [
      { name: '굴★ 2', icon: '/img/ocean/oyster.png' },
      { name: '점토 2' }
    ]
  },
  '파동': {
    ingredients: [
      { name: '소라★ 2', icon: '/img/ocean/conch.png' },
      { name: '모래 4' }
    ]
  },
  '혼란': {
    ingredients: [
      { name: '문어★ 2', icon: '/img/ocean/octopus.png' },
      { name: '흙 8' }
    ]
  },
  '생명': {
    ingredients: [
      { name: '미역★ 2', icon: '/img/ocean/seaweed.png' },
      { name: '자갈 4' }
    ]
  },
  '부식': {
    ingredients: [
      { name: '성게★ 2', icon: '/img/ocean/urchin.png' },
      { name: '화강암 2' }
    ]
  },
  // === 1성 핵 ===
  '물결 수호': {
    ingredients: [
      { name: '수호 정수', icon: '/img/ocean/essence_guard.png' },
      { name: '파동 정수', icon: '/img/ocean/essence_wave.png' },
      { name: '익히지 않은 새우' }
    ]
  },
  '파동 오염': {
    ingredients: [
      { name: '파동 정수', icon: '/img/ocean/essence_wave.png' },
      { name: '혼란 정수', icon: '/img/ocean/essence_chaos.png' },
      { name: '익히지 않은 도미' }
    ]
  },
  '질서 파괴': {
    ingredients: [
      { name: '혼란 정수', icon: '/img/ocean/essence_chaos.png' },
      { name: '생명 정수', icon: '/img/ocean/essence_life.png' },
      { name: '익히지 않은 청어' }
    ]
  },
  '활력 붕괴': {
    ingredients: [
      { name: '생명 정수', icon: '/img/ocean/essence_life.png' },
      { name: '부식 정수', icon: '/img/ocean/essence_decay.png' },
      { name: '금붕어' }
    ]
  },
  '침식 방어': {
    ingredients: [
      { name: '부식 정수', icon: '/img/ocean/essence_decay.png' },
      { name: '수호 정수', icon: '/img/ocean/essence_guard.png' },
      { name: '농어' }
    ]
  },
  // === 1성 최종 제품 ===
  '영생의 아쿠티스': {
    ingredients: [
      { name: '물결 수호 핵', icon: '/img/ocean/core_wg.png' },
      { name: '질서 파괴 핵', icon: '/img/ocean/core_od.png' },
      { name: '활력 붕괴 핵', icon: '/img/ocean/core_vd.png' }
    ]
  },
  '크라켄의 광란체': {
    ingredients: [
      { name: '질서 파괴 핵', icon: '/img/ocean/core_od.png' },
      { name: '활력 붕괴 핵', icon: '/img/ocean/core_vd.png' },
      { name: '파동 오염 핵', icon: '/img/ocean/core_wp.png' }
    ]
  },
  '리바이던의 깃털': {
    ingredients: [
      { name: '침식 방어 핵', icon: '/img/ocean/core_ed.png' },
      { name: '파동 오염 핵', icon: '/img/ocean/core_wp.png' },
      { name: '물결 수호 핵', icon: '/img/ocean/core_wg.png' }
    ]
  },

  // === 2성 에센스 ===
  '수호 에센스': {
    ingredients: [
      { name: '굴★★ 2', icon: '/img/ocean/oyster.png' },
      { name: '해초 6' },
      { name: '참나무 잎 6' }
    ]
  },
  '파동 에센스': {
    ingredients: [
      { name: '소라★★ 2', icon: '/img/ocean/conch.png' },
      { name: '해초 6' },
      { name: '가문비나무 잎 6' }
    ]
  },
  '혼란 에센스': {
    ingredients: [
      { name: '문어★★ 2', icon: '/img/ocean/octopus.png' },
      { name: '해초 6' },
      { name: '자작나무 잎 6' }
    ]
  },
  '생명 에센스': {
    ingredients: [
      { name: '미역★★ 2', icon: '/img/ocean/seaweed.png' },
      { name: '해초 6' },
      { name: '아카시아나무 잎 6' }
    ]
  },
  '부식 에센스': {
    ingredients: [
      { name: '성게★★ 2', icon: '/img/ocean/urchin.png' },
      { name: '해초 6' },
      { name: '벚나무 잎 6' }
    ]
  },
  // === 2성 결정 ===
  '활기 보존': {
    ingredients: [
      { name: '수호 에센스', icon: '/img/ocean/essence_guard_2.png' },
      { name: '생명 에센스', icon: '/img/ocean/essence_life_2.png' },
      { name: '켈프 8' },
      { name: '청금석 블록 1' }
    ]
  },
  '파도 침식': {
    ingredients: [
      { name: '파동 에센스', icon: '/img/ocean/essence_wave_2.png' },
      { name: '부식 에센스', icon: '/img/ocean/essence_decay_2.png' },
      { name: '켈프 8' },
      { name: '레드스톤 블록 1' }
    ]
  },
  '방어 오염': {
    ingredients: [
      { name: '혼란 에센스', icon: '/img/ocean/essence_chaos_2.png' },
      { name: '수호 에센스', icon: '/img/ocean/essence_guard_2.png' },
      { name: '켈프 8' },
      { name: '철 주괴 3' }
    ]
  },
  '격류 재생': {
    ingredients: [
      { name: '생명 에센스', icon: '/img/ocean/essence_life_2.png' },
      { name: '파동 에센스', icon: '/img/ocean/essence_wave_2.png' },
      { name: '켈프 8' },
      { name: '금 주괴 2' }
    ]
  },
  '맹독 혼란': {
    ingredients: [
      { name: '부식 에센스', icon: '/img/ocean/essence_decay_2.png' },
      { name: '혼란 에센스', icon: '/img/ocean/essence_chaos_2.png' },
      { name: '켈프 8' },
      { name: '다이아몬드 1' }
    ]
  },
  // === 2성 최종 제품 ===
  '해구 파동의 코어': {
    ingredients: [
      { name: '활기 보존 결정', icon: '/img/ocean/crystal_vital.png' },
      { name: '파도 침식 결정', icon: '/img/ocean/crystal_erosion.png' },
      { name: '격류 재생 결정', icon: '/img/ocean/crystal_regen.png' }
    ]
  },
  '해구의 파동 코어': {
    ingredients: [
      { name: '활기 보존 결정', icon: '/img/ocean/crystal_vital.png' },
      { name: '파도 침식 결정', icon: '/img/ocean/crystal_erosion.png' },
      { name: '격류 재생 결정', icon: '/img/ocean/crystal_regen.png' }
    ]
  },
  '침묵의 심해 비약': {
    ingredients: [
      { name: '파도 침식 결정', icon: '/img/ocean/crystal_erosion.png' },
      { name: '격류 재생 결정', icon: '/img/ocean/crystal_regen.png' },
      { name: '맹독 혼란 결정', icon: '/img/ocean/crystal_poison.png' }
    ]
  },
  '청해룡의 날개': {
    ingredients: [
      { name: '방어 오염 결정', icon: '/img/ocean/crystal_defense.png' },
      { name: '맹독 혼란 결정', icon: '/img/ocean/crystal_poison.png' },
      { name: '활기 보존 결정', icon: '/img/ocean/crystal_vital.png' }
    ]
  },

  // === 3성 엘릭서 ===
  '수호 엘릭서': {
    ingredients: [
      { name: '굴★★★ 1', icon: '/img/ocean/oyster.png' },
      { name: '불우렁쉥이 2' },
      { name: '유리병 3' },
      { name: '네더랙 8' }
    ]
  },
  '파동 엘릭서': {
    ingredients: [
      { name: '소라★★★ 1', icon: '/img/ocean/conch.png' },
      { name: '불우렁쉥이 2' },
      { name: '유리병 3' },
      { name: '마그마 블록 4' }
    ]
  },
  '혼란 엘릭서': {
    ingredients: [
      { name: '문어★★★ 1', icon: '/img/ocean/octopus.png' },
      { name: '불우렁쉥이 2' },
      { name: '유리병 3' },
      { name: '영혼 흙 4' }
    ]
  },
  '생명 엘릭서': {
    ingredients: [
      { name: '미역★★★ 1', icon: '/img/ocean/seaweed.png' },
      { name: '불우렁쉥이 2' },
      { name: '유리병 3' },
      { name: '진홍빛 자루 4' }
    ]
  },
  '부식 엘릭서': {
    ingredients: [
      { name: '성게★★★ 1', icon: '/img/ocean/urchin.png' },
      { name: '불우렁쉥이 2' },
      { name: '유리병 3' },
      { name: '뒤틀린 자루 4' }
    ]
  },
  // === 3성 영약 ===
  '불멸 재생': {
    ingredients: [
      { name: '수호 엘릭서', icon: '/img/ocean/elixir-guard.png' },
      { name: '생명 엘릭서', icon: '/img/ocean/elixir-life.png' },
      { name: '말린 켈프 12' },
      { name: '발광 열매 4' },
      { name: '죽은 관 산호 블록 2' }
    ]
  },
  '파동 장벽': {
    ingredients: [
      { name: '파동 엘릭서', icon: '/img/ocean/elixir-wave.png' },
      { name: '수호 엘릭서', icon: '/img/ocean/elixir-guard.png' },
      { name: '말린 켈프 12' },
      { name: '발광 열매 4' },
      { name: '죽은 사방산호 블록 2' }
    ]
  },
  '타락 침식': {
    ingredients: [
      { name: '혼란 엘릭서', icon: '/img/ocean/elixir-chaos.png' },
      { name: '부식 엘릭서', icon: '/img/ocean/elixir-decay.png' },
      { name: '말린 켈프 12' },
      { name: '발광 열매 4' },
      { name: '죽은 거품 산호 블록 2' }
    ]
  },
  '생명 광란': {
    ingredients: [
      { name: '생명 엘릭서', icon: '/img/ocean/elixir-life.png' },
      { name: '혼란 엘릭서', icon: '/img/ocean/elixir-chaos.png' },
      { name: '말린 켈프 12' },
      { name: '발광 열매 4' },
      { name: '죽은 불 산호 블록 2' }
    ]
  },
  '맹독 파동': {
    ingredients: [
      { name: '부식 엘릭서', icon: '/img/ocean/elixir-decay.png' },
      { name: '파동 엘릭서', icon: '/img/ocean/elixir-wave.png' },
      { name: '말린 켈프 12' },
      { name: '발광 열매 4' },
      { name: '죽은 뇌 산호 블록 2' }
    ]
  },
  // === 3성 최종 제품 ===
  '아쿠아 펄스 파편': {
    ingredients: [
      { name: '불멸 재생 영약', icon: '/img/ocean/potion-immortal.png' },
      { name: '파동 장벽 영약', icon: '/img/ocean/potion-barrier.png' },
      { name: '맹독 파동 영약', icon: '/img/ocean/potion-venom.png' }
    ]
  },
  '나우틸러스의 손': {
    ingredients: [
      { name: '파동 장벽 영약', icon: '/img/ocean/potion-barrier.png' },
      { name: '생명 광란 영약', icon: '/img/ocean/potion-frenzy.png' },
      { name: '불멸 재생 영약', icon: '/img/ocean/potion-immortal.png' }
    ]
  },
  '무저의 척추': {
    ingredients: [
      { name: '타락 침식 영약', icon: '/img/ocean/potion-corrupt.png' },
      { name: '맹독 파동 영약', icon: '/img/ocean/potion-venom.png' },
      { name: '생명 광란 영약', icon: '/img/ocean/potion-frenzy.png' }
    ]
  },
}

export const RECIPES_CRAFT = [
  { name: "금속 재활용품 (2개)", ingredients: "캔 2개", minPrice: "", maxPrice: "", img:"metal.png" },
  { name: "합금 재활용품 (2개)", ingredients: "통조림 2개", minPrice: "", maxPrice: "", img:"alloy.png" },
  { name: "합성수지 재활용품 (2개)", ingredients: "비닐봉지 2개", minPrice: "", maxPrice: "", img:"resin.png" },
  { name: "플라스틱 재활용품 (2개)", ingredients: "페트병 2개", minPrice: "", maxPrice: "", img:"pt.png" },
  { name: "섬유 재활용품 (2개)", ingredients: "신발 2개", minPrice: "", maxPrice: "", img:"fiber.png" },

  { name: "조개껍데기 브로치", ingredients: "깨진 조개껍데기 1개 + 노란빛 진주 1개 + 금속 재활용품 1개 + 거미줄 4개", minPrice: "0G", maxPrice: "50,000G", img : "yellow_clam.png" },
  { name: "푸른 향수병", ingredients: "깨진 조개껍데기 2개 + 푸른빛 진주 1개 + 합성수지 재활용품 1개 + 플라스틱 재활용품 1개 + 양동이 8개", minPrice: "0G", maxPrice: "100,000G", img : "blue_perfume.png" },
  { name: "자개 손거울", ingredients: "깨진 조개껍데기 3개 + 청록빛 진주 1개 + 합금 재활용품 2개 + 플라스틱 재활용품 2개 + 유리판 16개", minPrice: "0G", maxPrice: "200,000G", img : "mirror.png" },
  { name: "분홍 헤어핀", ingredients: "깨진 조개껍데기 4개 + 분홍빛 진주 1개 + 합성수지 재활용품 3개 + 섬유 재활용품 3개 + 대나무 64개 + 분홍 꽃잎 16개", minPrice: "0G", maxPrice: "300,000G", img : "hairpin.png" },
  { name: "자개 부채", ingredients: "깨진 조개껍데기 5개 + 보라빛 진주 1개 + 합금 재활용품 5개 + 합성수지 재활용품 5개 + 막대기 64개 + 자수정 조각 16개", minPrice: "0G", maxPrice: "500,000G", img : "fan.png" },
  { name: "흑진주 시계", ingredients: "깨진 조개껍데기 7개 + 흑진주 1개 + 금속 재활용품 7개 + 합금 재활용품 7개 + 섬유 재활용품 7개 + 흑요석 16개 + 시계 8개", minPrice: "0G", maxPrice: "700,000G", img : "black_pearl.png" },
]