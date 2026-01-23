// 해양 골드 계산기 - 중간재료 공유 통합 최적화 (2025년 업데이트)
// A사이트(띵보)와 동일한 로직: 희석액과 제품이 중간재료(핵/결정/영약)를 공유

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

// 희석액 1개당 필요 중간재료
export const DILUTION_INTERMEDIATE = {
  coreED: 3,           // 침식 방어의 핵 ★ 3개
  crystalDefense: 2,   // 방어 오염의 결정 ★★ 2개
  potionCorrupt: 1     // 타락 침식의 영약 ★★★ 1개
}

function floorToTwo(n: number) {
  return Math.floor(n / 2) * 2
}

// ========================
// 1성 계산기 (희석액용 침식방어핵 예약 지원)
// ========================
export interface Input1Star {
  guard: number; wave: number; chaos: number; life: number; decay: number
  essGuard?: number; essWave?: number; essChaos?: number; essLife?: number; essDecay?: number
  coreWG?: number; coreWP?: number; coreOD?: number; coreVD?: number; coreED?: number
}

export interface Result1Star {
  best: { gold: number; A: number; K: number; L: number }
  coreNeed: Record<string, number>
  coreToMake: Record<string, number>
  essNeedTotal: Record<string, number>
  essToMake: Record<string, number>
  blockNeed: Record<string, number>
  blockNeedTotal: Record<string, number>
  fishNeed: Record<string, number>
  fishNeedTotal: Record<string, number>
  reservedCoreED?: number
}

/**
 * 1성 계산 (희석액용 침식방어핵 예약 가능)
 * @param reservedCoreED 희석액용으로 예약할 침식방어핵 개수 (통합 계산에서 사용)
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

  const maxProducts = Math.floor((totalEss.guard + totalEss.wave + totalEss.chaos + totalEss.life + totalEss.decay) / 3) + 
                      Math.max(ownedCore.WG, ownedCore.WP, ownedCore.OD, ownedCore.VD, ownedCore.ED) + 10

  for (let A = 0; A <= maxProducts; A++) {
    for (let K = 0; K <= maxProducts; K++) {
      for (let L = 0; L <= maxProducts; L++) {
        if (A + K + L === 0 && reservedCoreED === 0) continue

        // 필요 핵 (제품용 + 희석액용 ED)
        const needCore = {
          WG: A + L,
          WP: K + L,
          OD: A + K,
          VD: A + K,
          ED: L + reservedCoreED  // 깃털용 + 희석액용!
        }

        // 만들어야 할 핵 (보유량 차감)
        const makeCore = {
          WG: Math.max(0, needCore.WG - ownedCore.WG),
          WP: Math.max(0, needCore.WP - ownedCore.WP),
          OD: Math.max(0, needCore.OD - ownedCore.OD),
          VD: Math.max(0, needCore.VD - ownedCore.VD),
          ED: Math.max(0, needCore.ED - ownedCore.ED)
        }

        // 핵 제작에 필요한 정수
        const needEss = {
          guard: makeCore.WG + makeCore.ED,  // 물결수호 + 침식방어
          wave: makeCore.WG + makeCore.WP,   // 물결수호 + 파동오염
          chaos: makeCore.WP + makeCore.OD,  // 파동오염 + 질서파괴
          life: makeCore.OD + makeCore.VD,   // 질서파괴 + 활력붕괴
          decay: makeCore.VD + makeCore.ED   // 활력붕괴 + 침식방어
        }

        // 정수 충분한지 체크
        if (needEss.guard > totalEss.guard || needEss.wave > totalEss.wave ||
            needEss.chaos > totalEss.chaos || needEss.life > totalEss.life || 
            needEss.decay > totalEss.decay) continue

        // 1성 제품 골드만 계산
        const gold = A * GOLD_PRICES['1star'].A + K * GOLD_PRICES['1star'].K + L * GOLD_PRICES['1star'].L
        
        if (gold > best.gold) {
          best = { gold, A, K, L }
        }
      }
    }
  }

  if (best.gold < 0 && reservedCoreED === 0) return null

  // 최적 결과 상세 계산
  const coreNeed = {
    WG: best.A + best.L,
    WP: best.K + best.L,
    OD: best.A + best.K,
    VD: best.A + best.K,
    ED: best.L + reservedCoreED  // 희석액용 포함
  }
  
  const coreToMake = {
    WG: Math.max(0, coreNeed.WG - ownedCore.WG),
    WP: Math.max(0, coreNeed.WP - ownedCore.WP),
    OD: Math.max(0, coreNeed.OD - ownedCore.OD),
    VD: Math.max(0, coreNeed.VD - ownedCore.VD),
    ED: Math.max(0, coreNeed.ED - ownedCore.ED)
  }

  const essNeedTotal = {
    guard: coreToMake.WG + coreToMake.ED,
    wave: coreToMake.WG + coreToMake.WP,
    chaos: coreToMake.WP + coreToMake.OD,
    life: coreToMake.OD + coreToMake.VD,
    decay: coreToMake.VD + coreToMake.ED
  }

  const essToMake = {
    guard: Math.max(0, essNeedTotal.guard - ownedEss.guard),
    wave: Math.max(0, essNeedTotal.wave - ownedEss.wave),
    chaos: Math.max(0, essNeedTotal.chaos - ownedEss.chaos),
    life: Math.max(0, essNeedTotal.life - ownedEss.life),
    decay: Math.max(0, essNeedTotal.decay - ownedEss.decay)
  }

  const craftCount = {
    guard: Math.ceil(essToMake.guard / 2),
    wave: Math.ceil(essToMake.wave / 2),
    chaos: Math.ceil(essToMake.chaos / 2),
    life: Math.ceil(essToMake.life / 2),
    decay: Math.ceil(essToMake.decay / 2)
  }

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
    best, coreNeed, coreToMake, essNeedTotal, essToMake, blockNeed, blockNeedTotal, fishNeed, fishNeedTotal,
    reservedCoreED
  }
}

// ========================
// 2성 계산기 (희석액용 방어오염결정 예약 지원)
// ========================
export interface Input2Star {
  guard2: number; wave2: number; chaos2: number; life2: number; decay2: number
  essGuard?: number; essWave?: number; essChaos?: number; essLife?: number; essDecay?: number
  crystalVital?: number; crystalErosion?: number; crystalDefense?: number; crystalRegen?: number; crystalPoison?: number
}

export interface Result2Star {
  best: { gold: number; CORE: number; POTION: number; WING: number }
  crystalNeed: Record<string, number>
  crystalToMake: Record<string, number>
  essNeedTotal: Record<string, number>
  essToMake: Record<string, number>
  materialNeed: Record<string, number>
  materialNeedTotal: Record<string, number>
  reservedCrystalDefense?: number
}

/**
 * 2성 계산 (희석액용 방어오염결정 예약 가능)
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

  const maxProducts = Math.floor((totalEss.guard + totalEss.wave + totalEss.chaos + totalEss.life + totalEss.decay) / 3) +
                      Math.max(ownedCrystal.vital, ownedCrystal.erosion, ownedCrystal.defense, ownedCrystal.regen, ownedCrystal.poison) + 10

  for (let CORE = 0; CORE <= maxProducts; CORE++) {
    for (let POTION = 0; POTION <= maxProducts; POTION++) {
      for (let WING = 0; WING <= maxProducts; WING++) {
        if (CORE + POTION + WING === 0 && reservedCrystalDefense === 0) continue

        const needCrystal = {
          vital: CORE + WING,
          erosion: CORE + POTION,
          defense: WING + reservedCrystalDefense,  // 날개용 + 희석액용!
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
        
        if (gold > best.gold) best = { gold, CORE, POTION, WING }
      }
    }
  }

  if (best.gold < 0 && reservedCrystalDefense === 0) return null

  const crystalNeed = {
    vital: best.CORE + best.WING,
    erosion: best.CORE + best.POTION,
    defense: best.WING + reservedCrystalDefense,  // 희석액용 포함
    regen: best.CORE + best.POTION,
    poison: best.POTION + best.WING
  }

  const crystalToMake = {
    vital: Math.max(0, crystalNeed.vital - ownedCrystal.vital),
    erosion: Math.max(0, crystalNeed.erosion - ownedCrystal.erosion),
    defense: Math.max(0, crystalNeed.defense - ownedCrystal.defense),
    regen: Math.max(0, crystalNeed.regen - ownedCrystal.regen),
    poison: Math.max(0, crystalNeed.poison - ownedCrystal.poison)
  }

  const essNeedTotal = {
    guard: crystalToMake.vital + crystalToMake.defense,
    wave: crystalToMake.erosion + crystalToMake.regen,
    chaos: crystalToMake.defense + crystalToMake.poison,
    life: crystalToMake.vital + crystalToMake.regen,
    decay: crystalToMake.erosion + crystalToMake.poison
  }

  const essToMake = {
    guard: Math.max(0, essNeedTotal.guard - ownedEss.guard),
    wave: Math.max(0, essNeedTotal.wave - ownedEss.wave),
    chaos: Math.max(0, essNeedTotal.chaos - ownedEss.chaos),
    life: Math.max(0, essNeedTotal.life - ownedEss.life),
    decay: Math.max(0, essNeedTotal.decay - ownedEss.decay)
  }

  const totalCrystalToMake = crystalToMake.vital + crystalToMake.erosion + crystalToMake.defense + crystalToMake.regen + crystalToMake.poison
  const totalEssToMake = essToMake.guard + essToMake.wave + essToMake.chaos + essToMake.life + essToMake.decay

  const materialNeed = {
    seaweed: Math.ceil(totalEssToMake / 2) * 4,
    oakLeaves: Math.ceil(essToMake.guard / 2) * 6, spruceLeaves: Math.ceil(essToMake.wave / 2) * 6,
    birchLeaves: Math.ceil(essToMake.chaos / 2) * 6, acaciaLeaves: Math.ceil(essToMake.life / 2) * 6, cherryLeaves: Math.ceil(essToMake.decay / 2) * 6,
    kelp: totalCrystalToMake * 4, lapisBlock: crystalToMake.vital, redstoneBlock: crystalToMake.erosion,
    ironIngot: crystalToMake.defense * 3, goldIngot: crystalToMake.regen * 2, diamond: crystalToMake.poison
  }

  const totalEssNeed = essNeedTotal.guard + essNeedTotal.wave + essNeedTotal.chaos + essNeedTotal.life + essNeedTotal.decay
  const totalCrystalNeed = crystalNeed.vital + crystalNeed.erosion + crystalNeed.defense + crystalNeed.regen + crystalNeed.poison

  const materialNeedTotal = {
    seaweed: Math.ceil(totalEssNeed / 2) * 4,
    oakLeaves: Math.ceil(essNeedTotal.guard / 2) * 6, spruceLeaves: Math.ceil(essNeedTotal.wave / 2) * 6,
    birchLeaves: Math.ceil(essNeedTotal.chaos / 2) * 6, acaciaLeaves: Math.ceil(essNeedTotal.life / 2) * 6, cherryLeaves: Math.ceil(essNeedTotal.decay / 2) * 6,
    kelp: totalCrystalNeed * 4, lapisBlock: crystalNeed.vital, redstoneBlock: crystalNeed.erosion,
    ironIngot: crystalNeed.defense * 3, goldIngot: crystalNeed.regen * 2, diamond: crystalNeed.poison
  }

  return { 
    best, crystalNeed, crystalToMake, essNeedTotal, essToMake, materialNeed, materialNeedTotal,
    reservedCrystalDefense
  }
}

// ========================
// 3성 계산기 (희석액용 타락침식영약 예약 지원)
// ========================
export interface Input3Star {
  guard: number; wave: number; chaos: number; life: number; decay: number
  elixGuard?: number; elixWave?: number; elixChaos?: number; elixLife?: number; elixDecay?: number
  potionImmortal?: number; potionBarrier?: number; potionCorrupt?: number; potionFrenzy?: number; potionVenom?: number
}

export interface Result3Star {
  best: { gold: number; AQUA: number; NAUTILUS: number; SPINE: number }
  potionNeed: Record<string, number>
  potionToMake: Record<string, number>
  elixNeedTotal: Record<string, number>
  elixToMake: Record<string, number>
  materialNeed: Record<string, number>
  materialNeedTotal: Record<string, number>
  deadCoralNeed: Record<string, number>
  deadCoralNeedTotal: Record<string, number>
  reservedPotionCorrupt?: number
}

/**
 * 3성 계산 (희석액용 타락침식영약 예약 가능)
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

  const maxProducts = Math.floor((totalElix.guard + totalElix.wave + totalElix.chaos + totalElix.life + totalElix.decay) / 3) +
                      Math.max(ownedPotion.immortal, ownedPotion.barrier, ownedPotion.corrupt, ownedPotion.frenzy, ownedPotion.venom) + 10

  for (let AQUA = 0; AQUA <= maxProducts; AQUA++) {
    for (let NAUTILUS = 0; NAUTILUS <= maxProducts; NAUTILUS++) {
      for (let SPINE = 0; SPINE <= maxProducts; SPINE++) {
        if (AQUA + NAUTILUS + SPINE === 0 && reservedPotionCorrupt === 0) continue

        const needPotion = {
          immortal: AQUA + NAUTILUS,
          barrier: AQUA + NAUTILUS,
          corrupt: SPINE + reservedPotionCorrupt,  // 척추용 + 희석액용!
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
        
        if (gold > best.gold) best = { gold, AQUA, NAUTILUS, SPINE }
      }
    }
  }

  if (best.gold < 0 && reservedPotionCorrupt === 0) return null

  const potionNeed = {
    immortal: best.AQUA + best.NAUTILUS,
    barrier: best.AQUA + best.NAUTILUS,
    corrupt: best.SPINE + reservedPotionCorrupt,  // 희석액용 포함
    frenzy: best.NAUTILUS + best.SPINE,
    venom: best.AQUA + best.SPINE
  }

  const potionToMake = {
    immortal: Math.max(0, potionNeed.immortal - ownedPotion.immortal),
    barrier: Math.max(0, potionNeed.barrier - ownedPotion.barrier),
    corrupt: Math.max(0, potionNeed.corrupt - ownedPotion.corrupt),
    frenzy: Math.max(0, potionNeed.frenzy - ownedPotion.frenzy),
    venom: Math.max(0, potionNeed.venom - ownedPotion.venom)
  }

  const elixNeedTotal = {
    guard: potionToMake.immortal + potionToMake.barrier,
    wave: potionToMake.barrier + potionToMake.venom,
    chaos: potionToMake.corrupt + potionToMake.frenzy,
    life: potionToMake.immortal + potionToMake.frenzy,
    decay: potionToMake.corrupt + potionToMake.venom
  }

  const elixToMake = {
    guard: Math.max(0, elixNeedTotal.guard - ownedElix.guard),
    wave: Math.max(0, elixNeedTotal.wave - ownedElix.wave),
    chaos: Math.max(0, elixNeedTotal.chaos - ownedElix.chaos),
    life: Math.max(0, elixNeedTotal.life - ownedElix.life),
    decay: Math.max(0, elixNeedTotal.decay - ownedElix.decay)
  }

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
    best, potionNeed, potionToMake, elixNeedTotal, elixToMake, materialNeed, materialNeedTotal, deadCoralNeed, deadCoralNeedTotal,
    reservedPotionCorrupt
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
 * - 희석액과 각 성급 제품이 중간재료를 공유
 * - 희석액 개수별로 최적 조합 탐색
 * 
 * 희석액 1개 = 침식방어핵 3개 + 방어오염결정 2개 + 타락침식영약 1개
 * - 침식방어핵은 1성 깃털(L)과 공유
 * - 방어오염결정은 2성 날개(WING)와 공유
 * - 타락침식영약은 3성 척추(SPINE)와 공유
 */
export function calculateAll(
  input: InputAll, 
  includeDilution: boolean = true,
  advanced1?: any,
  advanced2?: any,
  advanced3?: any
): ResultAll {
  const hasAdvanced1 = advanced1 && Object.values(advanced1).some((v: any) => v > 0)
  const hasAdvanced2 = advanced2 && Object.values(advanced2).some((v: any) => v > 0)
  const hasAdvanced3 = advanced3 && Object.values(advanced3).some((v: any) => v > 0)

  // 희석액 미포함 시
  if (!includeDilution) {
    const r1 = calculate1Star({ 
      ...input.star1, 
      ...(hasAdvanced1 ? advanced1 : {})
    }, !!hasAdvanced1, 0)
    
    const r2 = calculate2Star({ 
      guard2: input.star2.guard, wave2: input.star2.wave, chaos2: input.star2.chaos, 
      life2: input.star2.life, decay2: input.star2.decay,
      ...(hasAdvanced2 ? advanced2 : {})
    }, !!hasAdvanced2, 0)
    
    const r3 = calculate3Star({ 
      ...input.star3, 
      ...(hasAdvanced3 ? advanced3 : {})
    }, !!hasAdvanced3, 0)
    
    return {
      totalGold: (r1?.best.gold || 0) + (r2?.best.gold || 0) + (r3?.best.gold || 0),
      dilution: 0,
      result1: r1, result2: r2, result3: r3,
      summary: { 
        dilutionGold: 0, 
        star1Gold: r1?.best.gold || 0, 
        star2Gold: r2?.best.gold || 0, 
        star3Gold: r3?.best.gold || 0 
      }
    }
  }

  // 희석액 최대 개수 추정 (정수/에센스/엘릭서 기준)
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

  // 희석액 0개부터 최대까지 모든 경우 시뮬레이션
  for (let d = 0; d <= maxDilution; d++) {
    // 희석액 d개에 필요한 중간재료 (제품과 공유됨!)
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

    // 하나라도 실패하면 이 희석액 개수는 불가능
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