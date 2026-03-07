// 효율 계산 유틸리티 (홈페이지 & 효율 페이지 공용)
import { 
  EFFICIENCY_RECIPES, 
  HOE_DROPS,
  CROP_DROP_RATE,
  KING_CROP_BASE_CHANCE,
  KING_CROP_MULTIPLIER,
  EXPERT_HARVEST_DATA,
  EXPERT_KING_DATA,
  EXPERT_MONEY_DATA,
} from '@/data/farming'
import { COOKING_PRICES } from '@/data/updates'

export interface EfficiencyResult {
  name: string
  price: number
  efficiency: number
  pricePercent: number
  img: string
}

// 기본 스펙으로 효율 Top 3 계산
export function getTopEfficiency(
  prices: Record<string, number> = COOKING_PRICES,
  hoeLevel = 0,
  harvestLevel = 0,
  kingLevel = 0,
  moneyLevel = 0
): { rank: number; name: string; price: number; percent: number; img: string }[] {
  
  const hoeDrop = HOE_DROPS[hoeLevel] || 1
  const kingData = EXPERT_KING_DATA[Math.min(kingLevel, EXPERT_KING_DATA.length - 1)]
  const kingBonus = KING_CROP_BASE_CHANCE + kingData.bonus
  const kingMult = 1 + (kingBonus * (KING_CROP_MULTIPLIER - 1))
  const harvestData = EXPERT_HARVEST_DATA[Math.min(harvestLevel, EXPERT_HARVEST_DATA.length - 1)]
  const harvestBonus = harvestData.rate * harvestData.count
  const moneyData = EXPERT_MONEY_DATA[Math.min(moneyLevel, EXPERT_MONEY_DATA.length - 1)]
  const moneyBonus = moneyData.bonus

  const results = EFFICIENCY_RECIPES.map(recipe => {
    let totalSeeds = 0

    ;(['tomato', 'onion', 'garlic'] as const).forEach(crop => {
      const baseNeeded = recipe.bases[crop] || 0
      if (baseNeeded > 0) {
        const effectiveRate = CROP_DROP_RATE[crop] * kingMult + harvestBonus
        const seeds = (baseNeeded * 8) / effectiveRate
        totalSeeds += seeds
      }
    })

    const gatherCount = totalSeeds / hoeDrop
    const staminaPerOne = gatherCount * 7
    const currentPrice = prices[recipe.name] || Math.floor((recipe.minPrice + recipe.maxPrice) / 2)
    const sellPrice = currentPrice * (1 + moneyBonus)
    const efficiency = staminaPerOne > 0 ? sellPrice / staminaPerOne : 0
    const pricePercent = Math.floor((currentPrice / recipe.maxPrice) * 100)

    return {
      name: recipe.name,
      price: currentPrice,
      efficiency,
      pricePercent,
      img: `/img/farming/${recipe.img}`
    }
  })

  // 효율 높은 순으로 정렬
  results.sort((a, b) => b.efficiency - a.efficiency)

  // Top 3 반환
  return results.slice(0, 3).map((item, idx) => ({
    rank: idx + 1,
    name: item.name,
    price: item.price,
    percent: item.pricePercent,
    img: item.img
  }))
}
