import { ENGRAVING_DATA } from '@/data/engrave-data'

export type TierType = 'lucky' | 'median' | 'expected' | 'unlucky'

export interface EngravingStage {
  level: number
  contracts: number
  gold: number
  ruby: number
}

export interface EngravingPrices {
  prosperity: number
  crushing: number
  tide: number
  conquest: number
  rough: number
  neat: number
  precise: number
}

export interface EngravingResult {
  totalTrials: number
  totalContracts: number
  totalGold: number
  totalRuby: number
  totalStoneCost: number
  totalCost: number
}

/**
 * 기하분포의 평균 시도 횟수
 */
function expectedTrials(p: number): number {
  return 1 / p
}

/**
 * 기하분포의 중앙값 (첫 성공까지)
 */
function medianTrials(p: number): number {
  return Math.ceil(Math.log(0.5) / Math.log(1 - p))
}

/**
 * 기하분포의 k번째 백분위수
 */
function percentileTrials(p: number, percentile: number): number {
  return Math.ceil(Math.log(1 - percentile) / Math.log(1 - p))
}

/**
 * 단일 단계의 시도 횟수 계산
 */
function getTrialsForStage(probability: number, tier: TierType): number {
  const p = probability / 100

  switch (tier) {
    case 'lucky':
      return percentileTrials(p, 0.25) // 상위 25%
    case 'median':
      return medianTrials(p) // 중앙값
    case 'expected':
      return Math.ceil(expectedTrials(p)) // 평균
    case 'unlucky':
      return percentileTrials(p, 0.75) // 하위 25%
    default:
      return Math.ceil(expectedTrials(p))
  }
}



/**
 * 각인 계산
 */
export function calculateEngraving(
  stages: EngravingStage[],
  stoneType: 'rough' | 'neat' | 'precise',
  tier: TierType,
  prices: EngravingPrices,
  selectedContract: 'prosperity' | 'crushing' | 'tide' | 'conquest'
): EngravingResult {
  let totalTrials = 0
  let totalContracts = 0
  let totalGold = 0
  let totalRuby = 0

  // 각인석 확률 (rough: 5%, neat: 10%, precise: 15%)
  const stoneProbability = stoneType === 'rough' ? 5 : stoneType === 'neat' ? 10 : 15

  stages.forEach((stage) => {
    const trials = getTrialsForStage(stoneProbability, tier)
    const contracts = stage.contracts * trials
    const gold = stage.gold * trials
    const ruby = stage.ruby * trials

    totalTrials += trials
    totalContracts += contracts
    totalGold += gold
    totalRuby += ruby
  })

  // 각인석 비용 (시도 횟수만큼 소모)
  const stoneCost = prices[stoneType] * totalTrials
  
  // 계약서 비용
  const contractCost = prices[selectedContract] * totalContracts

  // 총 비용 = 강화 비용 + 각인석 비용 + 계약서 비용
  const totalCost = totalGold + stoneCost + contractCost

  return {
    totalTrials,
    totalContracts,
    totalGold,
    totalRuby,
    totalStoneCost: stoneCost,
    totalCost,
  }
}