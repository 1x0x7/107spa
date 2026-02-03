/**
 * 스태미나 최적 배분 계산기
 * 
 * 입력: 스태미나, 보유량(어패류 + 중간재료), 전문가 설정
 * 출력: 최적 어패류 배분, 예상 드롭량, 예상 골드
 */

import { 
  OCEAN_STAMINA_PER_GATHER, 
  ROD_DATA, 
  EXPERT_DEEP_SEA, 
  EXPERT_STAR,
  GOLD_PRICES
} from '@/data/ocean'

// 타입 정의
export interface OceanSettings {
  rodLevel: number
  deepSea: number
  star: number
  premiumPrice: number
}

export interface Inventory {
  shellfish: {
    star1: { guard: number; wave: number; chaos: number; life: number; decay: number }
    star2: { guard: number; wave: number; chaos: number; life: number; decay: number }
    star3: { guard: number; wave: number; chaos: number; life: number; decay: number }
  }
  advanced1: {
    essGuard: number; essWave: number; essChaos: number; essLife: number; essDecay: number
    coreWG: number; coreWP: number; coreOD: number; coreVD: number; coreED: number
  }
  advanced2: {
    essGuard: number; essWave: number; essChaos: number; essLife: number; essDecay: number
    crystalVital: number; crystalErosion: number; crystalDefense: number; crystalRegen: number; crystalPoison: number
  }
  advanced3: {
    elixGuard: number; elixWave: number; elixChaos: number; elixLife: number; elixDecay: number
    potionImmortal: number; potionBarrier: number; potionCorrupt: number; potionFrenzy: number; potionVenom: number
  }
}

export interface Allocation {
  oyster: number   // 굴 (guard/수호)
  conch: number    // 소라 (wave/파동)
  octopus: number  // 문어 (chaos/혼란)
  seaweed: number  // 미역 (life/생명)
  urchin: number   // 성게 (decay/부식)
}

export interface DropResult {
  star1: { guard: number; wave: number; chaos: number; life: number; decay: number }
  star2: { guard: number; wave: number; chaos: number; life: number; decay: number }
  star3: { guard: number; wave: number; chaos: number; life: number; decay: number }
  clam: number
}

export interface OptimizeResult {
  allocation: Allocation           // 최적 배분 (스태미나)
  gatherCounts: Allocation         // 채집 횟수
  drops: DropResult                // 예상 드롭량
  totalGold: number                // 예상 총 골드
  goldBreakdown: {
    dilution: number
    star1: number
    star2: number
    star3: number
  }
  productCounts: {
    dilution: number
    star1: { A: number; K: number; L: number }
    star2: { CORE: number; POTION: number; WING: number }
    star3: { AQUA: number; NAUTILUS: number; SPINE: number }
  }
}

// 프리미엄 판매가 보너스
const PREMIUM_RATE: Record<number, number> = {
  0: 0, 1: 0.05, 2: 0.07, 3: 0.09, 4: 0.12, 5: 0.15, 6: 0.20, 7: 0.25, 8: 0.30
}

/**
 * 등급별 드롭 비율 계산 (별별별 전문가 적용)
 */
function getStarRates(starLevel: number): { rate1: number; rate2: number; rate3: number } {
  const starBonus = EXPERT_STAR[starLevel] || 0
  
  const base1 = 60
  const base2 = 30
  const base3 = 10
  const bonusWeight = starBonus * 100
  
  const weight1 = base1
  const weight2 = base2
  const weight3 = base3 + bonusWeight
  const totalWeight = weight1 + weight2 + weight3
  
  return {
    rate1: weight1 / totalWeight,
    rate2: weight2 / totalWeight,
    rate3: weight3 / totalWeight
  }
}

/**
 * 스태미나 배분 → 드롭량 계산
 */
export function calculateDrops(
  allocation: Allocation,
  settings: OceanSettings
): DropResult {
  const rodStats = ROD_DATA[settings.rodLevel] || ROD_DATA[1]
  const deepSeaBonus = EXPERT_DEEP_SEA[settings.deepSea] || 0
  const { rate1, rate2, rate3 } = getStarRates(settings.star)
  
  const result: DropResult = {
    star1: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    star2: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    star3: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    clam: 0
  }
  
  const fishTypes: (keyof Allocation)[] = ['oyster', 'conch', 'octopus', 'seaweed', 'urchin']
  const attrMap: Record<keyof Allocation, keyof typeof result.star1> = {
    oyster: 'guard',
    conch: 'wave',
    octopus: 'chaos',
    seaweed: 'life',
    urchin: 'decay'
  }
  
  let totalGatherCount = 0
  
  for (const fish of fishTypes) {
    const stamina = allocation[fish]
    if (stamina <= 0) continue
    
    const gatherCount = Math.floor(stamina / OCEAN_STAMINA_PER_GATHER)
    totalGatherCount += gatherCount
    
    // 기본 드롭 + 심해 채집꾼 보너스
    let totalDrops = gatherCount * rodStats.drop
    totalDrops += Math.floor(gatherCount * deepSeaBonus)
    
    // 등급별 분배
    const attr = attrMap[fish]
    result.star1[attr] = Math.floor(totalDrops * rate1)
    result.star2[attr] = Math.floor(totalDrops * rate2)
    result.star3[attr] = Math.floor(totalDrops * rate3)
    
    // 나머지 처리 (3성 우선)
    const remainder = totalDrops - (result.star1[attr] + result.star2[attr] + result.star3[attr])
    result.star3[attr] += remainder
  }
  
  // 조개 계산
  result.clam = Math.floor(totalGatherCount * rodStats.clamRate)
  
  return result
}

/**
 * 보유량 + 드롭량 합산
 */
function mergeInventory(inventory: Inventory, drops: DropResult): Inventory {
  return {
    shellfish: {
      star1: {
        guard: inventory.shellfish.star1.guard + drops.star1.guard,
        wave: inventory.shellfish.star1.wave + drops.star1.wave,
        chaos: inventory.shellfish.star1.chaos + drops.star1.chaos,
        life: inventory.shellfish.star1.life + drops.star1.life,
        decay: inventory.shellfish.star1.decay + drops.star1.decay
      },
      star2: {
        guard: inventory.shellfish.star2.guard + drops.star2.guard,
        wave: inventory.shellfish.star2.wave + drops.star2.wave,
        chaos: inventory.shellfish.star2.chaos + drops.star2.chaos,
        life: inventory.shellfish.star2.life + drops.star2.life,
        decay: inventory.shellfish.star2.decay + drops.star2.decay
      },
      star3: {
        guard: inventory.shellfish.star3.guard + drops.star3.guard,
        wave: inventory.shellfish.star3.wave + drops.star3.wave,
        chaos: inventory.shellfish.star3.chaos + drops.star3.chaos,
        life: inventory.shellfish.star3.life + drops.star3.life,
        decay: inventory.shellfish.star3.decay + drops.star3.decay
      }
    },
    advanced1: { ...inventory.advanced1 },
    advanced2: { ...inventory.advanced2 },
    advanced3: { ...inventory.advanced3 }
  }
}

/**
 * 골드 계산 (보유 중간재료 반영)
 * - 희석액 우선 제작
 * - 남은 재료로 각 성급 제품 제작
 */
function calculateGold(inventory: Inventory, premiumRate: number): {
  totalGold: number
  breakdown: { dilution: number; star1: number; star2: number; star3: number }
  products: {
    dilution: number
    star1: { A: number; K: number; L: number }
    star2: { CORE: number; POTION: number; WING: number }
    star3: { AQUA: number; NAUTILUS: number; SPINE: number }
  }
} {
  const prices = {
    dilution: 17566,
    star1: GOLD_PRICES['1star'],
    star2: GOLD_PRICES['2star'],
    star3: GOLD_PRICES['3star']
  }
  
  // 깊은 복사
  const inv = JSON.parse(JSON.stringify(inventory)) as Inventory
  
  // ============================================
  // 희석액 계산 (보유 중간재료 반영)
  // 희석액 = 침식방어핵(ED) 3 + 방어오염결정(defense) 2 + 타락침식영약(corrupt) 1
  // ============================================
  
  // 1. 보유 영약(corrupt) 사용
  let availableCorrupt = inv.advanced3.potionCorrupt
  
  // 2. 보유 엘릭서로 영약 제작 가능량 (chaos 1 + decay 1 → corrupt 1)
  const elixForCorrupt = Math.min(inv.advanced3.elixChaos, inv.advanced3.elixDecay)
  
  // 3. 어패류로 엘릭서 제작 가능량 (3성 어패류 1:1)
  const chaosFromShell = inv.shellfish.star3.chaos
  const decayFromShell = inv.shellfish.star3.decay
  
  // 총 corrupt 영약 가용량
  const totalCorruptAvailable = availableCorrupt + elixForCorrupt + Math.min(
    chaosFromShell - Math.max(0, elixForCorrupt - inv.advanced3.elixChaos),
    decayFromShell - Math.max(0, elixForCorrupt - inv.advanced3.elixDecay)
  )
  
  // 4. 보유 결정(defense) 사용
  let availableDefense = inv.advanced2.crystalDefense
  
  // 5. 보유 에센스로 결정 제작 가능량 (chaos 1 + guard 1 → defense 1)
  const essForDefense = Math.min(inv.advanced2.essChaos, inv.advanced2.essGuard)
  
  // 6. 어패류로 에센스 제작 가능량 (2성 어패류 2:2)
  const chaosFromShell2 = Math.floor(inv.shellfish.star2.chaos / 2) * 2
  const guardFromShell2 = Math.floor(inv.shellfish.star2.guard / 2) * 2
  
  // 총 defense 결정 가용량 (희석액 2개 필요)
  const totalDefenseAvailable = availableDefense + essForDefense + Math.floor(Math.min(chaosFromShell2, guardFromShell2) / 2)
  
  // 7. 보유 핵(ED) 사용
  let availableED = inv.advanced1.coreED
  
  // 8. 보유 정수로 핵 제작 가능량 (decay 1 + guard 1 → ED 1)
  const essForED = Math.min(inv.advanced1.essDecay, inv.advanced1.essGuard)
  
  // 9. 어패류로 정수 제작 가능량 (1성 어패류 2:2)
  const decayFromShell1 = Math.floor(inv.shellfish.star1.decay / 2) * 2
  const guardFromShell1 = Math.floor(inv.shellfish.star1.guard / 2) * 2
  
  // 총 ED 핵 가용량 (희석액 3개 필요)
  const totalEDAvailable = availableED + essForED + Math.floor(Math.min(decayFromShell1, guardFromShell1) / 2)
  
  // 희석액 최대 제작 가능량
  const maxDilution = Math.min(
    totalCorruptAvailable,           // 영약 1개
    Math.floor(totalDefenseAvailable / 2),  // 결정 2개
    Math.floor(totalEDAvailable / 3)        // 핵 3개
  )
  
  // 희석액 제작에 사용된 재료 차감
  const dilutionCorruptNeed = maxDilution
  const dilutionDefenseNeed = maxDilution * 2
  const dilutionEDNeed = maxDilution * 3
  
  // 영약 차감 (보유 → 엘릭서 → 어패류)
  let corruptUsed = Math.min(inv.advanced3.potionCorrupt, dilutionCorruptNeed)
  inv.advanced3.potionCorrupt -= corruptUsed
  let corruptRemain = dilutionCorruptNeed - corruptUsed
  
  // 엘릭서로 영약 제작
  const elixCorruptMake = Math.min(inv.advanced3.elixChaos, inv.advanced3.elixDecay, corruptRemain)
  inv.advanced3.elixChaos -= elixCorruptMake
  inv.advanced3.elixDecay -= elixCorruptMake
  corruptRemain -= elixCorruptMake
  
  // 어패류로 엘릭서 제작
  inv.shellfish.star3.chaos -= corruptRemain
  inv.shellfish.star3.decay -= corruptRemain
  
  // 결정 차감 (보유 → 에센스 → 어패류)
  let defenseUsed = Math.min(inv.advanced2.crystalDefense, dilutionDefenseNeed)
  inv.advanced2.crystalDefense -= defenseUsed
  let defenseRemain = dilutionDefenseNeed - defenseUsed
  
  // 에센스로 결정 제작
  const essDefenseMake = Math.min(inv.advanced2.essChaos, inv.advanced2.essGuard, defenseRemain)
  inv.advanced2.essChaos -= essDefenseMake
  inv.advanced2.essGuard -= essDefenseMake
  defenseRemain -= essDefenseMake
  
  // 어패류로 에센스 제작
  inv.shellfish.star2.chaos -= defenseRemain * 2
  inv.shellfish.star2.guard -= defenseRemain * 2
  
  // 핵 차감 (보유 → 정수 → 어패류)
  let edUsed = Math.min(inv.advanced1.coreED, dilutionEDNeed)
  inv.advanced1.coreED -= edUsed
  let edRemain = dilutionEDNeed - edUsed
  
  // 정수로 핵 제작
  const essEDMake = Math.min(inv.advanced1.essDecay, inv.advanced1.essGuard, edRemain)
  inv.advanced1.essDecay -= essEDMake
  inv.advanced1.essGuard -= essEDMake
  edRemain -= essEDMake
  
  // 어패류로 정수 제작
  inv.shellfish.star1.decay -= edRemain * 2
  inv.shellfish.star1.guard -= edRemain * 2
  
  // ============================================
  // 3성 제품 계산
  // ============================================
  // AQUA: 불멸재생(guard+life) + 파동장벽(wave+guard) + 맹독파동(decay+wave)
  //       → 엘릭서: guard 2, life 1, wave 2, decay 1
  // NAUTILUS: 파동장벽 + 생명광란(life+chaos) + 불멸재생
  //       → 엘릭서: guard 2, wave 1, life 2, chaos 1
  // SPINE: 타락침식(chaos+decay) + 맹독파동 + 생명광란
  //       → 엘릭서: chaos 2, decay 2, wave 1, life 1
  
  // 보유 영약 + 엘릭서 + 어패류 합산하여 가용 엘릭서 계산
  const getAvailableElixir = (type: 'guard' | 'wave' | 'chaos' | 'life' | 'decay') => {
    const elixKey = `elix${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof inv.advanced3
    return (inv.advanced3[elixKey] as number) + inv.shellfish.star3[type]
  }
  
  const elixAvail = {
    guard: getAvailableElixir('guard'),
    wave: getAvailableElixir('wave'),
    chaos: getAvailableElixir('chaos'),
    life: getAvailableElixir('life'),
    decay: getAvailableElixir('decay')
  }
  
  const star3Need = {
    AQUA: { guard: 2, life: 1, wave: 2, decay: 1 },
    NAUTILUS: { guard: 2, wave: 1, life: 2, chaos: 1 },
    SPINE: { chaos: 2, decay: 2, wave: 1, life: 1 }
  }
  
  const maxAQUA = Math.min(
    Math.floor(elixAvail.guard / star3Need.AQUA.guard),
    Math.floor(elixAvail.life / star3Need.AQUA.life),
    Math.floor(elixAvail.wave / star3Need.AQUA.wave),
    Math.floor(elixAvail.decay / star3Need.AQUA.decay)
  )
  elixAvail.guard -= maxAQUA * star3Need.AQUA.guard
  elixAvail.life -= maxAQUA * star3Need.AQUA.life
  elixAvail.wave -= maxAQUA * star3Need.AQUA.wave
  elixAvail.decay -= maxAQUA * star3Need.AQUA.decay
  
  const maxNAUTILUS = Math.min(
    Math.floor(elixAvail.guard / star3Need.NAUTILUS.guard),
    Math.floor(elixAvail.wave / star3Need.NAUTILUS.wave),
    Math.floor(elixAvail.life / star3Need.NAUTILUS.life),
    Math.floor(elixAvail.chaos / star3Need.NAUTILUS.chaos)
  )
  elixAvail.guard -= maxNAUTILUS * star3Need.NAUTILUS.guard
  elixAvail.wave -= maxNAUTILUS * star3Need.NAUTILUS.wave
  elixAvail.life -= maxNAUTILUS * star3Need.NAUTILUS.life
  elixAvail.chaos -= maxNAUTILUS * star3Need.NAUTILUS.chaos
  
  const maxSPINE = Math.min(
    Math.floor(elixAvail.chaos / star3Need.SPINE.chaos),
    Math.floor(elixAvail.decay / star3Need.SPINE.decay),
    Math.floor(elixAvail.wave / star3Need.SPINE.wave),
    Math.floor(elixAvail.life / star3Need.SPINE.life)
  )
  
  // ============================================
  // 2성 제품 계산
  // ============================================
  // CORE: vital(guard+life) + erosion(wave+decay) + regen(life+wave)
  //       → 에센스: guard 1, life 2, wave 2, decay 1
  // POTION: erosion + regen + poison(decay+chaos)
  //       → 에센스: wave 2, decay 2, life 1, chaos 1
  // WING: defense(chaos+guard) + poison + vital
  //       → 에센스: chaos 2, guard 2, decay 1, life 1
  
  const getAvailableEssence = (type: 'guard' | 'wave' | 'chaos' | 'life' | 'decay') => {
    const essKey = `ess${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof inv.advanced2
    return (inv.advanced2[essKey] as number) + Math.floor(inv.shellfish.star2[type] / 2) * 2
  }
  
  const essAvail = {
    guard: getAvailableEssence('guard'),
    wave: getAvailableEssence('wave'),
    chaos: getAvailableEssence('chaos'),
    life: getAvailableEssence('life'),
    decay: getAvailableEssence('decay')
  }
  
  const star2Need = {
    CORE: { guard: 1, life: 2, wave: 2, decay: 1 },
    POTION: { wave: 2, decay: 2, life: 1, chaos: 1 },
    WING: { chaos: 2, guard: 2, decay: 1, life: 1 }
  }
  
  const maxCORE = Math.min(
    Math.floor(essAvail.guard / star2Need.CORE.guard),
    Math.floor(essAvail.life / star2Need.CORE.life),
    Math.floor(essAvail.wave / star2Need.CORE.wave),
    Math.floor(essAvail.decay / star2Need.CORE.decay)
  )
  essAvail.guard -= maxCORE * star2Need.CORE.guard
  essAvail.life -= maxCORE * star2Need.CORE.life
  essAvail.wave -= maxCORE * star2Need.CORE.wave
  essAvail.decay -= maxCORE * star2Need.CORE.decay
  
  const maxPOTION = Math.min(
    Math.floor(essAvail.wave / star2Need.POTION.wave),
    Math.floor(essAvail.decay / star2Need.POTION.decay),
    Math.floor(essAvail.life / star2Need.POTION.life),
    Math.floor(essAvail.chaos / star2Need.POTION.chaos)
  )
  essAvail.wave -= maxPOTION * star2Need.POTION.wave
  essAvail.decay -= maxPOTION * star2Need.POTION.decay
  essAvail.life -= maxPOTION * star2Need.POTION.life
  essAvail.chaos -= maxPOTION * star2Need.POTION.chaos
  
  const maxWING = Math.min(
    Math.floor(essAvail.chaos / star2Need.WING.chaos),
    Math.floor(essAvail.guard / star2Need.WING.guard),
    Math.floor(essAvail.decay / star2Need.WING.decay),
    Math.floor(essAvail.life / star2Need.WING.life)
  )
  
  // ============================================
  // 1성 제품 계산
  // ============================================
  // A: WG(guard+wave) + OD(chaos+life) + VD(life+decay)
  //    → 정수: guard 1, wave 1, chaos 1, life 2, decay 1
  // K: WP(wave+chaos) + OD + VD
  //    → 정수: wave 1, chaos 2, life 2, decay 1
  // L: ED(decay+guard) + WP + WG
  //    → 정수: decay 1, guard 2, wave 2, chaos 1
  
  const getAvailableEssence1 = (type: 'guard' | 'wave' | 'chaos' | 'life' | 'decay') => {
    const essKey = `ess${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof inv.advanced1
    return (inv.advanced1[essKey] as number) + Math.floor(inv.shellfish.star1[type] / 2) * 2
  }
  
  const ess1Avail = {
    guard: getAvailableEssence1('guard'),
    wave: getAvailableEssence1('wave'),
    chaos: getAvailableEssence1('chaos'),
    life: getAvailableEssence1('life'),
    decay: getAvailableEssence1('decay')
  }
  
  const star1Need = {
    A: { guard: 1, wave: 1, chaos: 1, life: 2, decay: 1 },
    K: { wave: 1, chaos: 2, life: 2, decay: 1 },
    L: { decay: 1, guard: 2, wave: 2, chaos: 1 }
  }
  
  const maxA = Math.min(
    Math.floor(ess1Avail.guard / star1Need.A.guard),
    Math.floor(ess1Avail.wave / star1Need.A.wave),
    Math.floor(ess1Avail.chaos / star1Need.A.chaos),
    Math.floor(ess1Avail.life / star1Need.A.life),
    Math.floor(ess1Avail.decay / star1Need.A.decay)
  )
  ess1Avail.guard -= maxA * star1Need.A.guard
  ess1Avail.wave -= maxA * star1Need.A.wave
  ess1Avail.chaos -= maxA * star1Need.A.chaos
  ess1Avail.life -= maxA * star1Need.A.life
  ess1Avail.decay -= maxA * star1Need.A.decay
  
  const maxK = Math.min(
    Math.floor(ess1Avail.wave / star1Need.K.wave),
    Math.floor(ess1Avail.chaos / star1Need.K.chaos),
    Math.floor(ess1Avail.life / star1Need.K.life),
    Math.floor(ess1Avail.decay / star1Need.K.decay)
  )
  ess1Avail.wave -= maxK * star1Need.K.wave
  ess1Avail.chaos -= maxK * star1Need.K.chaos
  ess1Avail.life -= maxK * star1Need.K.life
  ess1Avail.decay -= maxK * star1Need.K.decay
  
  const maxL = Math.min(
    Math.floor(ess1Avail.decay / star1Need.L.decay),
    Math.floor(ess1Avail.guard / star1Need.L.guard),
    Math.floor(ess1Avail.wave / star1Need.L.wave),
    Math.floor(ess1Avail.chaos / star1Need.L.chaos)
  )
  
  // 골드 계산 (프리미엄 적용)
  const rate = 1 + premiumRate
  const dilutionGold = maxDilution * prices.dilution * rate
  const star1Gold = (maxA * prices.star1.A + maxK * prices.star1.K + maxL * prices.star1.L) * rate
  const star2Gold = (maxCORE * prices.star2.CORE + maxPOTION * prices.star2.POTION + maxWING * prices.star2.WING) * rate
  const star3Gold = (maxAQUA * prices.star3.AQUA + maxNAUTILUS * prices.star3.NAUTILUS + maxSPINE * prices.star3.SPINE) * rate
  
  return {
    totalGold: Math.floor(dilutionGold + star1Gold + star2Gold + star3Gold),
    breakdown: {
      dilution: Math.floor(dilutionGold),
      star1: Math.floor(star1Gold),
      star2: Math.floor(star2Gold),
      star3: Math.floor(star3Gold)
    },
    products: {
      dilution: maxDilution,
      star1: { A: maxA, K: maxK, L: maxL },
      star2: { CORE: maxCORE, POTION: maxPOTION, WING: maxWING },
      star3: { AQUA: maxAQUA, NAUTILUS: maxNAUTILUS, SPINE: maxSPINE }
    }
  }
}

/**
 * 최적 스태미나 배분 찾기
 * 10% 단위로 모든 조합 시뮬레이션
 */
export function optimizeAllocation(
  totalStamina: number,
  inventory: Inventory,
  settings: OceanSettings
): OptimizeResult {
  const premiumRate = PREMIUM_RATE[settings.premiumPrice] || 0
  
  // 스태미나를 15 단위로 정규화
  const normalizedStamina = Math.floor(totalStamina / OCEAN_STAMINA_PER_GATHER) * OCEAN_STAMINA_PER_GATHER
  
  let bestResult: OptimizeResult | null = null
  let bestGold = -1
  
  // 5% 단위로 배분 조합 생성
  const step = 5
  
  for (let oyster = 0; oyster <= 100; oyster += step) {
    for (let conch = 0; conch <= 100 - oyster; conch += step) {
      for (let octopus = 0; octopus <= 100 - oyster - conch; octopus += step) {
        for (let seaweed = 0; seaweed <= 100 - oyster - conch - octopus; seaweed += step) {
          const urchin = 100 - oyster - conch - octopus - seaweed
          
          // 스태미나 배분
          const allocation: Allocation = {
            oyster: Math.floor(normalizedStamina * oyster / 100),
            conch: Math.floor(normalizedStamina * conch / 100),
            octopus: Math.floor(normalizedStamina * octopus / 100),
            seaweed: Math.floor(normalizedStamina * seaweed / 100),
            urchin: Math.floor(normalizedStamina * urchin / 100)
          }
          
          // 반올림 오차 보정
          const usedStamina = allocation.oyster + allocation.conch + allocation.octopus + allocation.seaweed + allocation.urchin
          const remaining = normalizedStamina - usedStamina
          if (remaining > 0) {
            if (allocation.oyster > 0) allocation.oyster += remaining
            else if (allocation.conch > 0) allocation.conch += remaining
            else if (allocation.octopus > 0) allocation.octopus += remaining
            else if (allocation.seaweed > 0) allocation.seaweed += remaining
            else allocation.urchin += remaining
          }
          
          // 드롭량 계산
          const drops = calculateDrops(allocation, settings)
          
          // 보유량 + 드롭량 합산
          const mergedInventory = mergeInventory(inventory, drops)
          
          // 골드 계산
          const goldResult = calculateGold(mergedInventory, premiumRate)
          
          if (goldResult.totalGold > bestGold) {
            bestGold = goldResult.totalGold
            bestResult = {
              allocation,
              gatherCounts: {
                oyster: Math.floor(allocation.oyster / OCEAN_STAMINA_PER_GATHER),
                conch: Math.floor(allocation.conch / OCEAN_STAMINA_PER_GATHER),
                octopus: Math.floor(allocation.octopus / OCEAN_STAMINA_PER_GATHER),
                seaweed: Math.floor(allocation.seaweed / OCEAN_STAMINA_PER_GATHER),
                urchin: Math.floor(allocation.urchin / OCEAN_STAMINA_PER_GATHER)
              },
              drops,
              totalGold: goldResult.totalGold,
              goldBreakdown: goldResult.breakdown,
              productCounts: goldResult.products
            }
          }
        }
      }
    }
  }
  
  // 결과가 없으면 균등 배분으로 fallback
  if (!bestResult) {
    const equalAlloc: Allocation = {
      oyster: Math.floor(normalizedStamina / 5),
      conch: Math.floor(normalizedStamina / 5),
      octopus: Math.floor(normalizedStamina / 5),
      seaweed: Math.floor(normalizedStamina / 5),
      urchin: normalizedStamina - Math.floor(normalizedStamina / 5) * 4
    }
    const drops = calculateDrops(equalAlloc, settings)
    const merged = mergeInventory(inventory, drops)
    const goldResult = calculateGold(merged, premiumRate)
    
    bestResult = {
      allocation: equalAlloc,
      gatherCounts: {
        oyster: Math.floor(equalAlloc.oyster / OCEAN_STAMINA_PER_GATHER),
        conch: Math.floor(equalAlloc.conch / OCEAN_STAMINA_PER_GATHER),
        octopus: Math.floor(equalAlloc.octopus / OCEAN_STAMINA_PER_GATHER),
        seaweed: Math.floor(equalAlloc.seaweed / OCEAN_STAMINA_PER_GATHER),
        urchin: Math.floor(equalAlloc.urchin / OCEAN_STAMINA_PER_GATHER)
      },
      drops,
      totalGold: goldResult.totalGold,
      goldBreakdown: goldResult.breakdown,
      productCounts: goldResult.products
    }
  }
  
  return bestResult
}

/**
 * 기본 보유량 (빈 인벤토리)
 */
export function getEmptyInventory(): Inventory {
  return {
    shellfish: {
      star1: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
      star2: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
      star3: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 }
    },
    advanced1: {
      essGuard: 0, essWave: 0, essChaos: 0, essLife: 0, essDecay: 0,
      coreWG: 0, coreWP: 0, coreOD: 0, coreVD: 0, coreED: 0
    },
    advanced2: {
      essGuard: 0, essWave: 0, essChaos: 0, essLife: 0, essDecay: 0,
      crystalVital: 0, crystalErosion: 0, crystalDefense: 0, crystalRegen: 0, crystalPoison: 0
    },
    advanced3: {
      elixGuard: 0, elixWave: 0, elixChaos: 0, elixLife: 0, elixDecay: 0,
      potionImmortal: 0, potionBarrier: 0, potionCorrupt: 0, potionFrenzy: 0, potionVenom: 0
    }
  }
}