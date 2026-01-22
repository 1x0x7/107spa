// 해양 골드 계산기 - 통합 계산에 희석액 포함 (2025년 업데이트)

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

// 희석액 1개당 필요 어패류 (통합 계산기에서만 사용)
// 매핑: guard=굴, wave=소라, chaos=문어, life=미역, decay=성게
export const DILUTION_COST = {
  decay1: 4,   // 성게 ★
  guard1: 4,   // 굴 ★
  guard2: 2,   // 굴 ★★
  chaos2: 2,   // 문어 ★★
  chaos3: 1,   // 문어 ★★★
  decay3: 1    // 성게 ★★★
}

function floorToTwo(n: number) {
  return Math.floor(n / 2) * 2
}

// ========================
// 1성 계산기
// ========================
export interface Input1Star {
  guard: number; wave: number; chaos: number; life: number; decay: number
  essGuard?: number; essWave?: number; essChaos?: number; essLife?: number; essDecay?: number
  coreWG?: number; coreWP?: number; coreOD?: number; coreVD?: number; coreED?: number
}

export interface Result1Star {
  best: { gold: number; A: number; K: number; L: number }
  coreNeed: Record<string, number>; coreToMake: Record<string, number>
  essNeedTotal: Record<string, number>; essToMake: Record<string, number>
  blockNeed: Record<string, number>; blockNeedTotal: Record<string, number>
  fishNeed: Record<string, number>; fishNeedTotal: Record<string, number>
}

export function calculate1Star(input: Input1Star, isAdvanced: boolean): Result1Star | null {
  const totalShellfish = { guard: input.guard, wave: input.wave, chaos: input.chaos, life: input.life, decay: input.decay }

  const totalEss = {
    guard: input.essGuard || 0, wave: input.essWave || 0, chaos: input.essChaos || 0,
    life: input.essLife || 0, decay: input.essDecay || 0
  }

  const totalCore = isAdvanced ? {
    WG: input.coreWG || 0, WP: input.coreWP || 0, OD: input.coreOD || 0, VD: input.coreVD || 0, ED: input.coreED || 0
  } : { WG: 0, WP: 0, OD: 0, VD: 0, ED: 0 }

  const essFromShellfish = {
    guard: floorToTwo(totalShellfish.guard), wave: floorToTwo(totalShellfish.wave),
    chaos: floorToTwo(totalShellfish.chaos), life: floorToTwo(totalShellfish.life), decay: floorToTwo(totalShellfish.decay)
  }

  const availableEss = {
    guard: totalEss.guard + essFromShellfish.guard, wave: totalEss.wave + essFromShellfish.wave,
    chaos: totalEss.chaos + essFromShellfish.chaos, life: totalEss.life + essFromShellfish.life, decay: totalEss.decay + essFromShellfish.decay
  }

  // 핵 제작에 필요한 정수 조합 (정확한 조합법)
  // 물결수호 (WG): 수호+파동, 파동오염 (WP): 파동+혼란, 질서파괴 (OD): 혼란+생명
  // 활력붕괴 (VD): 생명+부식, 침식방어 (ED): 부식+수호
  const maxCoreWG = totalCore.WG + Math.floor((availableEss.guard + availableEss.wave) / 2)
  const maxCoreWP = totalCore.WP + Math.floor((availableEss.wave + availableEss.chaos) / 2)
  const maxCoreOD = totalCore.OD + Math.floor((availableEss.chaos + availableEss.life) / 2)
  const maxCoreVD = totalCore.VD + Math.floor((availableEss.life + availableEss.decay) / 2)
  const maxCoreED = totalCore.ED + Math.floor((availableEss.decay + availableEss.guard) / 2)

  // 제품별 필요 핵: A(WG,OD,VD), K(WP,OD,VD), L(WG,WP,ED)
  const maxA = Math.min(maxCoreWG, maxCoreOD, maxCoreVD)
  const maxK = Math.min(maxCoreWP, maxCoreOD, maxCoreVD)
  const maxL = Math.min(maxCoreWG, maxCoreWP, maxCoreED)

  let best = { gold: -1, A: 0, K: 0, L: 0 }

  for (let A = 0; A <= maxA; A++) {
    for (let K = 0; K <= maxK; K++) {
      for (let L = 0; L <= maxL; L++) {
        // 필요한 핵 개수 (정확한 조합법)
        const needCore = {
          WG: A + L,      // 물결 수호: 아쿠티스 + 리바이던
          WP: K + L,      // 파동 오염: 광란체 + 리바이던
          OD: A + K,      // 질서 파괴: 아쿠티스 + 광란체
          VD: A + K,      // 활력 붕괴: 아쿠티스 + 광란체
          ED: L           // 침식 방어: 리바이던만
        }
        const makeCore = {
          WG: Math.max(0, needCore.WG - totalCore.WG), WP: Math.max(0, needCore.WP - totalCore.WP),
          OD: Math.max(0, needCore.OD - totalCore.OD), VD: Math.max(0, needCore.VD - totalCore.VD), ED: Math.max(0, needCore.ED - totalCore.ED)
        }
        // 핵 제작에 필요한 정수
        // 물결수호: 수호+파동, 파동오염: 파동+혼란, 질서파괴: 혼란+생명, 활력붕괴: 생명+부식, 침식방어: 부식+수호
        const needEss = {
          guard: makeCore.WG + makeCore.ED,  // 물결수호 + 침식방어
          wave: makeCore.WG + makeCore.WP,   // 물결수호 + 파동오염
          chaos: makeCore.WP + makeCore.OD,  // 파동오염 + 질서파괴
          life: makeCore.OD + makeCore.VD,   // 질서파괴 + 활력붕괴
          decay: makeCore.VD + makeCore.ED   // 활력붕괴 + 침식방어
        }
        const makeEss = {
          guard: Math.max(0, needEss.guard - totalEss.guard), wave: Math.max(0, needEss.wave - totalEss.wave),
          chaos: Math.max(0, needEss.chaos - totalEss.chaos), life: Math.max(0, needEss.life - totalEss.life), decay: Math.max(0, needEss.decay - totalEss.decay)
        }
        if (makeEss.guard > essFromShellfish.guard || makeEss.wave > essFromShellfish.wave ||
            makeEss.chaos > essFromShellfish.chaos || makeEss.life > essFromShellfish.life || makeEss.decay > essFromShellfish.decay) continue

        const gold = A * GOLD_PRICES['1star'].A + K * GOLD_PRICES['1star'].K + L * GOLD_PRICES['1star'].L
        if (gold > best.gold) best = { gold, A, K, L }
      }
    }
  }

  if (best.gold < 0) return null

  // 정확한 핵 조합법
  const coreNeed = {
    WG: best.A + best.L,      // 물결 수호: 아쿠티스 + 리바이던
    WP: best.K + best.L,      // 파동 오염: 광란체 + 리바이던
    OD: best.A + best.K,      // 질서 파괴: 아쿠티스 + 광란체
    VD: best.A + best.K,      // 활력 붕괴: 아쿠티스 + 광란체
    ED: best.L                // 침식 방어: 리바이던만
  }
  const coreToMake = {
    WG: Math.max(0, coreNeed.WG - totalCore.WG), WP: Math.max(0, coreNeed.WP - totalCore.WP),
    OD: Math.max(0, coreNeed.OD - totalCore.OD), VD: Math.max(0, coreNeed.VD - totalCore.VD), ED: Math.max(0, coreNeed.ED - totalCore.ED)
  }
  // 핵 제작에 필요한 정수
  const essNeedForCore = {
    guard: coreToMake.WG + coreToMake.ED,  // 물결수호 + 침식방어
    wave: coreToMake.WG + coreToMake.WP,   // 물결수호 + 파동오염
    chaos: coreToMake.WP + coreToMake.OD,  // 파동오염 + 질서파괴
    life: coreToMake.OD + coreToMake.VD,   // 질서파괴 + 활력붕괴
    decay: coreToMake.VD + coreToMake.ED   // 활력붕괴 + 침식방어
  }
  const essToMake = {
    guard: Math.max(0, essNeedForCore.guard - totalEss.guard), wave: Math.max(0, essNeedForCore.wave - totalEss.wave),
    chaos: Math.max(0, essNeedForCore.chaos - totalEss.chaos), life: Math.max(0, essNeedForCore.life - totalEss.life), decay: Math.max(0, essNeedForCore.decay - totalEss.decay)
  }

  // 제작 횟수 (2개씩 나오므로)
  const craftCount = {
    guard: Math.ceil(essToMake.guard / 2), wave: Math.ceil(essToMake.wave / 2),
    chaos: Math.ceil(essToMake.chaos / 2), life: Math.ceil(essToMake.life / 2), decay: Math.ceil(essToMake.decay / 2)
  }

  // 블록 필요량 (정수 제작에 필요)
  const blockNeed = {
    clay: craftCount.guard * 2, sand: craftCount.wave * 4, dirt: craftCount.chaos * 8,
    gravel: craftCount.life * 4, granite: craftCount.decay * 2
  }
  const fishNeed = { shrimp: coreToMake.WG, domi: coreToMake.WP, herring: coreToMake.OD, goldfish: coreToMake.VD, bass: coreToMake.ED }

  // 전체 필요량 (세트 모드용)
  const essNeedTotal = {
    guard: coreNeed.WG + coreNeed.ED,  // 물결수호 + 침식방어
    wave: coreNeed.WG + coreNeed.WP,   // 물결수호 + 파동오염
    chaos: coreNeed.WP + coreNeed.OD,  // 파동오염 + 질서파괴
    life: coreNeed.OD + coreNeed.VD,   // 질서파괴 + 활력붕괴
    decay: coreNeed.VD + coreNeed.ED   // 활력붕괴 + 침식방어
  }
  const craftCountTotal = {
    guard: Math.ceil(essNeedTotal.guard / 2), wave: Math.ceil(essNeedTotal.wave / 2),
    chaos: Math.ceil(essNeedTotal.chaos / 2), life: Math.ceil(essNeedTotal.life / 2), decay: Math.ceil(essNeedTotal.decay / 2)
  }
  const blockNeedTotal = {
    clay: craftCountTotal.guard * 2, sand: craftCountTotal.wave * 4, dirt: craftCountTotal.chaos * 8,
    gravel: craftCountTotal.life * 4, granite: craftCountTotal.decay * 2
  }
  const fishNeedTotal = { shrimp: coreNeed.WG, domi: coreNeed.WP, herring: coreNeed.OD, goldfish: coreNeed.VD, bass: coreNeed.ED }

  return { best, coreNeed, coreToMake, essNeedTotal, essToMake, blockNeed, blockNeedTotal, fishNeed, fishNeedTotal }
}

// ========================
// 2성 계산기
// ========================
export interface Input2Star {
  guard2: number; wave2: number; chaos2: number; life2: number; decay2: number
  essGuard?: number; essWave?: number; essChaos?: number; essLife?: number; essDecay?: number
  crystalVital?: number; crystalErosion?: number; crystalDefense?: number; crystalRegen?: number; crystalPoison?: number
}

export interface Result2Star {
  best: { gold: number; CORE: number; POTION: number; WING: number }
  crystalNeed: Record<string, number>; crystalToMake: Record<string, number>
  essNeedTotal: Record<string, number>; essToMake: Record<string, number>
  materialNeed: Record<string, number>; materialNeedTotal: Record<string, number>
}

export function calculate2Star(input: Input2Star, isAdvanced: boolean): Result2Star | null {
  const totalShellfish = { guard: input.guard2, wave: input.wave2, chaos: input.chaos2, life: input.life2, decay: input.decay2 }

  const totalEss = {
    guard: input.essGuard || 0, wave: input.essWave || 0, chaos: input.essChaos || 0,
    life: input.essLife || 0, decay: input.essDecay || 0
  }

  const totalCrystal = isAdvanced ? {
    vital: input.crystalVital || 0, erosion: input.crystalErosion || 0, defense: input.crystalDefense || 0, regen: input.crystalRegen || 0, poison: input.crystalPoison || 0
  } : { vital: 0, erosion: 0, defense: 0, regen: 0, poison: 0 }

  const essFromShellfish = {
    guard: floorToTwo(totalShellfish.guard), wave: floorToTwo(totalShellfish.wave),
    chaos: floorToTwo(totalShellfish.chaos), life: floorToTwo(totalShellfish.life), decay: floorToTwo(totalShellfish.decay)
  }

  const availableEss = {
    guard: totalEss.guard + essFromShellfish.guard, wave: totalEss.wave + essFromShellfish.wave,
    chaos: totalEss.chaos + essFromShellfish.chaos, life: totalEss.life + essFromShellfish.life, decay: totalEss.decay + essFromShellfish.decay
  }

  const maxVital = totalCrystal.vital + Math.floor((availableEss.life + availableEss.guard) / 2)
  const maxErosion = totalCrystal.erosion + Math.floor((availableEss.wave + availableEss.decay) / 2)
  const maxDefense = totalCrystal.defense + Math.floor((availableEss.chaos + availableEss.guard) / 2)
  const maxRegen = totalCrystal.regen + Math.floor((availableEss.life + availableEss.wave) / 2)
  const maxPoison = totalCrystal.poison + Math.floor((availableEss.chaos + availableEss.decay) / 2)

  // 제품별 필요 결정: CORE(vital,erosion,regen), POTION(erosion,regen,poison), WING(defense,poison,vital)
  const maxCORE = Math.min(maxVital, maxErosion, maxRegen)
  const maxPOTION = Math.min(maxErosion, maxRegen, maxPoison)
  const maxWING = Math.min(maxDefense, maxPoison, maxVital)

  let best = { gold: -1, CORE: 0, POTION: 0, WING: 0 }

  for (let CORE = 0; CORE <= maxCORE; CORE++) {
    for (let POTION = 0; POTION <= maxPOTION; POTION++) {
      for (let WING = 0; WING <= maxWING; WING++) {
        // 필요 결정 (정확한 조합법)
        // CORE: 활기보존 + 파도침식 + 격류재생
        // POTION: 파도침식 + 격류재생 + 맹독혼란
        // WING: 방어오염 + 맹독혼란 + 활기보존
        const needCrystal = {
          vital: CORE + WING,        // 활기보존: CORE, WING
          erosion: CORE + POTION,    // 파도침식: CORE, POTION
          defense: WING,             // 방어오염: WING만
          regen: CORE + POTION,      // 격류재생: CORE, POTION
          poison: POTION + WING      // 맹독혼란: POTION, WING
        }
        const makeCrystal = {
          vital: Math.max(0, needCrystal.vital - totalCrystal.vital), erosion: Math.max(0, needCrystal.erosion - totalCrystal.erosion),
          defense: Math.max(0, needCrystal.defense - totalCrystal.defense), regen: Math.max(0, needCrystal.regen - totalCrystal.regen), poison: Math.max(0, needCrystal.poison - totalCrystal.poison)
        }
        // 결정 제작에 필요한 에센스
        // 활기보존: 수호+생명, 파도침식: 파동+부식, 방어오염: 혼란+수호, 격류재생: 생명+파동, 맹독혼란: 부식+혼란
        const needEss = {
          guard: makeCrystal.vital + makeCrystal.defense,  // 활기보존 + 방어오염
          wave: makeCrystal.erosion + makeCrystal.regen,   // 파도침식 + 격류재생
          chaos: makeCrystal.defense + makeCrystal.poison, // 방어오염 + 맹독혼란
          life: makeCrystal.vital + makeCrystal.regen,     // 활기보존 + 격류재생
          decay: makeCrystal.erosion + makeCrystal.poison  // 파도침식 + 맹독혼란
        }
        const makeEss = {
          guard: Math.max(0, needEss.guard - totalEss.guard), wave: Math.max(0, needEss.wave - totalEss.wave),
          chaos: Math.max(0, needEss.chaos - totalEss.chaos), life: Math.max(0, needEss.life - totalEss.life), decay: Math.max(0, needEss.decay - totalEss.decay)
        }
        if (makeEss.guard > essFromShellfish.guard || makeEss.wave > essFromShellfish.wave ||
            makeEss.chaos > essFromShellfish.chaos || makeEss.life > essFromShellfish.life || makeEss.decay > essFromShellfish.decay) continue

        const gold = CORE * GOLD_PRICES['2star'].CORE + POTION * GOLD_PRICES['2star'].POTION + WING * GOLD_PRICES['2star'].WING
        if (gold > best.gold) best = { gold, CORE, POTION, WING }
      }
    }
  }

  if (best.gold < 0) return null

  // 필요 결정 (정확한 조합법)
  const crystalNeed = {
    vital: best.CORE + best.WING,        // 활기보존: CORE, WING
    erosion: best.CORE + best.POTION,    // 파도침식: CORE, POTION
    defense: best.WING,                  // 방어오염: WING만
    regen: best.CORE + best.POTION,      // 격류재생: CORE, POTION
    poison: best.POTION + best.WING      // 맹독혼란: POTION, WING
  }
  const crystalToMake = {
    vital: Math.max(0, crystalNeed.vital - totalCrystal.vital), erosion: Math.max(0, crystalNeed.erosion - totalCrystal.erosion),
    defense: Math.max(0, crystalNeed.defense - totalCrystal.defense), regen: Math.max(0, crystalNeed.regen - totalCrystal.regen), poison: Math.max(0, crystalNeed.poison - totalCrystal.poison)
  }
  // 결정 제작에 필요한 에센스
  const essNeedForCrystal = {
    guard: crystalToMake.vital + crystalToMake.defense,  // 활기보존 + 방어오염
    wave: crystalToMake.erosion + crystalToMake.regen,   // 파도침식 + 격류재생
    chaos: crystalToMake.defense + crystalToMake.poison, // 방어오염 + 맹독혼란
    life: crystalToMake.vital + crystalToMake.regen,     // 활기보존 + 격류재생
    decay: crystalToMake.erosion + crystalToMake.poison  // 파도침식 + 맹독혼란
  }
  const essToMake = {
    guard: Math.max(0, essNeedForCrystal.guard - totalEss.guard), wave: Math.max(0, essNeedForCrystal.wave - totalEss.wave),
    chaos: Math.max(0, essNeedForCrystal.chaos - totalEss.chaos), life: Math.max(0, essNeedForCrystal.life - totalEss.life), decay: Math.max(0, essNeedForCrystal.decay - totalEss.decay)
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

  // 전체 필요 에센스 (세트 모드용)
  const essNeedTotal = {
    guard: crystalNeed.vital + crystalNeed.defense,  // 활기보존 + 방어오염
    wave: crystalNeed.erosion + crystalNeed.regen,   // 파도침식 + 격류재생
    chaos: crystalNeed.defense + crystalNeed.poison, // 방어오염 + 맹독혼란
    life: crystalNeed.vital + crystalNeed.regen,     // 활기보존 + 격류재생
    decay: crystalNeed.erosion + crystalNeed.poison  // 파도침식 + 맹독혼란
  }
  const totalCrystalNeed = crystalNeed.vital + crystalNeed.erosion + crystalNeed.defense + crystalNeed.regen + crystalNeed.poison
  const totalEssNeed = essNeedTotal.guard + essNeedTotal.wave + essNeedTotal.chaos + essNeedTotal.life + essNeedTotal.decay

  const materialNeedTotal = {
    seaweed: Math.ceil(totalEssNeed / 2) * 4,
    oakLeaves: Math.ceil(essNeedTotal.guard / 2) * 6, spruceLeaves: Math.ceil(essNeedTotal.wave / 2) * 6,
    birchLeaves: Math.ceil(essNeedTotal.chaos / 2) * 6, acaciaLeaves: Math.ceil(essNeedTotal.life / 2) * 6, cherryLeaves: Math.ceil(essNeedTotal.decay / 2) * 6,
    kelp: totalCrystalNeed * 4, lapisBlock: crystalNeed.vital, redstoneBlock: crystalNeed.erosion,
    ironIngot: crystalNeed.defense * 3, goldIngot: crystalNeed.regen * 2, diamond: crystalNeed.poison
  }

  return { best, crystalNeed, crystalToMake, essNeedTotal, essToMake, materialNeed, materialNeedTotal }
}

// ========================
// 3성 계산기
// ========================
export interface Input3Star {
  guard: number; wave: number; chaos: number; life: number; decay: number
  elixGuard?: number; elixWave?: number; elixChaos?: number; elixLife?: number; elixDecay?: number
  potionImmortal?: number; potionBarrier?: number; potionCorrupt?: number; potionFrenzy?: number; potionVenom?: number
}

export interface Result3Star {
  best: { gold: number; AQUA: number; NAUTILUS: number; SPINE: number }
  potionNeed: Record<string, number>; potionToMake: Record<string, number>
  elixNeedTotal: Record<string, number>; elixToMake: Record<string, number>
  materialNeed: Record<string, number>; materialNeedTotal: Record<string, number>
  deadCoralNeed: Record<string, number>; deadCoralNeedTotal: Record<string, number>
}

export function calculate3Star(input: Input3Star, isAdvanced: boolean): Result3Star | null {
  const totalFish = { guard: input.guard, wave: input.wave, chaos: input.chaos, life: input.life, decay: input.decay }

  const totalElix = {
    guard: input.elixGuard || 0, wave: input.elixWave || 0, chaos: input.elixChaos || 0,
    life: input.elixLife || 0, decay: input.elixDecay || 0
  }

  const totalPotion = isAdvanced ? {
    immortal: input.potionImmortal || 0, barrier: input.potionBarrier || 0, corrupt: input.potionCorrupt || 0, frenzy: input.potionFrenzy || 0, venom: input.potionVenom || 0
  } : { immortal: 0, barrier: 0, corrupt: 0, frenzy: 0, venom: 0 }

  const maxImmortal = totalPotion.immortal + Math.floor((totalFish.guard + totalElix.guard + totalFish.life + totalElix.life) / 2)
  const maxBarrier = totalPotion.barrier + Math.floor((totalFish.guard + totalElix.guard + totalFish.wave + totalElix.wave) / 2)
  const maxCorrupt = totalPotion.corrupt + Math.floor((totalFish.chaos + totalElix.chaos + totalFish.decay + totalElix.decay) / 2)
  const maxFrenzy = totalPotion.frenzy + Math.floor((totalFish.chaos + totalElix.chaos + totalFish.life + totalElix.life) / 2)
  const maxVenom = totalPotion.venom + Math.floor((totalFish.wave + totalElix.wave + totalFish.decay + totalElix.decay) / 2)

  const maxAqua = Math.min(maxImmortal, maxBarrier, maxVenom)
  const maxNautilus = Math.min(maxImmortal, maxBarrier, maxFrenzy)
  const maxSpine = Math.min(maxCorrupt, maxFrenzy, maxVenom)

  let best = { gold: -1, AQUA: 0, NAUTILUS: 0, SPINE: 0 }

  for (let AQUA = 0; AQUA <= maxAqua; AQUA++) {
    for (let NAUTILUS = 0; NAUTILUS <= maxNautilus; NAUTILUS++) {
      for (let SPINE = 0; SPINE <= maxSpine; SPINE++) {
        const needPotion = { immortal: AQUA + NAUTILUS, barrier: AQUA + NAUTILUS, corrupt: SPINE, frenzy: NAUTILUS + SPINE, venom: AQUA + SPINE }
        const makePotion = {
          immortal: Math.max(0, needPotion.immortal - totalPotion.immortal), barrier: Math.max(0, needPotion.barrier - totalPotion.barrier),
          corrupt: Math.max(0, needPotion.corrupt - totalPotion.corrupt), frenzy: Math.max(0, needPotion.frenzy - totalPotion.frenzy), venom: Math.max(0, needPotion.venom - totalPotion.venom)
        }
        const needElix = {
          guard: makePotion.immortal + makePotion.barrier, wave: makePotion.barrier + makePotion.venom,
          chaos: makePotion.corrupt + makePotion.frenzy, life: makePotion.immortal + makePotion.frenzy, decay: makePotion.corrupt + makePotion.venom
        }
        const makeFish = {
          guard: Math.max(0, needElix.guard - totalElix.guard), wave: Math.max(0, needElix.wave - totalElix.wave),
          chaos: Math.max(0, needElix.chaos - totalElix.chaos), life: Math.max(0, needElix.life - totalElix.life), decay: Math.max(0, needElix.decay - totalElix.decay)
        }
        if (makeFish.guard > totalFish.guard || makeFish.wave > totalFish.wave ||
            makeFish.chaos > totalFish.chaos || makeFish.life > totalFish.life || makeFish.decay > totalFish.decay) continue

        const gold = AQUA * GOLD_PRICES['3star'].AQUA + NAUTILUS * GOLD_PRICES['3star'].NAUTILUS + SPINE * GOLD_PRICES['3star'].SPINE
        if (gold > best.gold) best = { gold, AQUA, NAUTILUS, SPINE }
      }
    }
  }

  if (best.gold < 0) return null

  const potionNeed = { immortal: best.AQUA + best.NAUTILUS, barrier: best.AQUA + best.NAUTILUS, corrupt: best.SPINE, frenzy: best.NAUTILUS + best.SPINE, venom: best.AQUA + best.SPINE }
  const potionToMake = {
    immortal: Math.max(0, potionNeed.immortal - totalPotion.immortal), barrier: Math.max(0, potionNeed.barrier - totalPotion.barrier),
    corrupt: Math.max(0, potionNeed.corrupt - totalPotion.corrupt), frenzy: Math.max(0, potionNeed.frenzy - totalPotion.frenzy), venom: Math.max(0, potionNeed.venom - totalPotion.venom)
  }
  const elixNeedForPotion = {
    guard: potionToMake.immortal + potionToMake.barrier, wave: potionToMake.barrier + potionToMake.venom,
    chaos: potionToMake.corrupt + potionToMake.frenzy, life: potionToMake.immortal + potionToMake.frenzy, decay: potionToMake.corrupt + potionToMake.venom
  }
  const elixToMake = {
    guard: Math.max(0, elixNeedForPotion.guard - totalElix.guard), wave: Math.max(0, elixNeedForPotion.wave - totalElix.wave),
    chaos: Math.max(0, elixNeedForPotion.chaos - totalElix.chaos), life: Math.max(0, elixNeedForPotion.life - totalElix.life), decay: Math.max(0, elixNeedForPotion.decay - totalElix.decay)
  }
  const totalElixToMake = elixToMake.guard + elixToMake.wave + elixToMake.chaos + elixToMake.life + elixToMake.decay
  const totalPotionToMake = potionToMake.immortal + potionToMake.barrier + potionToMake.corrupt + potionToMake.frenzy + potionToMake.venom

  const materialNeed = {
    seaSquirt: totalElixToMake * 2, glassBottle: totalElixToMake * 3,
    netherrack: elixToMake.guard * 8, magmaBlock: elixToMake.wave * 4, soulSoil: elixToMake.chaos * 4, crimsonStem: elixToMake.life * 4, warpedStem: elixToMake.decay * 4,
    driedKelp: totalPotionToMake * 6, glowBerry: totalPotionToMake * 4
  }
  const deadCoralNeed = { deadTubeCoral: potionToMake.immortal * 2, deadBrainCoral: potionToMake.barrier * 2, deadBubbleCoral: potionToMake.corrupt * 2, deadFireCoral: potionToMake.frenzy * 2, deadHornCoral: potionToMake.venom * 2 }

  const elixNeedTotal = {
    guard: potionNeed.immortal + potionNeed.barrier, wave: potionNeed.barrier + potionNeed.venom,
    chaos: potionNeed.corrupt + potionNeed.frenzy, life: potionNeed.immortal + potionNeed.frenzy, decay: potionNeed.corrupt + potionNeed.venom
  }
  const totalElixNeed = elixNeedTotal.guard + elixNeedTotal.wave + elixNeedTotal.chaos + elixNeedTotal.life + elixNeedTotal.decay
  const totalPotionNeed = potionNeed.immortal + potionNeed.barrier + potionNeed.corrupt + potionNeed.frenzy + potionNeed.venom

  const materialNeedTotal = {
    seaSquirt: totalElixNeed * 2, glassBottle: totalElixNeed * 3,
    netherrack: elixNeedTotal.guard * 8, magmaBlock: elixNeedTotal.wave * 4, soulSoil: elixNeedTotal.chaos * 4, crimsonStem: elixNeedTotal.life * 4, warpedStem: elixNeedTotal.decay * 4,
    driedKelp: totalPotionNeed * 6, glowBerry: totalPotionNeed * 4
  }
  const deadCoralNeedTotal = { deadTubeCoral: potionNeed.immortal * 2, deadBrainCoral: potionNeed.barrier * 2, deadBubbleCoral: potionNeed.corrupt * 2, deadFireCoral: potionNeed.frenzy * 2, deadHornCoral: potionNeed.venom * 2 }

  return { best, potionNeed, potionToMake, elixNeedTotal, elixToMake, materialNeed, materialNeedTotal, deadCoralNeed, deadCoralNeedTotal }
}

// ========================
// 통합 계산기 (희석액 + 1/2/3성 최적화)
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

export function calculateAll(input: InputAll): ResultAll {
  // 희석액이 사용하는 어패류:
  // 성게★ 4개 (star1.decay), 굴★ 4개 (star1.guard)
  // 굴★★ 2개 (star2.guard), 문어★★ 2개 (star2.chaos)
  // 문어★★★ 1개 (star3.chaos), 성게★★★ 1개 (star3.decay)
  
  const maxDilution = Math.min(
    Math.floor(input.star1.decay / DILUTION_COST.decay1),
    Math.floor(input.star1.guard / DILUTION_COST.guard1),
    Math.floor(input.star2.guard / DILUTION_COST.guard2),
    Math.floor(input.star2.chaos / DILUTION_COST.chaos2),
    Math.floor(input.star3.chaos / DILUTION_COST.chaos3),
    Math.floor(input.star3.decay / DILUTION_COST.decay3)
  )
  
  let best: ResultAll = {
    totalGold: 0, dilution: 0, result1: null, result2: null, result3: null,
    summary: { dilutionGold: 0, star1Gold: 0, star2Gold: 0, star3Gold: 0 }
  }
  
  // 희석액 0개부터 최대까지 모든 경우 시뮬레이션
  for (let d = 0; d <= maxDilution; d++) {
    // 희석액 제작 후 남은 어패류
    const remaining1 = {
      guard: input.star1.guard - d * DILUTION_COST.guard1,
      wave: input.star1.wave,
      chaos: input.star1.chaos,
      life: input.star1.life,
      decay: input.star1.decay - d * DILUTION_COST.decay1
    }
    const remaining2 = {
      guard: input.star2.guard - d * DILUTION_COST.guard2,
      wave: input.star2.wave,
      chaos: input.star2.chaos - d * DILUTION_COST.chaos2,
      life: input.star2.life,
      decay: input.star2.decay
    }
    const remaining3 = {
      guard: input.star3.guard,
      wave: input.star3.wave,
      chaos: input.star3.chaos - d * DILUTION_COST.chaos3,
      life: input.star3.life,
      decay: input.star3.decay - d * DILUTION_COST.decay3
    }
    
    if (remaining1.guard < 0 || remaining1.decay < 0 || 
        remaining2.guard < 0 || remaining2.chaos < 0 || 
        remaining3.chaos < 0 || remaining3.decay < 0) continue
    
    const r1 = calculate1Star({ 
      guard: remaining1.guard, wave: remaining1.wave, 
      chaos: remaining1.chaos, life: remaining1.life, decay: remaining1.decay 
    }, false)
    
    const r2 = calculate2Star({ 
      guard2: remaining2.guard, wave2: remaining2.wave, 
      chaos2: remaining2.chaos, life2: remaining2.life, decay2: remaining2.decay 
    }, false)
    
    const r3 = calculate3Star({ 
      guard: remaining3.guard, wave: remaining3.wave, 
      chaos: remaining3.chaos, life: remaining3.life, decay: remaining3.decay 
    }, false)
    
    const dilutionGold = d * GOLD_PRICES['0star'].DILUTION
    const star1Gold = r1?.best.gold || 0
    const star2Gold = r2?.best.gold || 0
    const star3Gold = r3?.best.gold || 0
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