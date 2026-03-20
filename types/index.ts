// =========================
// 통합 타입 정의
// =========================

// ===== 채광 (Mining) =====
export interface MiningSettings {
  pickaxeLevel: number
  cobi: number
  ingot: number
  gemStart: number
  gemShine: number
  lucky: number
  firePick: number
}

export type MiningSkillKey = Exclude<keyof MiningSettings, 'pickaxeLevel'>

// ===== 재배 (Farming) =====
export interface FarmingSettings {
  hoeLevel: number
  gift: number
  harvest: number
  pot: number
  money: number
  king: number
  seedBonus: number
  fire: number
}

export type FarmingSkillKey = Exclude<keyof FarmingSettings, 'hoeLevel'>

// ===== 해양 (Ocean) =====
export interface OceanSettings {
  rodLevel: number
  clamSell: number
  premiumPrice: number
  deepSea: number
  star: number
  clamRefill: number
}

export type OceanSkillKey = Exclude<keyof OceanSettings, 'rodLevel'>

// ===== 사냥 (Hunting) =====
export interface HuntingSettings {
  swordLevel: number
  allTheWay: number
  worthProof: number
  extraProcessing: number
  differentFromOthers: number
  mutantSpecies: number
}

export type HuntingSkillKey = Exclude<keyof HuntingSettings, 'swordLevel'>

// ===== 공통 =====
export interface ExpertSkill<T extends string = string> {
  key: T
  name: string
  max: number
  desc: readonly string[]
}

export interface Recipe {
  name: string
  ingredients: string
  img?: string
  price?: string
}

// ===== Context 타입 =====
export interface ExpertContextType {
  mining: MiningSettings
  farming: FarmingSettings
  ocean: OceanSettings
  hunting: HuntingSettings
  updateMining: (key: keyof MiningSettings, value: number) => void
  updateFarming: (key: keyof FarmingSettings, value: number) => void
  updateOcean: (key: keyof OceanSettings, value: number) => void
  updateHunting: (key: keyof HuntingSettings, value: number) => void
}

// ===== 강화 시스템 =====
export interface EnchantLevel {
  level: number
  gold: number
  lowStone: number
  midStone: number
  highStone: number
  ruby: number
  successRate: number
}

// ===== 업데이트 =====
export interface UpdateItem {
  date: string
  changes: string[]
}

// ===== 요리 레시피 =====
export interface CookingRecipe {
  name: string
  bases: { tomato: number; onion: number; garlic: number }
  minPrice: number
  maxPrice: number
  img: string
  ingredients: string
}

// ===== 해양 재료 툴팁 =====
export interface TooltipItem {
  name: string
  icon?: string
}

export interface IngredientTooltip {
  ingredients: TooltipItem[]
}
