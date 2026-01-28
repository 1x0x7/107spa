// ocean-worker.js - 해양 골드 계산기 Web Worker
// public 폴더에 저장

const GOLD_PRICES = {
  '0star': { DILUTION: 18444 },
  '1star': { A: 5159, K: 5234, L: 5393 },
  '2star': { CORE: 11131, POTION: 11242, WING: 11399 },
  '3star': { AQUA: 18985, NAUTILUS: 19207, SPINE: 19328 }
}

const DILUTION_INTERMEDIATE = {
  coreED: 3,
  crystalDefense: 2,
  potionCorrupt: 1
}

function floorToTwo(n) {
  return Math.floor(n / 2) * 2
}

// ========================
// 1성 계산기
// ========================
function calculate1Star(input, isAdvanced, reservedCoreED = 0) {
  const shellfish = { guard: input.guard, wave: input.wave, chaos: input.chaos, life: input.life, decay: input.decay }
  const ownedEss = {
    guard: input.essGuard || 0, wave: input.essWave || 0, chaos: input.essChaos || 0,
    life: input.essLife || 0, decay: input.essDecay || 0
  }
  const ownedCore = isAdvanced ? {
    WG: input.coreWG || 0, WP: input.coreWP || 0, OD: input.coreOD || 0, VD: input.coreVD || 0, ED: input.coreED || 0
  } : { WG: 0, WP: 0, OD: 0, VD: 0, ED: 0 }

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

  let best = { gold: -1, A: 0, K: 0, L: 0 }
  // 보유 핵도 고려하여 maxProduct 계산
  const totalOwnedCore = ownedCore.WG + ownedCore.WP + ownedCore.OD + ownedCore.VD + ownedCore.ED
  const minEss = Math.min(totalEss.guard, totalEss.wave, totalEss.chaos, totalEss.life, totalEss.decay)
  const totalEssSum = totalEss.guard + totalEss.wave + totalEss.chaos + totalEss.life + totalEss.decay
  // 보유 핵의 최대값 기준으로도 계산 (핵이 많으면 그만큼 제품 가능)
  const maxOwnedCore = Math.max(ownedCore.WG, ownedCore.WP, ownedCore.OD, ownedCore.VD, ownedCore.ED)
  const maxProduct = Math.min(2000, Math.max(100, minEss, maxOwnedCore, Math.ceil(totalOwnedCore / 3)))

  for (let A = 0; A <= maxProduct; A++) {
    for (let K = 0; K <= maxProduct; K++) {
      for (let L = 0; L <= maxProduct; L++) {
        if (A + K + L === 0 && reservedCoreED === 0) continue
        const needCore = { WG: A + L, WP: K + L, OD: A + K, VD: A + K, ED: L + reservedCoreED }
        const makeCore = {
          WG: Math.max(0, needCore.WG - ownedCore.WG),
          WP: Math.max(0, needCore.WP - ownedCore.WP),
          OD: Math.max(0, needCore.OD - ownedCore.OD),
          VD: Math.max(0, needCore.VD - ownedCore.VD),
          ED: Math.max(0, needCore.ED - ownedCore.ED)
        }
        const needEss = {
          guard: makeCore.WG + makeCore.ED, wave: makeCore.WG + makeCore.WP,
          chaos: makeCore.WP + makeCore.OD, life: makeCore.OD + makeCore.VD, decay: makeCore.VD + makeCore.ED
        }
        if (needEss.guard > totalEss.guard || needEss.wave > totalEss.wave ||
            needEss.chaos > totalEss.chaos || needEss.life > totalEss.life || 
            needEss.decay > totalEss.decay) continue
        const gold = A * GOLD_PRICES['1star'].A + K * GOLD_PRICES['1star'].K + L * GOLD_PRICES['1star'].L
        if (gold > best.gold) best = { gold, A, K, L }
      }
    }
  }

  if (best.gold < 0 && reservedCoreED === 0) return null

  // 제품용 재료 계산
  const coreNeedProduct = { WG: best.A + best.L, WP: best.K + best.L, OD: best.A + best.K, VD: best.A + best.K, ED: best.L }
  const coreToMakeProduct = {
    WG: Math.max(0, coreNeedProduct.WG - ownedCore.WG),
    WP: Math.max(0, coreNeedProduct.WP - ownedCore.WP),
    OD: Math.max(0, coreNeedProduct.OD - ownedCore.OD),
    VD: Math.max(0, coreNeedProduct.VD - ownedCore.VD),
    ED: Math.max(0, coreNeedProduct.ED - ownedCore.ED)
  }
  const essNeedRaw = {
    guard: coreToMakeProduct.WG + coreToMakeProduct.ED, wave: coreToMakeProduct.WG + coreToMakeProduct.WP,
    chaos: coreToMakeProduct.WP + coreToMakeProduct.OD, life: coreToMakeProduct.OD + coreToMakeProduct.VD,
    decay: coreToMakeProduct.VD + coreToMakeProduct.ED
  }
  const craftCountProduct = {
    guard: Math.ceil(Math.max(0, essNeedRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedRaw.decay - ownedEss.decay) / 2)
  }
  const essNeedProduct = {
    guard: craftCountProduct.guard * 2, wave: craftCountProduct.wave * 2,
    chaos: craftCountProduct.chaos * 2, life: craftCountProduct.life * 2, decay: craftCountProduct.decay * 2
  }
  const blockNeedProduct = {
    clay: craftCountProduct.guard * 2, sand: craftCountProduct.wave * 4, dirt: craftCountProduct.chaos * 8,
    gravel: craftCountProduct.life * 4, granite: craftCountProduct.decay * 2
  }
  const fishNeedProduct = {
    shrimp: coreToMakeProduct.WG, domi: coreToMakeProduct.WP, herring: coreToMakeProduct.OD,
    goldfish: coreToMakeProduct.VD, bass: coreToMakeProduct.ED
  }

  // 희석액용 재료 계산
  const remainingOwnedCoreED = Math.max(0, ownedCore.ED - coreNeedProduct.ED)
  const coreToMakeDilution = Math.max(0, reservedCoreED - remainingOwnedCoreED)
  const remainingOwnedEss = {
    guard: Math.max(0, ownedEss.guard - essNeedProduct.guard),
    decay: Math.max(0, ownedEss.decay - essNeedProduct.decay)
  }
  const essToMakeDilutionRaw = {
    guard: Math.max(0, coreToMakeDilution - remainingOwnedEss.guard),
    decay: Math.max(0, coreToMakeDilution - remainingOwnedEss.decay)
  }
  const craftCountDilution = {
    guard: Math.ceil(essToMakeDilutionRaw.guard / 2),
    decay: Math.ceil(essToMakeDilutionRaw.decay / 2)
  }
  const essNeedDilution = { guard: craftCountDilution.guard * 2, wave: 0, chaos: 0, life: 0, decay: craftCountDilution.decay * 2 }
  const blockNeedDilution = { clay: craftCountDilution.guard * 2, sand: 0, dirt: 0, gravel: 0, granite: craftCountDilution.decay * 2 }
  const fishNeedDilution = { shrimp: 0, domi: 0, herring: 0, goldfish: 0, bass: coreToMakeDilution }

  // 총합
  const coreNeed = { WG: coreNeedProduct.WG, WP: coreNeedProduct.WP, OD: coreNeedProduct.OD, VD: coreNeedProduct.VD, ED: coreNeedProduct.ED + reservedCoreED }
  const coreToMake = {
    WG: Math.max(0, coreNeed.WG - ownedCore.WG), WP: Math.max(0, coreNeed.WP - ownedCore.WP),
    OD: Math.max(0, coreNeed.OD - ownedCore.OD), VD: Math.max(0, coreNeed.VD - ownedCore.VD),
    ED: Math.max(0, coreNeed.ED - ownedCore.ED)
  }
  const essNeedTotalRaw = {
    guard: coreToMake.WG + coreToMake.ED, wave: coreToMake.WG + coreToMake.WP,
    chaos: coreToMake.WP + coreToMake.OD, life: coreToMake.OD + coreToMake.VD,
    decay: coreToMake.VD + coreToMake.ED
  }
  const craftCount = {
    guard: Math.ceil(Math.max(0, essNeedTotalRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedTotalRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedTotalRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedTotalRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedTotalRaw.decay - ownedEss.decay) / 2)
  }
  const essToMake = {
    guard: craftCount.guard * 2, wave: craftCount.wave * 2, chaos: craftCount.chaos * 2,
    life: craftCount.life * 2, decay: craftCount.decay * 2
  }
  const essNeedTotal = { ...essToMake }
  const blockNeed = {
    clay: craftCount.guard * 2, sand: craftCount.wave * 4, dirt: craftCount.chaos * 8,
    gravel: craftCount.life * 4, granite: craftCount.decay * 2
  }
  const fishNeed = { shrimp: coreToMake.WG, domi: coreToMake.WP, herring: coreToMake.OD, goldfish: coreToMake.VD, bass: coreToMake.ED }
  const totalCraftCount = {
    guard: Math.ceil(essNeedTotal.guard / 2), wave: Math.ceil(essNeedTotal.wave / 2),
    chaos: Math.ceil(essNeedTotal.chaos / 2), life: Math.ceil(essNeedTotal.life / 2), decay: Math.ceil(essNeedTotal.decay / 2)
  }
  const blockNeedTotal = {
    clay: totalCraftCount.guard * 2, sand: totalCraftCount.wave * 4, dirt: totalCraftCount.chaos * 8,
    gravel: totalCraftCount.life * 4, granite: totalCraftCount.decay * 2
  }
  const fishNeedTotal = { shrimp: coreNeed.WG, domi: coreNeed.WP, herring: coreNeed.OD, goldfish: coreNeed.VD, bass: coreNeed.ED }

  return { 
    best, coreNeedProduct, essNeedProduct, blockNeedProduct, fishNeedProduct,
    reservedCoreED, essNeedDilution, blockNeedDilution, fishNeedDilution,
    coreNeed, coreToMake, essNeedTotal, essToMake, blockNeed, blockNeedTotal, fishNeed, fishNeedTotal
  }
}

// ========================
// 2성 계산기
// ========================
function calculate2Star(input, isAdvanced, reservedCrystalDefense = 0) {
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
    guard: ownedEss.guard + essFromShellfish.guard, wave: ownedEss.wave + essFromShellfish.wave,
    chaos: ownedEss.chaos + essFromShellfish.chaos, life: ownedEss.life + essFromShellfish.life,
    decay: ownedEss.decay + essFromShellfish.decay
  }

  let best = { gold: -1, CORE: 0, POTION: 0, WING: 0 }
  // 보유 결정도 고려하여 maxProduct 계산
  const totalOwnedCrystal = ownedCrystal.vital + ownedCrystal.erosion + ownedCrystal.defense + ownedCrystal.regen + ownedCrystal.poison
  const minEss = Math.min(totalEss.guard, totalEss.wave, totalEss.chaos, totalEss.life, totalEss.decay)
  const totalEssSum = totalEss.guard + totalEss.wave + totalEss.chaos + totalEss.life + totalEss.decay
  const maxOwnedCrystal = Math.max(ownedCrystal.vital, ownedCrystal.erosion, ownedCrystal.defense, ownedCrystal.regen, ownedCrystal.poison)
  const maxProduct = Math.min(2000, Math.max(100, minEss, maxOwnedCrystal, Math.ceil(totalOwnedCrystal / 3)))

  for (let CORE = 0; CORE <= maxProduct; CORE++) {
    for (let POTION = 0; POTION <= maxProduct; POTION++) {
      for (let WING = 0; WING <= maxProduct; WING++) {
        if (CORE + POTION + WING === 0 && reservedCrystalDefense === 0) continue
        const needCrystal = {
          vital: CORE + WING, erosion: CORE + POTION, defense: WING + reservedCrystalDefense,
          regen: CORE + POTION, poison: POTION + WING
        }
        const makeCrystal = {
          vital: Math.max(0, needCrystal.vital - ownedCrystal.vital),
          erosion: Math.max(0, needCrystal.erosion - ownedCrystal.erosion),
          defense: Math.max(0, needCrystal.defense - ownedCrystal.defense),
          regen: Math.max(0, needCrystal.regen - ownedCrystal.regen),
          poison: Math.max(0, needCrystal.poison - ownedCrystal.poison)
        }
        const needEss = {
          guard: makeCrystal.vital + makeCrystal.defense, wave: makeCrystal.erosion + makeCrystal.regen,
          chaos: makeCrystal.defense + makeCrystal.poison, life: makeCrystal.vital + makeCrystal.regen,
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

  // 제품용 재료 계산
  const crystalNeedProduct = {
    vital: best.CORE + best.WING, erosion: best.CORE + best.POTION,
    defense: best.WING, regen: best.CORE + best.POTION, poison: best.POTION + best.WING
  }
  const crystalToMakeProduct = {
    vital: Math.max(0, crystalNeedProduct.vital - ownedCrystal.vital),
    erosion: Math.max(0, crystalNeedProduct.erosion - ownedCrystal.erosion),
    defense: Math.max(0, crystalNeedProduct.defense - ownedCrystal.defense),
    regen: Math.max(0, crystalNeedProduct.regen - ownedCrystal.regen),
    poison: Math.max(0, crystalNeedProduct.poison - ownedCrystal.poison)
  }
  const essNeedRaw = {
    guard: crystalToMakeProduct.vital + crystalToMakeProduct.defense,
    wave: crystalToMakeProduct.erosion + crystalToMakeProduct.regen,
    chaos: crystalToMakeProduct.defense + crystalToMakeProduct.poison,
    life: crystalToMakeProduct.vital + crystalToMakeProduct.regen,
    decay: crystalToMakeProduct.erosion + crystalToMakeProduct.poison
  }
  const craftCountProduct = {
    guard: Math.ceil(Math.max(0, essNeedRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedRaw.decay - ownedEss.decay) / 2)
  }
  const essNeedProduct = {
    guard: craftCountProduct.guard * 2, wave: craftCountProduct.wave * 2,
    chaos: craftCountProduct.chaos * 2, life: craftCountProduct.life * 2, decay: craftCountProduct.decay * 2
  }
  const essToMakeProduct = { ...essNeedProduct }
  const totalCrystalToMakeProduct = crystalToMakeProduct.vital + crystalToMakeProduct.erosion + crystalToMakeProduct.defense + crystalToMakeProduct.regen + crystalToMakeProduct.poison
  const totalEssToMakeProduct = essToMakeProduct.guard + essToMakeProduct.wave + essToMakeProduct.chaos + essToMakeProduct.life + essToMakeProduct.decay
  const materialNeedProduct = {
    seaweed: Math.ceil(totalEssToMakeProduct / 2) * 6,
    oakLeaves: craftCountProduct.guard * 6, spruceLeaves: craftCountProduct.wave * 6,
    birchLeaves: craftCountProduct.chaos * 6, acaciaLeaves: craftCountProduct.life * 6, cherryLeaves: craftCountProduct.decay * 6,
    kelp: totalCrystalToMakeProduct * 8, lapisBlock: crystalToMakeProduct.vital, redstoneBlock: crystalToMakeProduct.erosion,
    ironIngot: crystalToMakeProduct.defense * 3, goldIngot: crystalToMakeProduct.regen * 2, diamond: crystalToMakeProduct.poison
  }

  // 희석액용 재료 계산
  const remainingOwnedCrystalDefense = Math.max(0, ownedCrystal.defense - crystalNeedProduct.defense)
  const crystalToMakeDilution = Math.max(0, reservedCrystalDefense - remainingOwnedCrystalDefense)
  const remainingOwnedEss = {
    guard: Math.max(0, ownedEss.guard - essNeedProduct.guard),
    chaos: Math.max(0, ownedEss.chaos - essNeedProduct.chaos)
  }
  const essToMakeDilutionRaw = {
    guard: Math.max(0, crystalToMakeDilution - remainingOwnedEss.guard),
    chaos: Math.max(0, crystalToMakeDilution - remainingOwnedEss.chaos)
  }
  const craftCountDilution = {
    guard: Math.ceil(essToMakeDilutionRaw.guard / 2),
    chaos: Math.ceil(essToMakeDilutionRaw.chaos / 2)
  }
  const essNeedDilution = { guard: craftCountDilution.guard * 2, wave: 0, chaos: craftCountDilution.chaos * 2, life: 0, decay: 0 }
  const materialNeedDilution = {
    seaweed: Math.ceil((craftCountDilution.guard + craftCountDilution.chaos)) * 6,
    oakLeaves: craftCountDilution.guard * 6, spruceLeaves: 0, birchLeaves: craftCountDilution.chaos * 6,
    acaciaLeaves: 0, cherryLeaves: 0, kelp: crystalToMakeDilution * 8, lapisBlock: 0, redstoneBlock: 0,
    ironIngot: crystalToMakeDilution * 3, goldIngot: 0, diamond: 0
  }

  // 총합
  const crystalNeed = {
    vital: crystalNeedProduct.vital, erosion: crystalNeedProduct.erosion,
    defense: crystalNeedProduct.defense + reservedCrystalDefense, regen: crystalNeedProduct.regen, poison: crystalNeedProduct.poison
  }
  const crystalToMake = {
    vital: Math.max(0, crystalNeed.vital - ownedCrystal.vital),
    erosion: Math.max(0, crystalNeed.erosion - ownedCrystal.erosion),
    defense: Math.max(0, crystalNeed.defense - ownedCrystal.defense),
    regen: Math.max(0, crystalNeed.regen - ownedCrystal.regen),
    poison: Math.max(0, crystalNeed.poison - ownedCrystal.poison)
  }
  const essNeedTotalRaw = {
    guard: crystalToMake.vital + crystalToMake.defense, wave: crystalToMake.erosion + crystalToMake.regen,
    chaos: crystalToMake.defense + crystalToMake.poison, life: crystalToMake.vital + crystalToMake.regen,
    decay: crystalToMake.erosion + crystalToMake.poison
  }
  const craftCountTotal = {
    guard: Math.ceil(Math.max(0, essNeedTotalRaw.guard - ownedEss.guard) / 2),
    wave: Math.ceil(Math.max(0, essNeedTotalRaw.wave - ownedEss.wave) / 2),
    chaos: Math.ceil(Math.max(0, essNeedTotalRaw.chaos - ownedEss.chaos) / 2),
    life: Math.ceil(Math.max(0, essNeedTotalRaw.life - ownedEss.life) / 2),
    decay: Math.ceil(Math.max(0, essNeedTotalRaw.decay - ownedEss.decay) / 2)
  }
  const essToMake = {
    guard: craftCountTotal.guard * 2, wave: craftCountTotal.wave * 2,
    chaos: craftCountTotal.chaos * 2, life: craftCountTotal.life * 2, decay: craftCountTotal.decay * 2
  }
  const essNeedTotal = { ...essToMake }
  const totalCrystalToMake = crystalToMake.vital + crystalToMake.erosion + crystalToMake.defense + crystalToMake.regen + crystalToMake.poison
  const totalEssToMake = essToMake.guard + essToMake.wave + essToMake.chaos + essToMake.life + essToMake.decay
  const materialNeed = {
    seaweed: Math.ceil(totalEssToMake / 2) * 6,
    oakLeaves: craftCountTotal.guard * 6, spruceLeaves: craftCountTotal.wave * 6,
    birchLeaves: craftCountTotal.chaos * 6, acaciaLeaves: craftCountTotal.life * 6, cherryLeaves: craftCountTotal.decay * 6,
    kelp: totalCrystalToMake * 8, lapisBlock: crystalToMake.vital, redstoneBlock: crystalToMake.erosion,
    ironIngot: crystalToMake.defense * 3, goldIngot: crystalToMake.regen * 2, diamond: crystalToMake.poison
  }
  const materialNeedTotal = { ...materialNeed }

  return {
    best, crystalNeedProduct, essNeedProduct, materialNeedProduct,
    reservedCrystalDefense, essNeedDilution, materialNeedDilution,
    crystalNeed, crystalToMake, essNeedTotal, essToMake, materialNeed, materialNeedTotal
  }
}

// ========================
// 3성 계산기
// ========================
function calculate3Star(input, isAdvanced, reservedPotionCorrupt = 0) {
  const shellfish = { guard: input.guard, wave: input.wave, chaos: input.chaos, life: input.life, decay: input.decay }
  const ownedElix = {
    guard: input.elixGuard || 0, wave: input.elixWave || 0, chaos: input.elixChaos || 0,
    life: input.elixLife || 0, decay: input.elixDecay || 0
  }
  const ownedPotion = isAdvanced ? {
    immortal: input.potionImmortal || 0, barrier: input.potionBarrier || 0,
    corrupt: input.potionCorrupt || 0, frenzy: input.potionFrenzy || 0, venom: input.potionVenom || 0
  } : { immortal: 0, barrier: 0, corrupt: 0, frenzy: 0, venom: 0 }

  const totalElix = {
    guard: ownedElix.guard + shellfish.guard, wave: ownedElix.wave + shellfish.wave,
    chaos: ownedElix.chaos + shellfish.chaos, life: ownedElix.life + shellfish.life, decay: ownedElix.decay + shellfish.decay
  }

  let best = { gold: -1, AQUA: 0, NAUTILUS: 0, SPINE: 0 }
  // 보유 영약도 고려하여 maxProduct 계산
  const totalOwnedPotion = ownedPotion.immortal + ownedPotion.barrier + ownedPotion.corrupt + ownedPotion.frenzy + ownedPotion.venom
  const minElix = Math.min(totalElix.guard, totalElix.wave, totalElix.chaos, totalElix.life, totalElix.decay)
  const totalElixSum = totalElix.guard + totalElix.wave + totalElix.chaos + totalElix.life + totalElix.decay
  const maxOwnedPotion = Math.max(ownedPotion.immortal, ownedPotion.barrier, ownedPotion.corrupt, ownedPotion.frenzy, ownedPotion.venom)
  const maxProduct = Math.min(2000, Math.max(100, minElix, maxOwnedPotion, Math.ceil(totalOwnedPotion / 3)))

  for (let AQUA = 0; AQUA <= maxProduct; AQUA++) {
    for (let NAUTILUS = 0; NAUTILUS <= maxProduct; NAUTILUS++) {
      for (let SPINE = 0; SPINE <= maxProduct; SPINE++) {
        if (AQUA + NAUTILUS + SPINE === 0 && reservedPotionCorrupt === 0) continue
        const needPotion = {
          immortal: AQUA + NAUTILUS, barrier: AQUA + NAUTILUS,
          corrupt: SPINE + reservedPotionCorrupt, frenzy: NAUTILUS + SPINE, venom: AQUA + SPINE
        }
        const makePotion = {
          immortal: Math.max(0, needPotion.immortal - ownedPotion.immortal),
          barrier: Math.max(0, needPotion.barrier - ownedPotion.barrier),
          corrupt: Math.max(0, needPotion.corrupt - ownedPotion.corrupt),
          frenzy: Math.max(0, needPotion.frenzy - ownedPotion.frenzy),
          venom: Math.max(0, needPotion.venom - ownedPotion.venom)
        }
        const needElix = {
          guard: makePotion.immortal + makePotion.barrier, wave: makePotion.barrier + makePotion.venom,
          chaos: makePotion.corrupt + makePotion.frenzy, life: makePotion.immortal + makePotion.frenzy,
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

  // 제품용 재료 계산
  const potionNeedProduct = {
    immortal: best.AQUA + best.NAUTILUS, barrier: best.AQUA + best.NAUTILUS,
    corrupt: best.SPINE, frenzy: best.NAUTILUS + best.SPINE, venom: best.AQUA + best.SPINE
  }
  const potionToMakeProduct = {
    immortal: Math.max(0, potionNeedProduct.immortal - ownedPotion.immortal),
    barrier: Math.max(0, potionNeedProduct.barrier - ownedPotion.barrier),
    corrupt: Math.max(0, potionNeedProduct.corrupt - ownedPotion.corrupt),
    frenzy: Math.max(0, potionNeedProduct.frenzy - ownedPotion.frenzy),
    venom: Math.max(0, potionNeedProduct.venom - ownedPotion.venom)
  }
  const elixNeedRaw = {
    guard: potionToMakeProduct.immortal + potionToMakeProduct.barrier,
    wave: potionToMakeProduct.barrier + potionToMakeProduct.venom,
    chaos: potionToMakeProduct.corrupt + potionToMakeProduct.frenzy,
    life: potionToMakeProduct.immortal + potionToMakeProduct.frenzy,
    decay: potionToMakeProduct.corrupt + potionToMakeProduct.venom
  }
  const elixToMakeProduct = {
    guard: Math.max(0, elixNeedRaw.guard - ownedElix.guard),
    wave: Math.max(0, elixNeedRaw.wave - ownedElix.wave),
    chaos: Math.max(0, elixNeedRaw.chaos - ownedElix.chaos),
    life: Math.max(0, elixNeedRaw.life - ownedElix.life),
    decay: Math.max(0, elixNeedRaw.decay - ownedElix.decay)
  }
  const elixNeedProduct = { ...elixNeedRaw }
  const totalPotionToMakeProduct = potionToMakeProduct.immortal + potionToMakeProduct.barrier + potionToMakeProduct.corrupt + potionToMakeProduct.frenzy + potionToMakeProduct.venom
  const totalElixToMakeProduct = elixToMakeProduct.guard + elixToMakeProduct.wave + elixToMakeProduct.chaos + elixToMakeProduct.life + elixToMakeProduct.decay
  const materialNeedProduct = {
    seaSquirt: totalElixToMakeProduct * 2, glassBottle: totalElixToMakeProduct * 3,
    driedKelp: totalPotionToMakeProduct * 12, glowBerry: totalPotionToMakeProduct * 4,
    netherrack: elixToMakeProduct.guard * 8, magmaBlock: elixToMakeProduct.wave * 4,
    soulSoil: elixToMakeProduct.chaos * 4, crimsonStem: elixToMakeProduct.life * 4, warpedStem: elixToMakeProduct.decay * 4
  }
  const deadCoralNeedProduct = {
    deadTubeCoral: potionToMakeProduct.immortal * 2, deadBrainCoral: potionToMakeProduct.barrier * 2,
    deadBubbleCoral: potionToMakeProduct.corrupt * 2, deadFireCoral: potionToMakeProduct.frenzy * 2, deadHornCoral: potionToMakeProduct.venom * 2
  }

  // 희석액용 재료 계산
  const remainingOwnedPotionCorrupt = Math.max(0, ownedPotion.corrupt - potionNeedProduct.corrupt)
  const potionToMakeDilution = Math.max(0, reservedPotionCorrupt - remainingOwnedPotionCorrupt)
  const remainingOwnedElix = {
    chaos: Math.max(0, ownedElix.chaos - elixNeedProduct.chaos),
    decay: Math.max(0, ownedElix.decay - elixNeedProduct.decay)
  }
  const elixToMakeDilutionRaw = {
    chaos: Math.max(0, potionToMakeDilution - remainingOwnedElix.chaos),
    decay: Math.max(0, potionToMakeDilution - remainingOwnedElix.decay)
  }
  const elixNeedDilution = { guard: 0, wave: 0, chaos: elixToMakeDilutionRaw.chaos, life: 0, decay: elixToMakeDilutionRaw.decay }
  const totalElixToMakeDilution = elixToMakeDilutionRaw.chaos + elixToMakeDilutionRaw.decay
  const materialNeedDilution = {
    seaSquirt: totalElixToMakeDilution * 2, glassBottle: totalElixToMakeDilution * 3,
    driedKelp: potionToMakeDilution * 12, glowBerry: potionToMakeDilution * 4,
    netherrack: 0, magmaBlock: 0,
    soulSoil: elixToMakeDilutionRaw.chaos * 4, crimsonStem: 0, warpedStem: elixToMakeDilutionRaw.decay * 4
  }
  const deadCoralNeedDilution = {
    deadTubeCoral: 0, deadBrainCoral: 0,
    deadBubbleCoral: potionToMakeDilution, deadFireCoral: 0, deadHornCoral: 0
  }

  // 총합
  const potionNeed = {
    immortal: potionNeedProduct.immortal, barrier: potionNeedProduct.barrier,
    corrupt: potionNeedProduct.corrupt + reservedPotionCorrupt, frenzy: potionNeedProduct.frenzy, venom: potionNeedProduct.venom
  }
  const potionToMake = {
    immortal: Math.max(0, potionNeed.immortal - ownedPotion.immortal),
    barrier: Math.max(0, potionNeed.barrier - ownedPotion.barrier),
    corrupt: Math.max(0, potionNeed.corrupt - ownedPotion.corrupt),
    frenzy: Math.max(0, potionNeed.frenzy - ownedPotion.frenzy),
    venom: Math.max(0, potionNeed.venom - ownedPotion.venom)
  }
  const elixNeedTotalRaw = {
    guard: potionToMake.immortal + potionToMake.barrier,
    wave: potionToMake.barrier + potionToMake.venom,
    chaos: potionToMake.corrupt + potionToMake.frenzy,
    life: potionToMake.immortal + potionToMake.frenzy,
    decay: potionToMake.corrupt + potionToMake.venom
  }
  const elixToMake = {
    guard: Math.max(0, elixNeedTotalRaw.guard - ownedElix.guard),
    wave: Math.max(0, elixNeedTotalRaw.wave - ownedElix.wave),
    chaos: Math.max(0, elixNeedTotalRaw.chaos - ownedElix.chaos),
    life: Math.max(0, elixNeedTotalRaw.life - ownedElix.life),
    decay: Math.max(0, elixNeedTotalRaw.decay - ownedElix.decay)
  }
  const elixNeedTotal = { ...elixNeedTotalRaw }
  const totalPotionToMake = potionToMake.immortal + potionToMake.barrier + potionToMake.corrupt + potionToMake.frenzy + potionToMake.venom
  const totalElixToMake = elixToMake.guard + elixToMake.wave + elixToMake.chaos + elixToMake.life + elixToMake.decay
  const materialNeed = {
    seaSquirt: totalElixToMake * 2, glassBottle: totalElixToMake * 3,
    driedKelp: totalPotionToMake * 12, glowBerry: totalPotionToMake * 4,
    netherrack: elixToMake.guard * 8, magmaBlock: elixToMake.wave * 2,
    soulSoil: elixToMake.chaos * 4, crimsonStem: elixToMake.life * 2, warpedStem: elixToMake.decay * 4
  }
  const deadCoralNeed = {
    deadTubeCoral: potionToMake.immortal * 2, deadBrainCoral: potionToMake.barrier * 2,
    deadBubbleCoral: potionToMake.corrupt * 2, deadFireCoral: potionToMake.frenzy * 2, deadHornCoral: potionToMake.venom * 2
  }
  const materialNeedTotal = { ...materialNeed }
  const deadCoralNeedTotal = { ...deadCoralNeed }

  return {
    best, potionNeedProduct, elixNeedProduct, materialNeedProduct, deadCoralNeedProduct,
    reservedPotionCorrupt, elixNeedDilution, materialNeedDilution, deadCoralNeedDilution,
    potionNeed, potionToMake, elixNeedTotal, elixToMake, materialNeed, materialNeedTotal,
    deadCoralNeed, deadCoralNeedTotal
  }
}

// ========================
// 통합 계산기
// ========================
function calculateAll(input, advanced1, advanced2, advanced3) {
  const hasInput1 = Object.values(input.star1).some(v => v > 0)
  const hasInput2 = Object.values(input.star2).some(v => v > 0)
  const hasInput3 = Object.values(input.star3).some(v => v > 0)
  const hasAdvanced1 = advanced1 && Object.values(advanced1).some(v => v > 0)
  const hasAdvanced2 = advanced2 && Object.values(advanced2).some(v => v > 0)
  const hasAdvanced3 = advanced3 && Object.values(advanced3).some(v => v > 0)
  
  // 어패류와 보유량 모두 없으면 빈 결과
  if (!hasInput1 && !hasInput2 && !hasInput3 && !hasAdvanced1 && !hasAdvanced2 && !hasAdvanced3) {
    return {
      totalGold: 0, dilution: 0, result1: null, result2: null, result3: null,
      summary: { dilutionGold: 0, star1Gold: 0, star2Gold: 0, star3Gold: 0 }
    }
  }

  const ess1Guard = floorToTwo(input.star1.guard) + (advanced1?.essGuard || 0)
  const ess1Decay = floorToTwo(input.star1.decay) + (advanced1?.essDecay || 0)
  const ownedCoreED = advanced1?.coreED || 0
  
  const ess2Guard = floorToTwo(input.star2.guard) + (advanced2?.essGuard || 0)
  const ess2Chaos = floorToTwo(input.star2.chaos) + (advanced2?.essChaos || 0)
  const ownedCrystalDefense = advanced2?.crystalDefense || 0
  
  const elix3Chaos = input.star3.chaos + (advanced3?.elixChaos || 0)
  const elix3Decay = input.star3.decay + (advanced3?.elixDecay || 0)
  const ownedPotionCorrupt = advanced3?.potionCorrupt || 0

  const maxCoreED = Math.floor(Math.min(ess1Guard, ess1Decay) / 2) + ownedCoreED
  const maxCrystalDefense = Math.floor(Math.min(ess2Guard, ess2Chaos) / 2) + ownedCrystalDefense
  const maxPotionCorrupt = Math.floor(Math.min(elix3Chaos, elix3Decay) / 2) + ownedPotionCorrupt

  const maxDilution = Math.min(
    Math.floor(maxCoreED / DILUTION_INTERMEDIATE.coreED),
    Math.floor(maxCrystalDefense / DILUTION_INTERMEDIATE.crystalDefense),
    Math.floor(maxPotionCorrupt / DILUTION_INTERMEDIATE.potionCorrupt)
  )

  let best = {
    totalGold: 0, dilution: 0, result1: null, result2: null, result3: null,
    summary: { dilutionGold: 0, star1Gold: 0, star2Gold: 0, star3Gold: 0 }
  }

  for (let d = 0; d <= maxDilution; d++) {
    const reservedCoreED = d * DILUTION_INTERMEDIATE.coreED
    const reservedCrystalDefense = d * DILUTION_INTERMEDIATE.crystalDefense
    const reservedPotionCorrupt = d * DILUTION_INTERMEDIATE.potionCorrupt

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

    if (!r1 || !r2 || !r3) continue

    const dilutionGold = d * GOLD_PRICES['0star'].DILUTION
    const star1Gold = Math.max(0, r1.best.gold)
    const star2Gold = Math.max(0, r2.best.gold)
    const star3Gold = Math.max(0, r3.best.gold)
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

// ========================
// Worker 메시지 핸들러
// ========================
self.onmessage = function(e) {
  const { type, payload } = e.data
  
  let result = null
  
  switch(type) {
    case 'calculate1Star':
      result = calculate1Star(payload.input, payload.isAdvanced, payload.reservedCoreED || 0)
      break
    case 'calculate2Star':
      result = calculate2Star(payload.input, payload.isAdvanced, payload.reservedCrystalDefense || 0)
      break
    case 'calculate3Star':
      result = calculate3Star(payload.input, payload.isAdvanced, payload.reservedPotionCorrupt || 0)
      break
    case 'calculateAll':
      result = calculateAll(payload.shellfish, payload.advanced1, payload.advanced2, payload.advanced3)
      break
  }
  
  self.postMessage({ type, result })
}