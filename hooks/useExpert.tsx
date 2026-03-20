'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react'
import type {
  MiningSettings,
  FarmingSettings,
  OceanSettings,
  HuntingSettings,
  ExpertContextType
} from '@/types'

// ===== 기본값 =====
const defaultMining: MiningSettings = {
  pickaxeLevel: 1,
  cobi: 0,
  ingot: 0,
  gemStart: 0,
  gemShine: 0,
  lucky: 0,
  firePick: 0
}

const defaultFarming: FarmingSettings = {
  hoeLevel: 1,
  gift: 0,
  harvest: 0,
  pot: 0,
  money: 0,
  king: 0,
  seedBonus: 0,
  fire: 0
}

const defaultOcean: OceanSettings = {
  rodLevel: 1,
  clamSell: 0,
  premiumPrice: 0,
  deepSea: 0,
  star: 0,
  clamRefill: 0
}

const defaultHunting: HuntingSettings = {
  swordLevel: 1,
  allTheWay: 0,
  worthProof: 0,
  extraProcessing: 0,
  differentFromOthers: 0,
  mutantSpecies: 0
}

// ===== Context =====
const ExpertContext = createContext<ExpertContextType | null>(null)

// ===== localStorage 유틸리티 =====
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const saved = localStorage.getItem(key)
    return saved ? { ...defaultValue, ...JSON.parse(saved) } : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장 실패 시 무시
  }
}

// ===== Provider =====
export function ExpertProvider({ children }: { children: ReactNode }) {
  const [mining, setMining] = useState<MiningSettings>(defaultMining)
  const [farming, setFarming] = useState<FarmingSettings>(defaultFarming)
  const [ocean, setOcean] = useState<OceanSettings>(defaultOcean)
  const [hunting, setHunting] = useState<HuntingSettings>(defaultHunting)

  // 클라이언트에서 한 번만 localStorage 로드
  useEffect(() => {
    setMining(loadFromStorage('miningExpert', defaultMining))
    setFarming(loadFromStorage('farmingExpert', defaultFarming))
    setOcean(loadFromStorage('oceanExpert', defaultOcean))
    setHunting(loadFromStorage('huntingExpert', defaultHunting))
  }, [])

  const updateMining = useCallback((key: keyof MiningSettings, value: number) => {
    setMining(prev => {
      const next = { ...prev, [key]: value }
      saveToStorage('miningExpert', next)
      return next
    })
  }, [])

  const updateFarming = useCallback((key: keyof FarmingSettings, value: number) => {
    setFarming(prev => {
      const next = { ...prev, [key]: value }
      saveToStorage('farmingExpert', next)
      return next
    })
  }, [])

  const updateOcean = useCallback((key: keyof OceanSettings, value: number) => {
    setOcean(prev => {
      const next = { ...prev, [key]: value }
      saveToStorage('oceanExpert', next)
      return next
    })
  }, [])

  const updateHunting = useCallback((key: keyof HuntingSettings, value: number) => {
    setHunting(prev => {
      const next = { ...prev, [key]: value }
      saveToStorage('huntingExpert', next)
      return next
    })
  }, [])

  const value = useMemo(() => ({
    mining,
    farming,
    ocean,
    hunting,
    updateMining,
    updateFarming,
    updateOcean,
    updateHunting
  }), [mining, farming, ocean, hunting, updateMining, updateFarming, updateOcean, updateHunting])

  return (
    <ExpertContext.Provider value={value}>
      {children}
    </ExpertContext.Provider>
  )
}

// ===== Hook =====
export function useExpert(): ExpertContextType {
  const context = useContext(ExpertContext)
  if (!context) {
    throw new Error('useExpert must be used within ExpertProvider')
  }
  return context
}

// ===== 타입 re-export (하위 호환성) =====
export type { MiningSettings, FarmingSettings, OceanSettings, HuntingSettings }
