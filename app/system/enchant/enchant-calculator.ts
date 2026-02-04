import { EnchantLevel } from '../../../data/enchant-data';

export type TierType = 'lucky' | 'median' | 'expected' | 'unlucky';
 
// 기하분포 백분위수 계산
export const getPercentile = (p: number, percentile: number): number => {
  if (p >= 1) return 1;
  return Math.ceil(Math.log(1 - percentile) / Math.log(1 - p));
};

// 각 단계별 시도 횟수 계산
export const calculateTrials = (chance: number, tier: TierType): number => {
  const p = chance / 100;
  if (p >= 1) return 1;
  
  switch (tier) {
    case 'lucky': return getPercentile(p, 0.25);
    case 'median': return getPercentile(p, 0.5);
    case 'expected': return 1 / p;
    case 'unlucky': return getPercentile(p, 0.75);
    default: return 1 / p;
  }
};

// 연속 성공 확률 계산
export const calculateConsecutiveChance = (stages: EnchantLevel[]): number | null => {
  if (stages.length <= 1) return null;
  return stages.reduce((acc, stage) => acc * (stage.chance / 100), 1) * 100;
};

// 연속 성공 확률 포맷팅
export const formatChance = (chance: number | null): string | null => {
  if (chance === null) return null;
  if (chance >= 1) return chance.toFixed(2) + '%';
  if (chance >= 0.01) return chance.toFixed(2) + '%';
  if (chance >= 0.0001) return chance.toFixed(4) + '%';
  return '< 0.0001%';
};

export interface CalculationResult {
  totalTrials: number;
  totalLowStone: number;
  totalMidStone: number;
  totalHighStone: number;
  totalGold: number;
  totalRuby: number;
  stoneGoldCost: number;
  totalCost: number;
}

export interface Prices {
  lowStone: number;
  midStone: number;
  highStone: number;
}

// 전체 결과 계산
export const calculateEnchant = (
  stages: EnchantLevel[],
  tier: TierType,
  prices: Prices
): CalculationResult | null => {
  if (stages.length === 0) return null;

  let totalLowStone = 0, totalMidStone = 0, totalHighStone = 0;
  let totalGold = 0, totalRuby = 0, totalTrials = 0;

  stages.forEach(stage => {
    const trials = calculateTrials(stage.chance, tier);
    const roundedTrials = Math.round(trials);
    totalTrials += roundedTrials;
    totalLowStone += stage.lowStone * roundedTrials;
    totalMidStone += stage.midStone * roundedTrials;
    totalHighStone += stage.highStone * roundedTrials;
    totalGold += stage.gold * roundedTrials;
    totalRuby += stage.ruby * roundedTrials;
  });

  const stoneGoldCost = 
    totalLowStone * prices.lowStone +
    totalMidStone * prices.midStone +
    totalHighStone * prices.highStone;

  return {
    totalTrials,
    totalLowStone,
    totalMidStone,
    totalHighStone,
    totalGold,
    totalRuby,
    stoneGoldCost,
    totalCost: totalGold + stoneGoldCost,
  };
};
