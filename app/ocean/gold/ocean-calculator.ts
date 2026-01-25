// 해양 골드 계산기 - 중간재료 공유 통합 최적화 (2025년 업데이트)
// A사이트(띵보)와 동일한 로직: 추출액과 제품이 중간재료(핵/결정/영약)를 공유

// 골드 가격
export const GOLD_PRICES = {
  '0star': { DILUTION: 18444 },
  '1star': { A: 5159, K: 5234, L: 5393 },
  '2star': { CORE: 11131, POTION: 11242, WING: 11399 },
  '3star': { AQUA: 18985, NAUTILUS: 19207, SPINE: 19328 }
}

// 프리미엄 가격 비율
export const PREMIUM_PRICE_RATE: Record<number, number> = {
  0: 0, 1: 0.05, 2: 0.07, 3: 0.10, 4: 0.15,
  5: 0.20, 6: 0.30, 7: 0.40, 8: 0.50
}

// 추출액 1개당 필요 중간재료
export const DILUTION_INTERMEDIATE = {
  coreED: 3,           // 침식 방어의 핵 ★ 3개
  crystalDefense: 2,   // 방어 오염의 결정 ★★ 2개
  potionCorrupt: 1     // 타락 침식의 영약 ★★★ 1개
}

function floorToTwo(n: number) {
  return Math.floor(n / 2) * 2
}

// ========================
// 1성 계산기 (추출액용 침식방어핵 예약 지원)
// ========================
export interface Input1Star {
  guard: number; wave: number; chaos: number; life: number; decay: number
  essGuard?: number; essWave?: number; essChaos?: number; essLife?: number; essDecay?: number
  coreWG?: number; coreWP?: number; coreOD?: number; coreVD?: number; coreED?: number
}

export interface Result1Star {
  best: { gold: number; A: number; K: number; L: number }
  // 제품용만 (추출액 제외)
  coreNeedProduct: Record<string, number>
  essNeedProduct: Record<string, number>
  blockNeedProduct: Record<string, number>
  fishNeedProduct: Record<string, number>
  // 추출액용만 (통합 탭에서 사용)
  reservedCoreED: number
  essNeedDilution: Record<string, number>
  blockNeedDilution: Record<string, number>
  fishNeedDilution: Record<string, number>
  // 총합 (내부 계산용)
  coreNeed: Record<string, number>
  coreToMake: Record<string, number>
  essNeedTotal: Record<string, number>
  essToMake: Record<string, number>
  blockNeed: Record<string, number>
  blockNeedTotal: Record<string, number>
  fishNeed: Record<string, number>
  fishNeedTotal: Record<string, number>
}

/**
 * 1성 계산 (추출액용 침식방어핵 예약 가능)
 * @param reservedCoreED 추출액용으로 예약할 침식방어핵 개수 (통합 계산에서 사용)
 */
export function calculate1Star(input: Input1Star, isAdvanced: boolean, reservedCoreED: number = 0): Result1Star | null {
  const shellfish = { guard: input.guard, wave: input.wave, chaos: input.chaos, life: input.life, decay: input.decay }

  const ownedEss = {
    guard: input.essGuard || 0, wave: input.essWave || 0, chaos: input.essChaos || 0,
    life: input.essLife || 0, decay: input.essDecay || 0
  }

  const ownedCore = isAdvanced ? {
    WG: input.coreWG || 0, WP: input.coreWP || 0, OD: input.coreOD || 0, VD: input.coreVD || 0, ED: input.coreED || 0
  } : { WG: 0, WP: 0, OD: 0, VD: 0, ED: 0 }

  // 어패류로 만들 수 있는 정수 (2개씩 생산)
  const essFromShellfish = {
    guard: floorToTwo(shellfish.guard), wave: floorToTwo(shellfish.wave),
    chaos: floorToTwo(shellfish.chaos), life: floorToTwo(shellfish.life), decay: floorToTwo(shellfish.decay)
  }

  // 총 사용 가능 정수
  const totalEss = {
    guard: ownedEss.guard + essFromShellfish.guard,
    wave: ownedEss.wave + essFromShellfish.wave,
    chaos: ownedEss.chaos + essFromShellfish.chaos,
    life: ownedEss.life + essFromShellfish.life,
    decay: ownedEss.decay + essFromShellfish.decay
  }

  // 핵 조합법:
  // WG(물결수호): 수호+파동, WP(파동오염): 파동+혼란, OD(질서파괴): 혼란+생명
  // VD(활력붕괴): 생명+부식, ED(침식방어): 부식+수호
  
  // 제품 조합법:
  // 아쿠티스 A: WG + OD + VD
  // 광란체 K: WP + OD + VD  
  // 깃털 L: WG + WP + ED

  let best = { gold: -1, A: 0, K: 0, L: 0 }

  // 각 제품별 최대 가능 개수 계산
  // life = 2*(A+K) 이므로 A+K <= (life + ownedOD + ownedVD) / 2
  const maxAK = Math.floor((totalEss.life + ownedCore.OD + ownedCore.VD) / 2) + ownedCore.OD + ownedCore.VD
  // L은 guard, wave, decay에 의해 제한
  const maxL = Math.min(
    totalEss.guard + ownedCore.WG + ownedCore.ED,
    totalEss.wave + ownedCore.WG + ownedCore.WP,
    totalEss.decay + ownedCore.VD + ownedCore.ED
  )
  // 상한 제한 (실제 게임에서 150개 이상 만들 일은 거의 없음)
  const maxProduct = Math.min(150, Math.max(maxAK, maxL))

  for (let A = 0; A <= maxProduct; A++) {
    // A만으로 life 제약 초과 체크
    if (2 * A > totalEss.life + ownedCore.OD + ownedCore.VD) break
    
    for (let K = 0; K <= maxProduct; K++) {
      // A+K로 life 제약 초과 체크
      const minLife = 2 * Math.max(0, A + K - Math.max(ownedCore.OD, ownedCore.VD))
      if (minLife > totalEss.life) break
      
      for (let L = 0; L <= maxProduct; L++) {
        if (A + K + L === 0 && reservedCoreED === 0) continue

        const needCore = {
          WG: A + L, WP: K + L, OD: A + K, VD: A + K, ED: L + reservedCoreED
        }
        const makeCore = {
          WG: Math.max(0, needCore.WG - ownedCore.WG),
          WP: Math.max(0, needCore.WP - ownedCore.WP),
          OD: Math.max(0, needCore.OD - ownedCore.OD),
          VD: Math.max(0, needCore.VD - ownedCore.VD),
          ED: Math.max(0, needCore.ED - ownedCore.ED)
        }
        const needEss = {
          guard: makeCore.WG + makeCore.ED,
          wave: makeCore.WG + makeCore.WP,
          chaos: makeCore.WP + makeCore.OD,
          life: makeCore.OD + makeCore.VD,
          decay: makeCore.VD + makeCore.ED
        }

        if (needEss.guard > totalEss.guard || needEss.wave > totalEss.wave ||
            needEss.chaos > totalEss.chaos || needEss.life > totalEss.life || 
            needEss.decay > totalEss.decay) continue

        const gold = A * GOLD_PRICES['1star'].A + K * GOLD_PRICES['1star'].K + L * GOLD_PRICES['1star'].L
        if (gold > best.gold) {
          best = { gold, A, K, L }
        }
      }
    }
  }

  if (best.gold < 0 && reservedCoreED === 0) return null

  // === 제품용 재료 계산 (추출액 제외) ===
  const coreNeedProduct = {
    WG: best.A + best.L,
    WP: best.K + best.L,
    OD: best.A + best.K,
    VD: best.A + best.K,
    ED: best.L  // 깃털용만!
  }

  const coreToMakeProduct = {
    WG: Math.max(0, coreNeedProduct.WG - ownedCore.WG),
    WP: Math.max(0, coreNeedProduct.WP - ownedCore.WP),
    OD: Math.max(0, coreNeedProduct.OD - ownedCore.OD),
    VD: Math.max(0, coreNeedProduct.VD - ownedCore.VD),
    ED: Math.max(0, coreNeedProduct.ED - ownedCore.ED)
  }

  // 핵 만드는데 필요한 정수 (내부 계산용)
  const essNeedRaw = {
    guard: coreToMakeProduct.WG + coreToMakeProduct.ED,
    wave: coreToMakeProduct.WG + coreToMakeProduct.WP,
    chaos: coreToMakeProduct.WP + coreToMakeProduct.OD,
    life: coreToMakeProduct.OD + coreToMakeProduct.VD,
    decay: coreToMakeProduct.VD + coreToMakeProduct.ED
  }

  // 제작 횟수 (2개 단위로 올림)
  const craftCountProduct = {
    guard: Math.ceil(Math.max(0, essNeedRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedRaw.decay - ownedEss.decay) / 2)
  }

  // 실제 제작할 정수 (짝수, 제작량 기준)
  const essNeedProduct = {
    guard: craftCountProduct.guard * 2,
    wave: craftCountProduct.wave * 2,
    chaos: craftCountProduct.chaos * 2,
    life: craftCountProduct.life * 2,
    decay: craftCountProduct.decay * 2
  }

  const blockNeedProduct = {
    clay: craftCountProduct.guard * 2, sand: craftCountProduct.wave * 4, dirt: craftCountProduct.chaos * 8,
    gravel: craftCountProduct.life * 4, granite: craftCountProduct.decay * 2
  }

  const fishNeedProduct = {
    shrimp: coreToMakeProduct.WG, domi: coreToMakeProduct.WP, herring: coreToMakeProduct.OD,
    goldfish: coreToMakeProduct.VD, bass: coreToMakeProduct.ED
  }

  // === 추출액용 재료 계산 (보유량 차감 후) ===
  // 제품용에서 사용하고 남은 보유 핵
  const remainingOwnedCoreED = Math.max(0, ownedCore.ED - coreNeedProduct.ED)
  // 추출액용으로 만들어야 할 핵 (남은 보유량 차감)
  const coreToMakeDilution = Math.max(0, reservedCoreED - remainingOwnedCoreED)
  
  // 제품용에서 사용하고 남은 보유 정수
  const remainingOwnedEss = {
    guard: Math.max(0, ownedEss.guard - essNeedProduct.guard),
    decay: Math.max(0, ownedEss.decay - essNeedProduct.decay)
  }
  
  // 추출액용 핵 만드는데 필요한 정수 (남은 보유 정수 차감)
  const essToMakeDilutionRaw = {
    guard: Math.max(0, coreToMakeDilution - remainingOwnedEss.guard),
    decay: Math.max(0, coreToMakeDilution - remainingOwnedEss.decay)
  }

  // 제작 횟수 (2개 단위)
  const craftCountDilution = {
    guard: Math.ceil(essToMakeDilutionRaw.guard / 2),
    decay: Math.ceil(essToMakeDilutionRaw.decay / 2)
  }

  // 실제 제작할 정수 (짝수, 제작량 기준)
  const essNeedDilution = {
    guard: craftCountDilution.guard * 2,
    wave: 0,
    chaos: 0,
    life: 0,
    decay: craftCountDilution.decay * 2
  }

  const blockNeedDilution = {
    clay: craftCountDilution.guard * 2,
    sand: 0, dirt: 0, gravel: 0,
    granite: craftCountDilution.decay * 2
  }

  const fishNeedDilution = {
    shrimp: 0, domi: 0, herring: 0, goldfish: 0,
    bass: coreToMakeDilution  // 만들어야 할 핵 개수만큼
  }

  // === 총합 (내부 계산용) ===
  const coreNeed = {
    WG: coreNeedProduct.WG,
    WP: coreNeedProduct.WP,
    OD: coreNeedProduct.OD,
    VD: coreNeedProduct.VD,
    ED: coreNeedProduct.ED + reservedCoreED  // 제품 + 추출액
  }
  
  const coreToMake = {
    WG: Math.max(0, coreNeed.WG - ownedCore.WG),
    WP: Math.max(0, coreNeed.WP - ownedCore.WP),
    OD: Math.max(0, coreNeed.OD - ownedCore.OD),
    VD: Math.max(0, coreNeed.VD - ownedCore.VD),
    ED: Math.max(0, coreNeed.ED - ownedCore.ED)
  }

  // 핵 만드는데 필요한 정수 (내부 계산용 raw)
  const essNeedTotalRaw = {
    guard: coreToMake.WG + coreToMake.ED,
    wave: coreToMake.WG + coreToMake.WP,
    chaos: coreToMake.WP + coreToMake.OD,
    life: coreToMake.OD + coreToMake.VD,
    decay: coreToMake.VD + coreToMake.ED
  }

  // 제작 횟수 (2개 단위)
  const craftCount = {
    guard: Math.ceil(Math.max(0, essNeedTotalRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedTotalRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedTotalRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedTotalRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedTotalRaw.decay - ownedEss.decay) / 2)
  }

  // 실제 제작할 정수 (짝수)
  const essToMake = {
    guard: craftCount.guard * 2,
    wave: craftCount.wave * 2,
    chaos: craftCount.chaos * 2,
    life: craftCount.life * 2,
    decay: craftCount.decay * 2
  }

  // essNeedTotal도 제작량 기준으로 통일
  const essNeedTotal = { ...essToMake }

  const blockNeed = {
    clay: craftCount.guard * 2, sand: craftCount.wave * 4, dirt: craftCount.chaos * 8,
    gravel: craftCount.life * 4, granite: craftCount.decay * 2
  }

  const fishNeed = {
    shrimp: coreToMake.WG, domi: coreToMake.WP, herring: coreToMake.OD, 
    goldfish: coreToMake.VD, bass: coreToMake.ED
  }

  const totalCraftCount = {
    guard: Math.ceil(essNeedTotal.guard / 2),
    wave: Math.ceil(essNeedTotal.wave / 2),
    chaos: Math.ceil(essNeedTotal.chaos / 2),
    life: Math.ceil(essNeedTotal.life / 2),
    decay: Math.ceil(essNeedTotal.decay / 2)
  }
  
  const blockNeedTotal = {
    clay: totalCraftCount.guard * 2, sand: totalCraftCount.wave * 4, dirt: totalCraftCount.chaos * 8,
    gravel: totalCraftCount.life * 4, granite: totalCraftCount.decay * 2
  }
  
  const fishNeedTotal = {
    shrimp: coreNeed.WG, domi: coreNeed.WP, herring: coreNeed.OD, 
    goldfish: coreNeed.VD, bass: coreNeed.ED
  }

  return { 
    best,
    // 제품용
    coreNeedProduct, essNeedProduct, blockNeedProduct, fishNeedProduct,
    // 추출액용
    reservedCoreED, essNeedDilution, blockNeedDilution, fishNeedDilution,
    // 총합
    coreNeed, coreToMake, essNeedTotal, essToMake, blockNeed, blockNeedTotal, fishNeed, fishNeedTotal
  }
}

// ========================
// 2성 계산기 (추출액용 방어오염결정 예약 지원)
// ========================
export interface Input2Star {
  guard2: number; wave2: number; chaos2: number; life2: number; decay2: number
  essGuard?: number; essWave?: number; essChaos?: number; essLife?: number; essDecay?: number
  crystalVital?: number; crystalErosion?: number; crystalDefense?: number; crystalRegen?: number; crystalPoison?: number
}

export interface Result2Star {
  best: { gold: number; CORE: number; POTION: number; WING: number }
  // 제품용만 (추출액 제외)
  crystalNeedProduct: Record<string, number>
  essNeedProduct: Record<string, number>
  materialNeedProduct: Record<string, number>
  // 추출액용만 (통합 탭에서 사용)
  reservedCrystalDefense: number
  essNeedDilution: Record<string, number>
  materialNeedDilution: Record<string, number>
  // 총합 (내부 계산용)
  crystalNeed: Record<string, number>
  crystalToMake: Record<string, number>
  essNeedTotal: Record<string, number>
  essToMake: Record<string, number>
  materialNeed: Record<string, number>
  materialNeedTotal: Record<string, number>
}

/**
 * 2성 계산 (추출액용 방어오염결정 예약 가능)
 */
export function calculate2Star(input: Input2Star, isAdvanced: boolean, reservedCrystalDefense: number = 0): Result2Star | null {
  const shellfish = { guard: input.guard2, wave: input.wave2, chaos: input.chaos2, life: input.life2, decay: input.decay2 }

  const ownedEss = {
    guard: input.essGuard || 0, wave: input.essWave || 0, chaos: input.essChaos || 0,
    life: input.essLife || 0, decay: input.essDecay || 0
  }

  const ownedCrystal = isAdvanced ? {
    vital: input.crystalVital || 0, erosion: input.crystalErosion || 0, 
    defense: input.crystalDefense || 0, regen: input.crystalRegen || 0, poison: input.crystalPoison || 0
  } : { vital: 0, erosion: 0, defense: 0, regen: 0, poison: 0 }

  const essFromShellfish = {
    guard: floorToTwo(shellfish.guard), wave: floorToTwo(shellfish.wave),
    chaos: floorToTwo(shellfish.chaos), life: floorToTwo(shellfish.life), decay: floorToTwo(shellfish.decay)
  }

  const totalEss = {
    guard: ownedEss.guard + essFromShellfish.guard,
    wave: ownedEss.wave + essFromShellfish.wave,
    chaos: ownedEss.chaos + essFromShellfish.chaos,
    life: ownedEss.life + essFromShellfish.life,
    decay: ownedEss.decay + essFromShellfish.decay
  }

  // 결정 조합법:
  // vital(활기보존): 수호+생명, erosion(파도침식): 파동+부식, defense(방어오염): 혼란+수호
  // regen(격류재생): 생명+파동, poison(맹독혼란): 부식+혼란

  // 제품 조합법:
  // CORE(해구파동코어): vital + erosion + regen
  // POTION(침묵심해비약): erosion + regen + poison
  // WING(청해룡날개): defense + poison + vital

  let best = { gold: -1, CORE: 0, POTION: 0, WING: 0 }

  // 각 제품별 최대 가능 개수 계산
  const maxFromWave = Math.floor((totalEss.wave + ownedCrystal.erosion + ownedCrystal.regen) / 2) + ownedCrystal.erosion + ownedCrystal.regen
  const maxFromLife = Math.floor((totalEss.life + ownedCrystal.vital + ownedCrystal.regen) / 2) + ownedCrystal.vital + ownedCrystal.regen
  // 상한 제한
  const maxProduct = Math.min(150, Math.max(maxFromWave, maxFromLife, 
    totalEss.guard + ownedCrystal.vital + ownedCrystal.defense,
    totalEss.chaos + ownedCrystal.defense + ownedCrystal.poison,
    totalEss.decay + ownedCrystal.erosion + ownedCrystal.poison
  ))

  for (let CORE = 0; CORE <= maxProduct; CORE++) {
    // CORE만으로 wave 제약 초과 체크
    if (2 * CORE > totalEss.wave + ownedCrystal.erosion + ownedCrystal.regen) break
    
    for (let POTION = 0; POTION <= maxProduct; POTION++) {
      // CORE+POTION으로 wave 제약 초과 체크
      const minWave = 2 * Math.max(0, CORE + POTION - Math.max(ownedCrystal.erosion, ownedCrystal.regen))
      if (minWave > totalEss.wave) break

      for (let WING = 0; WING <= maxProduct; WING++) {
        if (CORE + POTION + WING === 0 && reservedCrystalDefense === 0) continue

        const needCrystal = {
          vital: CORE + WING,
          erosion: CORE + POTION,
          defense: WING + reservedCrystalDefense,
          regen: CORE + POTION,
          poison: POTION + WING
        }
        const makeCrystal = {
          vital: Math.max(0, needCrystal.vital - ownedCrystal.vital),
          erosion: Math.max(0, needCrystal.erosion - ownedCrystal.erosion),
          defense: Math.max(0, needCrystal.defense - ownedCrystal.defense),
          regen: Math.max(0, needCrystal.regen - ownedCrystal.regen),
          poison: Math.max(0, needCrystal.poison - ownedCrystal.poison)
        }
        const needEss = {
          guard: makeCrystal.vital + makeCrystal.defense,
          wave: makeCrystal.erosion + makeCrystal.regen,
          chaos: makeCrystal.defense + makeCrystal.poison,
          life: makeCrystal.vital + makeCrystal.regen,
          decay: makeCrystal.erosion + makeCrystal.poison
        }

        if (needEss.guard > totalEss.guard || needEss.wave > totalEss.wave ||
            needEss.chaos > totalEss.chaos || needEss.life > totalEss.life || 
            needEss.decay > totalEss.decay) continue

        const gold = CORE * GOLD_PRICES['2star'].CORE + POTION * GOLD_PRICES['2star'].POTION + WING * GOLD_PRICES['2star'].WING
        if (gold > best.gold) {
          best = { gold, CORE, POTION, WING }
        }
      }
    }
  }

  if (best.gold < 0 && reservedCrystalDefense === 0) return null

  // === 제품용 재료 계산 (추출액 제외) ===
  const crystalNeedProduct = {
    vital: best.CORE + best.WING,
    erosion: best.CORE + best.POTION,
    defense: best.WING,  // 날개용만!
    regen: best.CORE + best.POTION,
    poison: best.POTION + best.WING
  }

  const crystalToMakeProduct = {
    vital: Math.max(0, crystalNeedProduct.vital - ownedCrystal.vital),
    erosion: Math.max(0, crystalNeedProduct.erosion - ownedCrystal.erosion),
    defense: Math.max(0, crystalNeedProduct.defense - ownedCrystal.defense),
    regen: Math.max(0, crystalNeedProduct.regen - ownedCrystal.regen),
    poison: Math.max(0, crystalNeedProduct.poison - ownedCrystal.poison)
  }

  // 결정 만드는데 필요한 에센스 (내부 계산용)
  const essNeedRaw = {
    guard: crystalToMakeProduct.vital + crystalToMakeProduct.defense,
    wave: crystalToMakeProduct.erosion + crystalToMakeProduct.regen,
    chaos: crystalToMakeProduct.defense + crystalToMakeProduct.poison,
    life: crystalToMakeProduct.vital + crystalToMakeProduct.regen,
    decay: crystalToMakeProduct.erosion + crystalToMakeProduct.poison
  }

  // 제작 횟수 (2개 단위로 올림)
  const craftCountProduct = {
    guard: Math.ceil(Math.max(0, essNeedRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedRaw.decay - ownedEss.decay) / 2)
  }

  // 실제 제작할 에센스 (짝수, 제작량 기준)
  const essNeedProduct = {
    guard: craftCountProduct.guard * 2,
    wave: craftCountProduct.wave * 2,
    chaos: craftCountProduct.chaos * 2,
    life: craftCountProduct.life * 2,
    decay: craftCountProduct.decay * 2
  }

  // essToMakeProduct도 짝수 기준으로 (어패류 사용량)
  const essToMakeProduct = {
    guard: craftCountProduct.guard * 2,
    wave: craftCountProduct.wave * 2,
    chaos: craftCountProduct.chaos * 2,
    life: craftCountProduct.life * 2,
    decay: craftCountProduct.decay * 2
  }

  const totalCrystalToMakeProduct = crystalToMakeProduct.vital + crystalToMakeProduct.erosion + crystalToMakeProduct.defense + crystalToMakeProduct.regen + crystalToMakeProduct.poison
  const totalEssToMakeProduct = essToMakeProduct.guard + essToMakeProduct.wave + essToMakeProduct.chaos + essToMakeProduct.life + essToMakeProduct.decay

  const materialNeedProduct = {
    seaweed: Math.ceil(totalEssToMakeProduct / 2) * 4,
    oakLeaves: craftCountProduct.guard * 6, spruceLeaves: craftCountProduct.wave * 6,
    birchLeaves: craftCountProduct.chaos * 6, acaciaLeaves: craftCountProduct.life * 6, cherryLeaves: craftCountProduct.decay * 6,
    kelp: totalCrystalToMakeProduct * 4, lapisBlock: crystalToMakeProduct.vital, redstoneBlock: crystalToMakeProduct.erosion,
    ironIngot: crystalToMakeProduct.defense * 3, goldIngot: crystalToMakeProduct.regen * 2, diamond: crystalToMakeProduct.poison
  }

  // === 추출액용 재료 계산 (보유량 차감 후) ===
  // 제품용에서 사용하고 남은 보유 결정
  const remainingOwnedCrystalDefense = Math.max(0, ownedCrystal.defense - crystalNeedProduct.defense)
  // 추출액용으로 만들어야 할 결정 (남은 보유량 차감)
  const crystalToMakeDilution = Math.max(0, reservedCrystalDefense - remainingOwnedCrystalDefense)
  
  // 제품용에서 사용하고 남은 보유 에센스
  const remainingOwnedEss = {
    guard: Math.max(0, ownedEss.guard - essNeedProduct.guard),
    chaos: Math.max(0, ownedEss.chaos - essNeedProduct.chaos)
  }
  
  // 추출액용 결정 만드는데 필요한 에센스 (남은 보유 에센스 차감)
  const essToMakeDilutionRaw = {
    guard: Math.max(0, crystalToMakeDilution - remainingOwnedEss.guard),
    chaos: Math.max(0, crystalToMakeDilution - remainingOwnedEss.chaos)
  }

  // 제작 횟수 (2개 단위)
  const craftCountDilution = {
    guard: Math.ceil(essToMakeDilutionRaw.guard / 2),
    chaos: Math.ceil(essToMakeDilutionRaw.chaos / 2)
  }

  // 실제 제작할 에센스 (짝수, 제작량 기준)
  const essNeedDilution = {
    guard: craftCountDilution.guard * 2,
    wave: 0,
    chaos: craftCountDilution.chaos * 2,
    life: 0,
    decay: 0
  }

  const materialNeedDilution = {
    seaweed: Math.ceil((craftCountDilution.guard + craftCountDilution.chaos)) * 4,
    oakLeaves: craftCountDilution.guard * 6,
    spruceLeaves: 0,
    birchLeaves: craftCountDilution.chaos * 6,
    acaciaLeaves: 0,
    cherryLeaves: 0,
    kelp: crystalToMakeDilution * 4,
    lapisBlock: 0, redstoneBlock: 0,
    ironIngot: crystalToMakeDilution * 3,
    goldIngot: 0, diamond: 0
  }

  // === 총합 (내부 계산용) ===
  const crystalNeed = {
    vital: crystalNeedProduct.vital,
    erosion: crystalNeedProduct.erosion,
    defense: crystalNeedProduct.defense + reservedCrystalDefense,  // 제품 + 추출액
    regen: crystalNeedProduct.regen,
    poison: crystalNeedProduct.poison
  }

  const crystalToMake = {
    vital: Math.max(0, crystalNeed.vital - ownedCrystal.vital),
    erosion: Math.max(0, crystalNeed.erosion - ownedCrystal.erosion),
    defense: Math.max(0, crystalNeed.defense - ownedCrystal.defense),
    regen: Math.max(0, crystalNeed.regen - ownedCrystal.regen),
    poison: Math.max(0, crystalNeed.poison - ownedCrystal.poison)
  }

  // 결정 만드는데 필요한 에센스 (raw)
  const essNeedTotalRaw = {
    guard: crystalToMake.vital + crystalToMake.defense,
    wave: crystalToMake.erosion + crystalToMake.regen,
    chaos: crystalToMake.defense + crystalToMake.poison,
    life: crystalToMake.vital + crystalToMake.regen,
    decay: crystalToMake.erosion + crystalToMake.poison
  }

  // 제작 횟수 (2개 단위)
  const craftCountTotal = {
    guard: Math.ceil(Math.max(0, essNeedTotalRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedTotalRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedTotalRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedTotalRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedTotalRaw.decay - ownedEss.decay) / 2)
  }

  // 실제 제작할 에센스 (짝수)
  const essToMake = {
    guard: craftCountTotal.guard * 2,
    wave: craftCountTotal.wave * 2,
    chaos: craftCountTotal.chaos * 2,
    life: craftCountTotal.life * 2,
    decay: craftCountTotal.decay * 2
  }

  const essNeedTotal = { ...essToMake }

  const totalCrystalToMake = crystalToMake.vital + crystalToMake.erosion + crystalToMake.defense + crystalToMake.regen + crystalToMake.poison
  const totalEssToMake = essToMake.guard + essToMake.wave + essToMake.chaos + essToMake.life + essToMake.decay

  const materialNeed = {
    seaweed: Math.ceil(totalEssToMake / 2) * 4,
    oakLeaves: craftCountTotal.guard * 6, spruceLeaves: craftCountTotal.wave * 6,
    birchLeaves: craftCountTotal.chaos * 6, acaciaLeaves: craftCountTotal.life * 6, cherryLeaves: craftCountTotal.decay * 6,
    kelp: totalCrystalToMake * 4, lapisBlock: crystalToMake.vital, redstoneBlock: crystalToMake.erosion,
    ironIngot: crystalToMake.defense * 3, goldIngot: crystalToMake.regen * 2, diamond: crystalToMake.poison
  }

  const totalEssNeed = essNeedTotal.guard + essNeedTotal.wave + essNeedTotal.chaos + essNeedTotal.life + essNeedTotal.decay
  const totalCrystalNeed = crystalNeed.vital + crystalNeed.erosion + crystalNeed.defense + crystalNeed.regen + crystalNeed.poison

  const materialNeedTotal = {
    seaweed: Math.ceil(totalEssNeed / 2) * 4,
    oakLeaves: craftCountTotal.guard * 6, spruceLeaves: craftCountTotal.wave * 6,
    birchLeaves: craftCountTotal.chaos * 6, acaciaLeaves: craftCountTotal.life * 6, cherryLeaves: craftCountTotal.decay * 6,
    kelp: totalCrystalNeed * 4, lapisBlock: crystalNeed.vital, redstoneBlock: crystalNeed.erosion,
    ironIngot: crystalNeed.defense * 3, goldIngot: crystalNeed.regen * 2, diamond: crystalNeed.poison
  }

  return { 
    best,
    // 제품용
    crystalNeedProduct, essNeedProduct, materialNeedProduct,
    // 추출액용
    reservedCrystalDefense, essNeedDilution, materialNeedDilution,
    // 총합
    crystalNeed, crystalToMake, essNeedTotal, essToMake, materialNeed, materialNeedTotal
  }
}

// ========================
// 3성 계산기 (추출액용 타락침식영약 예약 지원)
// ========================
export interface Input3Star {
  guard: number; wave: number; chaos: number; life: number; decay: number
  elixGuard?: number; elixWave?: number; elixChaos?: number; elixLife?: number; elixDecay?: number
  potionImmortal?: number; potionBarrier?: number; potionCorrupt?: number; potionFrenzy?: number; potionVenom?: number
}

export interface Result3Star {
  best: { gold: number; AQUA: number; NAUTILUS: number; SPINE: number }
  // 제품용만 (추출액 제외)
  potionNeedProduct: Record<string, number>
  elixNeedProduct: Record<string, number>
  materialNeedProduct: Record<string, number>
  deadCoralNeedProduct: Record<string, number>
  // 추출액용만 (통합 탭에서 사용)
  reservedPotionCorrupt: number
  elixNeedDilution: Record<string, number>
  materialNeedDilution: Record<string, number>
  deadCoralNeedDilution: Record<string, number>
  // 총합 (내부 계산용)
  potionNeed: Record<string, number>
  potionToMake: Record<string, number>
  elixNeedTotal: Record<string, number>
  elixToMake: Record<string, number>
  materialNeed: Record<string, number>
  materialNeedTotal: Record<string, number>
  deadCoralNeed: Record<string, number>
  deadCoralNeedTotal: Record<string, number>
}

/**
 * 3성 계산 (추출액용 타락침식영약 예약 가능)
 */
export function calculate3Star(input: Input3Star, isAdvanced: boolean, reservedPotionCorrupt: number = 0): Result3Star | null {
  const shellfish = { guard: input.guard, wave: input.wave, chaos: input.chaos, life: input.life, decay: input.decay }

  const ownedElix = {
    guard: input.elixGuard || 0, wave: input.elixWave || 0, chaos: input.elixChaos || 0,
    life: input.elixLife || 0, decay: input.elixDecay || 0
  }

  const ownedPotion = isAdvanced ? {
    immortal: input.potionImmortal || 0, barrier: input.potionBarrier || 0, 
    corrupt: input.potionCorrupt || 0, frenzy: input.potionFrenzy || 0, venom: input.potionVenom || 0
  } : { immortal: 0, barrier: 0, corrupt: 0, frenzy: 0, venom: 0 }

  // 3성 엘릭서는 1:1 (어패류 1개당 엘릭서 1개)
  const totalElix = {
    guard: ownedElix.guard + shellfish.guard,
    wave: ownedElix.wave + shellfish.wave,
    chaos: ownedElix.chaos + shellfish.chaos,
    life: ownedElix.life + shellfish.life,
    decay: ownedElix.decay + shellfish.decay
  }

  // 영약 조합법:
  // immortal(불멸재생): 수호+생명, barrier(파동장벽): 파동+수호, corrupt(타락침식): 혼란+부식
  // frenzy(생명광란): 생명+혼란, venom(맹독파동): 부식+파동

  // 제품 조합법:
  // AQUA(아쿠아펄스파편): immortal + barrier + venom
  // NAUTILUS(나우틸러스손): barrier + frenzy + immortal
  // SPINE(무저의척추): corrupt + venom + frenzy

  let best = { gold: -1, AQUA: 0, NAUTILUS: 0, SPINE: 0 }

  // 각 제품별 최대 가능 개수 계산
  const maxFromGuard = Math.floor((totalElix.guard + ownedPotion.immortal + ownedPotion.barrier) / 2) + ownedPotion.immortal + ownedPotion.barrier
  // 상한 제한
  const maxProduct = Math.min(150, Math.max(maxFromGuard,
    totalElix.wave + ownedPotion.barrier + ownedPotion.venom,
    totalElix.chaos + ownedPotion.corrupt + ownedPotion.frenzy,
    totalElix.life + ownedPotion.immortal + ownedPotion.frenzy,
    totalElix.decay + ownedPotion.corrupt + ownedPotion.venom
  ))

  for (let AQUA = 0; AQUA <= maxProduct; AQUA++) {
    // AQUA만으로 guard 제약 초과 체크
    if (2 * AQUA > totalElix.guard + ownedPotion.immortal + ownedPotion.barrier) break
    
    for (let NAUTILUS = 0; NAUTILUS <= maxProduct; NAUTILUS++) {
      // AQUA+NAUTILUS로 guard 제약 초과 체크
      const minGuard = 2 * Math.max(0, AQUA + NAUTILUS - Math.max(ownedPotion.immortal, ownedPotion.barrier))
      if (minGuard > totalElix.guard) break

      for (let SPINE = 0; SPINE <= maxProduct; SPINE++) {
        if (AQUA + NAUTILUS + SPINE === 0 && reservedPotionCorrupt === 0) continue

        const needPotion = {
          immortal: AQUA + NAUTILUS,
          barrier: AQUA + NAUTILUS,
          corrupt: SPINE + reservedPotionCorrupt,
          frenzy: NAUTILUS + SPINE,
          venom: AQUA + SPINE
        }
        const makePotion = {
          immortal: Math.max(0, needPotion.immortal - ownedPotion.immortal),
          barrier: Math.max(0, needPotion.barrier - ownedPotion.barrier),
          corrupt: Math.max(0, needPotion.corrupt - ownedPotion.corrupt),
          frenzy: Math.max(0, needPotion.frenzy - ownedPotion.frenzy),
          venom: Math.max(0, needPotion.venom - ownedPotion.venom)
        }
        const needElix = {
          guard: makePotion.immortal + makePotion.barrier,
          wave: makePotion.barrier + makePotion.venom,
          chaos: makePotion.corrupt + makePotion.frenzy,
          life: makePotion.immortal + makePotion.frenzy,
          decay: makePotion.corrupt + makePotion.venom
        }

        if (needElix.guard > totalElix.guard || needElix.wave > totalElix.wave ||
            needElix.chaos > totalElix.chaos || needElix.life > totalElix.life || 
            needElix.decay > totalElix.decay) continue

        const gold = AQUA * GOLD_PRICES['3star'].AQUA + NAUTILUS * GOLD_PRICES['3star'].NAUTILUS + SPINE * GOLD_PRICES['3star'].SPINE
        if (gold > best.gold) {
          best = { gold, AQUA, NAUTILUS, SPINE }
        }
      }
    }
  }

  if (best.gold < 0 && reservedPotionCorrupt === 0) return null

  // === 제품용 재료 계산 (추출액 제외) ===
  const potionNeedProduct = {
    immortal: best.AQUA + best.NAUTILUS,
    barrier: best.AQUA + best.NAUTILUS,
    corrupt: best.SPINE,  // 척추용만!
    frenzy: best.NAUTILUS + best.SPINE,
    venom: best.AQUA + best.SPINE
  }

  const potionToMakeProduct = {
    immortal: Math.max(0, potionNeedProduct.immortal - ownedPotion.immortal),
    barrier: Math.max(0, potionNeedProduct.barrier - ownedPotion.barrier),
    corrupt: Math.max(0, potionNeedProduct.corrupt - ownedPotion.corrupt),
    frenzy: Math.max(0, potionNeedProduct.frenzy - ownedPotion.frenzy),
    venom: Math.max(0, potionNeedProduct.venom - ownedPotion.venom)
  }

  // 영약 만드는데 필요한 엘릭서 (내부 계산용)
  const elixNeedRaw = {
    guard: potionToMakeProduct.immortal + potionToMakeProduct.barrier,
    wave: potionToMakeProduct.barrier + potionToMakeProduct.venom,
    chaos: potionToMakeProduct.corrupt + potionToMakeProduct.frenzy,
    life: potionToMakeProduct.immortal + potionToMakeProduct.frenzy,
    decay: potionToMakeProduct.corrupt + potionToMakeProduct.venom
  }

  // 실제 제작할 엘릭서 (보유량 차감 후, 3성은 1:1이라 짝수 올림 불필요)
  const elixToMakeProduct = {
    guard: Math.max(0, elixNeedRaw.guard - ownedElix.guard),
    wave: Math.max(0, elixNeedRaw.wave - ownedElix.wave),
    chaos: Math.max(0, elixNeedRaw.chaos - ownedElix.chaos),
    life: Math.max(0, elixNeedRaw.life - ownedElix.life),
    decay: Math.max(0, elixNeedRaw.decay - ownedElix.decay)
  }

  // elixNeedProduct = 실제 제작량으로 통일
  const elixNeedProduct = { ...elixToMakeProduct }

  const totalElixToMakeProduct = elixToMakeProduct.guard + elixToMakeProduct.wave + elixToMakeProduct.chaos + elixToMakeProduct.life + elixToMakeProduct.decay
  const totalPotionToMakeProduct = potionToMakeProduct.immortal + potionToMakeProduct.barrier + potionToMakeProduct.corrupt + potionToMakeProduct.frenzy + potionToMakeProduct.venom

  const materialNeedProduct = {
    seaSquirt: totalElixToMakeProduct * 2, glassBottle: totalElixToMakeProduct * 3,
    netherrack: elixToMakeProduct.guard * 8, magmaBlock: elixToMakeProduct.wave * 4, soulSoil: elixToMakeProduct.chaos * 4, 
    crimsonStem: elixToMakeProduct.life * 4, warpedStem: elixToMakeProduct.decay * 4,
    driedKelp: totalPotionToMakeProduct * 6, glowBerry: totalPotionToMakeProduct * 4
  }

  const deadCoralNeedProduct = {
    deadTubeCoral: potionToMakeProduct.immortal * 2, deadBrainCoral: potionToMakeProduct.barrier * 2, 
    deadBubbleCoral: potionToMakeProduct.corrupt * 2, deadFireCoral: potionToMakeProduct.frenzy * 2, deadHornCoral: potionToMakeProduct.venom * 2
  }

  // === 추출액용 재료 계산 (보유량 차감 후) ===
  // 제품용에서 사용하고 남은 보유 영약
  const remainingOwnedPotionCorrupt = Math.max(0, ownedPotion.corrupt - potionNeedProduct.corrupt)
  // 추출액용으로 만들어야 할 영약 (남은 보유량 차감)
  const potionToMakeDilution = Math.max(0, reservedPotionCorrupt - remainingOwnedPotionCorrupt)
  
  // 제품용에서 사용하고 남은 보유 엘릭서
  const remainingOwnedElix = {
    chaos: Math.max(0, ownedElix.chaos - elixNeedProduct.chaos),
    decay: Math.max(0, ownedElix.decay - elixNeedProduct.decay)
  }
  
  // 추출액용 영약 만드는데 필요한 엘릭서 (남은 보유 엘릭서 차감)
  const elixToMakeDilution = {
    chaos: Math.max(0, potionToMakeDilution - remainingOwnedElix.chaos),
    decay: Math.max(0, potionToMakeDilution - remainingOwnedElix.decay)
  }

  const elixNeedDilution = {
    guard: 0,
    wave: 0,
    chaos: elixToMakeDilution.chaos,  // 실제 제작량
    life: 0,
    decay: elixToMakeDilution.decay   // 실제 제작량
  }

  const totalElixToMakeDilution = elixToMakeDilution.chaos + elixToMakeDilution.decay

  const materialNeedDilution = {
    seaSquirt: totalElixToMakeDilution * 2,
    glassBottle: totalElixToMakeDilution * 3,
    netherrack: 0, magmaBlock: 0,
    soulSoil: elixToMakeDilution.chaos * 4,
    crimsonStem: 0,
    warpedStem: elixToMakeDilution.decay * 4,
    driedKelp: potionToMakeDilution * 6,
    glowBerry: potionToMakeDilution * 4
  }

  const deadCoralNeedDilution = {
    deadTubeCoral: 0, deadBrainCoral: 0, 
    deadBubbleCoral: potionToMakeDilution * 2,  // 타락침식영약용 (만들어야 할 양만)
    deadFireCoral: 0, deadHornCoral: 0
  }

  // === 총합 (내부 계산용) ===
  const potionNeed = {
    immortal: potionNeedProduct.immortal,
    barrier: potionNeedProduct.barrier,
    corrupt: potionNeedProduct.corrupt + reservedPotionCorrupt,  // 제품 + 추출액
    frenzy: potionNeedProduct.frenzy,
    venom: potionNeedProduct.venom
  }

  const potionToMake = {
    immortal: Math.max(0, potionNeed.immortal - ownedPotion.immortal),
    barrier: Math.max(0, potionNeed.barrier - ownedPotion.barrier),
    corrupt: Math.max(0, potionNeed.corrupt - ownedPotion.corrupt),
    frenzy: Math.max(0, potionNeed.frenzy - ownedPotion.frenzy),
    venom: Math.max(0, potionNeed.venom - ownedPotion.venom)
  }

  // 영약 만드는데 필요한 엘릭서 (raw)
  const elixNeedTotalRaw = {
    guard: potionToMake.immortal + potionToMake.barrier,
    wave: potionToMake.barrier + potionToMake.venom,
    chaos: potionToMake.corrupt + potionToMake.frenzy,
    life: potionToMake.immortal + potionToMake.frenzy,
    decay: potionToMake.corrupt + potionToMake.venom
  }

  // 실제 제작할 엘릭서 (보유량 차감 후, 3성은 1:1)
  const elixToMake = {
    guard: Math.max(0, elixNeedTotalRaw.guard - ownedElix.guard),
    wave: Math.max(0, elixNeedTotalRaw.wave - ownedElix.wave),
    chaos: Math.max(0, elixNeedTotalRaw.chaos - ownedElix.chaos),
    life: Math.max(0, elixNeedTotalRaw.life - ownedElix.life),
    decay: Math.max(0, elixNeedTotalRaw.decay - ownedElix.decay)
  }

  // elixNeedTotal = 제작량 기준으로 통일
  const elixNeedTotal = { ...elixToMake }

  const totalElixToMake = elixToMake.guard + elixToMake.wave + elixToMake.chaos + elixToMake.life + elixToMake.decay
  const totalPotionToMake = potionToMake.immortal + potionToMake.barrier + potionToMake.corrupt + potionToMake.frenzy + potionToMake.venom

  const materialNeed = {
    seaSquirt: totalElixToMake * 2, glassBottle: totalElixToMake * 3,
    netherrack: elixToMake.guard * 8, magmaBlock: elixToMake.wave * 4, soulSoil: elixToMake.chaos * 4, 
    crimsonStem: elixToMake.life * 4, warpedStem: elixToMake.decay * 4,
    driedKelp: totalPotionToMake * 6, glowBerry: totalPotionToMake * 4
  }

  const deadCoralNeed = {
    deadTubeCoral: potionToMake.immortal * 2, deadBrainCoral: potionToMake.barrier * 2, 
    deadBubbleCoral: potionToMake.corrupt * 2, deadFireCoral: potionToMake.frenzy * 2, deadHornCoral: potionToMake.venom * 2
  }

  const totalElixNeed = elixNeedTotal.guard + elixNeedTotal.wave + elixNeedTotal.chaos + elixNeedTotal.life + elixNeedTotal.decay
  const totalPotionNeed = potionNeed.immortal + potionNeed.barrier + potionNeed.corrupt + potionNeed.frenzy + potionNeed.venom

  const materialNeedTotal = {
    seaSquirt: totalElixNeed * 2, glassBottle: totalElixNeed * 3,
    netherrack: elixNeedTotal.guard * 8, magmaBlock: elixNeedTotal.wave * 4, soulSoil: elixNeedTotal.chaos * 4, 
    crimsonStem: elixNeedTotal.life * 4, warpedStem: elixNeedTotal.decay * 4,
    driedKelp: totalPotionNeed * 6, glowBerry: totalPotionNeed * 4
  }

  const deadCoralNeedTotal = {
    deadTubeCoral: potionNeed.immortal * 2, deadBrainCoral: potionNeed.barrier * 2, 
    deadBubbleCoral: potionNeed.corrupt * 2, deadFireCoral: potionNeed.frenzy * 2, deadHornCoral: potionNeed.venom * 2
  }

  return { 
    best,
    // 제품용
    potionNeedProduct, elixNeedProduct, materialNeedProduct, deadCoralNeedProduct,
    // 추출액용
    reservedPotionCorrupt, elixNeedDilution, materialNeedDilution, deadCoralNeedDilution,
    // 총합
    potionNeed, potionToMake, elixNeedTotal, elixToMake, materialNeed, materialNeedTotal, deadCoralNeed, deadCoralNeedTotal
  }
}

// ========================
// 통합 계산기 (중간재료 공유 최적화)
// ========================
export interface InputAll {
  star1: { guard: number; wave: number; chaos: number; life: number; decay: number }
  star2: { guard: number; wave: number; chaos: number; life: number; decay: number }
  star3: { guard: number; wave: number; chaos: number; life: number; decay: number }
}

export interface ResultAll {
  totalGold: number
  dilution: number
  result1: Result1Star | null
  result2: Result2Star | null
  result3: Result3Star | null
  summary: { dilutionGold: number; star1Gold: number; star2Gold: number; star3Gold: number }
}

/**
 * 통합 최적화 계산
 * - 추출액과 각 성급 제품이 중간재료를 공유
 * - 추출액 개수별로 최적 조합 탐색
 * 
 * 추출액 1개 = 침식방어핵 3개 + 방어오염결정 2개 + 타락침식영약 1개
 * - 침식방어핵은 1성 깃털(L)과 공유
 * - 방어오염결정은 2성 날개(WING)와 공유
 * - 타락침식영약은 3성 척추(SPINE)와 공유
 */
export function calculateAll(
  input: InputAll, 
  advanced1?: any,
  advanced2?: any,
  advanced3?: any
): ResultAll {
  const hasAdvanced1 = advanced1 && Object.values(advanced1).some((v: any) => v > 0)
  const hasAdvanced2 = advanced2 && Object.values(advanced2).some((v: any) => v > 0)
  const hasAdvanced3 = advanced3 && Object.values(advanced3).some((v: any) => v > 0)

  // 추출액 최대 개수 추정 (정수/에센스/엘릭서 기준)
  const ess1Guard = floorToTwo(input.star1.guard) + (advanced1?.essGuard || 0)
  const ess1Decay = floorToTwo(input.star1.decay) + (advanced1?.essDecay || 0)
  const ownedCoreED = advanced1?.coreED || 0
  
  const ess2Guard = floorToTwo(input.star2.guard) + (advanced2?.essGuard || 0)
  const ess2Chaos = floorToTwo(input.star2.chaos) + (advanced2?.essChaos || 0)
  const ownedCrystalDefense = advanced2?.crystalDefense || 0
  
  const elix3Chaos = input.star3.chaos + (advanced3?.elixChaos || 0)
  const elix3Decay = input.star3.decay + (advanced3?.elixDecay || 0)
  const ownedPotionCorrupt = advanced3?.potionCorrupt || 0

  // 각 중간재료 최대 생산 가능량 (대략적 추정)
  const maxCoreED = Math.floor(Math.min(ess1Guard, ess1Decay) / 2) + ownedCoreED + 20
  const maxCrystalDefense = Math.floor(Math.min(ess2Guard, ess2Chaos) / 2) + ownedCrystalDefense + 20
  const maxPotionCorrupt = Math.floor(Math.min(elix3Chaos, elix3Decay) / 2) + ownedPotionCorrupt + 20

  const maxDilution = Math.min(
    Math.floor(maxCoreED / DILUTION_INTERMEDIATE.coreED),
    Math.floor(maxCrystalDefense / DILUTION_INTERMEDIATE.crystalDefense),
    Math.floor(maxPotionCorrupt / DILUTION_INTERMEDIATE.potionCorrupt)
  )

  let best: ResultAll = {
    totalGold: 0, dilution: 0, result1: null, result2: null, result3: null,
    summary: { dilutionGold: 0, star1Gold: 0, star2Gold: 0, star3Gold: 0 }
  }

  // 추출액 0개부터 최대까지 모든 경우 시뮬레이션
  for (let d = 0; d <= maxDilution; d++) {
    // 추출액 d개에 필요한 중간재료 (제품과 공유됨!)
    const reservedCoreED = d * DILUTION_INTERMEDIATE.coreED           // 침식방어핵 3d개
    const reservedCrystalDefense = d * DILUTION_INTERMEDIATE.crystalDefense  // 방어오염결정 2d개
    const reservedPotionCorrupt = d * DILUTION_INTERMEDIATE.potionCorrupt    // 타락침식영약 d개

    // 각 성급 계산 (예약된 중간재료 포함)
    const r1 = calculate1Star({ 
      ...input.star1, 
      ...(hasAdvanced1 ? advanced1 : {})
    }, !!hasAdvanced1, reservedCoreED)
    
    const r2 = calculate2Star({ 
      guard2: input.star2.guard, wave2: input.star2.wave, chaos2: input.star2.chaos, 
      life2: input.star2.life, decay2: input.star2.decay,
      ...(hasAdvanced2 ? advanced2 : {})
    }, !!hasAdvanced2, reservedCrystalDefense)
    
    const r3 = calculate3Star({ 
      ...input.star3, 
      ...(hasAdvanced3 ? advanced3 : {})
    }, !!hasAdvanced3, reservedPotionCorrupt)

    // 하나라도 실패하면 이 추출액 개수는 불가능
    if (!r1 || !r2 || !r3) continue

    const dilutionGold = d * GOLD_PRICES['0star'].DILUTION
    const star1Gold = r1.best.gold
    const star2Gold = r2.best.gold
    const star3Gold = r3.best.gold
    const totalGold = dilutionGold + star1Gold + star2Gold + star3Gold

    if (totalGold > best.totalGold) {
      best = {
        totalGold, dilution: d, result1: r1, result2: r2, result3: r3,
        summary: { dilutionGold, star1Gold, star2Gold, star3Gold }
      }
    }
  }

  return best
}