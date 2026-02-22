// 재료 시세 및 순수익 계산

// 재료 시세 타입
export interface MaterialPrices {
  // 어패류 (1/2/3성)
  shellfish1: { guard: number; wave: number; chaos: number; life: number; decay: number }
  shellfish2: { guard: number; wave: number; chaos: number; life: number; decay: number }
  shellfish3: { guard: number; wave: number; chaos: number; life: number; decay: number }
  // 1성 블록
  block1: { clay: number; sand: number; dirt: number; gravel: number; granite: number }
  // 1성 물고기
  fish1: { shrimp: number; domi: number; herring: number; goldfish: number; bass: number }
  // 2성 재료
  material2: { seaweed: number; kelp: number }
  // 2성 잎
  leaf2: { oak: number; spruce: number; birch: number; acacia: number; cherry: number }
  // 2성 광물
  mineral2: { lapis: number; redstone: number; iron: number; gold: number; diamond: number }
  // 3성 재료
  material3: { seaSquirt: number; glassBottle: number; driedKelp: number; glowBerry: number }
  // 3성 블록
  block3: { netherrack: number; magma: number; soulSoil: number; crimson: number; warped: number }
  // 3성 산호
  coral3: { tube: number; brain: number; bubble: number; fire: number; horn: number }
}

// 재료 라벨 (한글명)
export const MATERIAL_LABELS = {
  shellfish1: { guard: '굴 ★', wave: '소라 ★', chaos: '문어 ★', life: '미역 ★', decay: '성게 ★' },
  shellfish2: { guard: '굴 ★★', wave: '소라 ★★', chaos: '문어 ★★', life: '미역 ★★', decay: '성게 ★★' },
  shellfish3: { guard: '굴 ★★★', wave: '소라 ★★★', chaos: '문어 ★★★', life: '미역 ★★★', decay: '성게 ★★★' },
  block1: { clay: '점토', sand: '모래', dirt: '흙', gravel: '자갈', granite: '화강암' },
  fish1: { shrimp: '새우', domi: '도미', herring: '청어', goldfish: '금붕어', bass: '농어' },
  material2: { seaweed: '해초', kelp: '켈프' },
  leaf2: { oak: '참나무 잎', spruce: '가문비 잎', birch: '자작나무 잎', acacia: '아카시아 잎', cherry: '벚나무 잎' },
  mineral2: { lapis: '청금석 블록', redstone: '레드스톤 블록', iron: '철 주괴', gold: '금 주괴', diamond: '다이아몬드' },
  material3: { seaSquirt: '불우렁쉥이', glassBottle: '유리병', driedKelp: '말린 켈프', glowBerry: '발광 열매' },
  block3: { netherrack: '네더랙', magma: '마그마 블록', soulSoil: '영혼 흙', crimson: '진홍빛 자루', warped: '뒤틀린 자루' },
  coral3: { tube: '죽은 관 산호', brain: '죽은 사방산호', bubble: '죽은 거품 산호', fire: '죽은 불 산호', horn: '죽은 뇌 산호' }
}

// 카테고리 라벨
export const CATEGORY_LABELS: Record<string, string> = {
  shellfish1: '1성 어패류',
  shellfish2: '2성 어패류',
  shellfish3: '3성 어패류',
  block1: '1성 블록',
  fish1: '1성 물고기',
  material2: '2성 재료',
  leaf2: '2성 잎',
  mineral2: '2성 광물',
  material3: '3성 재료',
  block3: '3성 블록',
  coral3: '3성 산호'
}

// 초기값
export const INITIAL_MATERIAL_PRICES: MaterialPrices = {
  shellfish1: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
  shellfish2: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
  shellfish3: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
  block1: { clay: 0, sand: 0, dirt: 0, gravel: 0, granite: 0 },
  fish1: { shrimp: 0, domi: 0, herring: 0, goldfish: 0, bass: 0 },
  material2: { seaweed: 0, kelp: 0 },
  leaf2: { oak: 0, spruce: 0, birch: 0, acacia: 0, cherry: 0 },
  mineral2: { lapis: 0, redstone: 0, iron: 0, gold: 0, diamond: 0 },
  material3: { seaSquirt: 0, glassBottle: 0, driedKelp: 0, glowBerry: 0 },
  block3: { netherrack: 0, magma: 0, soulSoil: 0, crimson: 0, warped: 0 },
  coral3: { tube: 0, brain: 0, bubble: 0, fire: 0, horn: 0 }
}

/**
 * 1성 총 재료비 계산 (실제 사용된 재료 기준)
 */
export function calculate1StarMaterialCost(
  prices: MaterialPrices,
  result: any
): number {
  if (!result) return 0

  // 어패류 비용 (실제 사용량 = 제작할 정수 수량)
  const shellfishCost = 
    (result.essNeedProduct?.guard || 0) * prices.shellfish1.guard +
    (result.essNeedProduct?.wave || 0) * prices.shellfish1.wave +
    (result.essNeedProduct?.chaos || 0) * prices.shellfish1.chaos +
    (result.essNeedProduct?.life || 0) * prices.shellfish1.life +
    (result.essNeedProduct?.decay || 0) * prices.shellfish1.decay

  // 블록 비용
  const blockCost = 
    (result.blockNeedProduct?.clay || 0) * prices.block1.clay +
    (result.blockNeedProduct?.sand || 0) * prices.block1.sand +
    (result.blockNeedProduct?.dirt || 0) * prices.block1.dirt +
    (result.blockNeedProduct?.gravel || 0) * prices.block1.gravel +
    (result.blockNeedProduct?.granite || 0) * prices.block1.granite

  // 물고기 비용
  const fishCost = 
    (result.fishNeedProduct?.shrimp || 0) * prices.fish1.shrimp +
    (result.fishNeedProduct?.domi || 0) * prices.fish1.domi +
    (result.fishNeedProduct?.herring || 0) * prices.fish1.herring +
    (result.fishNeedProduct?.goldfish || 0) * prices.fish1.goldfish +
    (result.fishNeedProduct?.bass || 0) * prices.fish1.bass

  return shellfishCost + blockCost + fishCost
}

/**
 * 2성 총 재료비 계산 (실제 사용된 재료 기준)
 */
export function calculate2StarMaterialCost(
  prices: MaterialPrices,
  result: any
): number {
  if (!result) return 0

  // 어패류 비용 (실제 사용량 = 제작할 에센스 수량)
  const shellfishCost = 
    (result.essNeedProduct?.guard || 0) * prices.shellfish2.guard +
    (result.essNeedProduct?.wave || 0) * prices.shellfish2.wave +
    (result.essNeedProduct?.chaos || 0) * prices.shellfish2.chaos +
    (result.essNeedProduct?.life || 0) * prices.shellfish2.life +
    (result.essNeedProduct?.decay || 0) * prices.shellfish2.decay

  // 재료 비용 (해초, 켈프)
  const materialCost = 
    (result.materialNeedProduct?.seaweed || 0) * prices.material2.seaweed +
    (result.materialNeedProduct?.kelp || 0) * prices.material2.kelp

  // 잎 비용
  const leafCost = 
    (result.materialNeedProduct?.oakLeaves || 0) * prices.leaf2.oak +
    (result.materialNeedProduct?.spruceLeaves || 0) * prices.leaf2.spruce +
    (result.materialNeedProduct?.birchLeaves || 0) * prices.leaf2.birch +
    (result.materialNeedProduct?.acaciaLeaves || 0) * prices.leaf2.acacia +
    (result.materialNeedProduct?.cherryLeaves || 0) * prices.leaf2.cherry

  // 광물 비용
  const mineralCost = 
    (result.materialNeedProduct?.lapisBlock || 0) * prices.mineral2.lapis +
    (result.materialNeedProduct?.redstoneBlock || 0) * prices.mineral2.redstone +
    (result.materialNeedProduct?.ironIngot || 0) * prices.mineral2.iron +
    (result.materialNeedProduct?.goldIngot || 0) * prices.mineral2.gold +
    (result.materialNeedProduct?.diamond || 0) * prices.mineral2.diamond

  return shellfishCost + materialCost + leafCost + mineralCost
}

/**
 * 3성 총 재료비 계산 (실제 사용된 재료 기준)
 */
export function calculate3StarMaterialCost(
  prices: MaterialPrices,
  result: any
): number {
  if (!result) return 0

  // 어패류 비용 (실제 사용량 = 제작할 엘릭서 수량)
  const shellfishCost = 
    (result.elixNeedProduct?.guard || 0) * prices.shellfish3.guard +
    (result.elixNeedProduct?.wave || 0) * prices.shellfish3.wave +
    (result.elixNeedProduct?.chaos || 0) * prices.shellfish3.chaos +
    (result.elixNeedProduct?.life || 0) * prices.shellfish3.life +
    (result.elixNeedProduct?.decay || 0) * prices.shellfish3.decay

  // 재료 비용
  const materialCost = 
    (result.materialNeedProduct?.seaSquirt || 0) * prices.material3.seaSquirt +
    (result.materialNeedProduct?.glassBottle || 0) * prices.material3.glassBottle +
    (result.materialNeedProduct?.driedKelp || 0) * prices.material3.driedKelp +
    (result.materialNeedProduct?.glowBerry || 0) * prices.material3.glowBerry

  // 블록 비용
  const blockCost = 
    (result.materialNeedProduct?.netherrack || 0) * prices.block3.netherrack +
    (result.materialNeedProduct?.magmaBlock || 0) * prices.block3.magma +
    (result.materialNeedProduct?.soulSoil || 0) * prices.block3.soulSoil +
    (result.materialNeedProduct?.crimsonStem || 0) * prices.block3.crimson +
    (result.materialNeedProduct?.warpedStem || 0) * prices.block3.warped

  // 산호 비용
  const coralCost = 
    (result.deadCoralNeedProduct?.deadTubeCoral || 0) * prices.coral3.tube +
    (result.deadCoralNeedProduct?.deadBrainCoral || 0) * prices.coral3.brain +
    (result.deadCoralNeedProduct?.deadBubbleCoral || 0) * prices.coral3.bubble +
    (result.deadCoralNeedProduct?.deadFireCoral || 0) * prices.coral3.fire +
    (result.deadCoralNeedProduct?.deadHornCoral || 0) * prices.coral3.horn

  return shellfishCost + materialCost + blockCost + coralCost
}

/**
 * 순수익 계산 (판매가 - 재료비)
 */
export function calculateNetProfit(
  sellPrice: number,
  materialCost: number
): { profit: number; percent: number } {
  const profit = sellPrice - materialCost
  const percent = materialCost > 0 ? (profit / materialCost) * 100 : 0
  return { profit, percent }
}
