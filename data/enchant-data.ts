// 강화 단계별 데이터
export interface EnchantLevel {
  level: number;
  lowStone: number;
  midStone: number;
  highStone: number;
  gold: number;
  ruby: number;
  chance: number;
}

export const ENCHANT_DATA: EnchantLevel[] = [
  { level: 1, lowStone: 1, midStone: 0, highStone: 0, gold: 5000, ruby: 0, chance: 100 },
  { level: 2, lowStone: 2, midStone: 0, highStone: 0, gold: 25000, ruby: 0, chance: 100 },
  { level: 3, lowStone: 2, midStone: 0, highStone: 0, gold: 50000, ruby: 0, chance: 80 },
  { level: 4, lowStone: 3, midStone: 1, highStone: 0, gold: 100000, ruby: 0, chance: 80 },
  { level: 5, lowStone: 3, midStone: 1, highStone: 0, gold: 130000, ruby: 0, chance: 70 },
  { level: 6, lowStone: 4, midStone: 2, highStone: 1, gold: 150000, ruby: 0, chance: 50 },
  { level: 7, lowStone: 4, midStone: 2, highStone: 1, gold: 170000, ruby: 5, chance: 40 },
  { level: 8, lowStone: 6, midStone: 3, highStone: 2, gold: 300000, ruby: 5, chance: 30 },
  { level: 9, lowStone: 6, midStone: 3, highStone: 2, gold: 350000, ruby: 5, chance: 20 },
  { level: 10, lowStone: 8, midStone: 4, highStone: 3, gold: 500000, ruby: 10, chance: 10 },
  { level: 11, lowStone: 8, midStone: 4, highStone: 3, gold: 700000, ruby: 10, chance: 5 },
  { level: 12, lowStone: 8, midStone: 4, highStone: 3, gold: 1000000, ruby: 10, chance: 3 },
  { level: 13, lowStone: 10, midStone: 6, highStone: 4, gold: 1300000, ruby: 30, chance: 2 },
  { level: 14, lowStone: 10, midStone: 6, highStone: 4, gold: 1500000, ruby: 30, chance: 1 },
  { level: 15, lowStone: 10, midStone: 6, highStone: 5, gold: 2000000, ruby: 30, chance: 1 },
];

// 기본 라이프스톤 시세
export const DEFAULT_PRICES = {
  lowStone: 10121,
  midStone: 35652,
  highStone: 579982,
};
