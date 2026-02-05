'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react'

interface MiningSettings {
  pickaxeLevel: number
  cobi: number
  ingot: number
  gemStart: number
  gemShine: number
  lucky: number
  firePick: number
}

interface FarmingSettings {
  hoeLevel: number
  gift: number
  harvest: number
  pot: number
  money: number
  king: number
  seedBonus: number
  fire: number
}

interface OceanSettings {
  rodLevel: number
  clamSell: number
  premiumPrice: number
  deepSea: number
  star: number
  clamRefill: number
}

// ============ 🎯 HuntingSettings 추가 ============
interface HuntingSettings {
  swordLevel: number
  allTheWay: number
  worthProof: number
  beastHeart: number
  flowMaintain: number
  fasterThanAnyone: number
  extraProcessing: number
  mutantSpecies: number
}

interface ExpertContextType {
  mining: MiningSettings
  farming: FarmingSettings
  ocean: OceanSettings
  hunting: HuntingSettings  // ← 추가
  updateMining: (key: keyof MiningSettings, value: number) => void
  updateFarming: (key: keyof FarmingSettings, value: number) => void
  updateOcean: (key: keyof OceanSettings, value: number) => void
  updateHunting: (key: keyof HuntingSettings, value: number) => void  // ← 추가
}

const defaultMining: MiningSettings = {
  pickaxeLevel: 1, cobi: 0, ingot: 0, gemStart: 0, gemShine: 0, lucky: 0, firePick: 0
}

const defaultFarming: FarmingSettings = {
  hoeLevel: 1, gift: 0, harvest: 0, pot: 0, money: 0, king: 0, seedBonus: 0, fire: 0
}

const defaultOcean: OceanSettings = {
  rodLevel: 1, clamSell: 0, premiumPrice: 0, deepSea: 0, star: 0, clamRefill: 0
}

// ============ 🎯 defaultHunting 추가 ============
const defaultHunting: HuntingSettings = {
  swordLevel: 1,
  allTheWay: 0,
  worthProof: 0,
  beastHeart: 0,
  flowMaintain: 0,
  fasterThanAnyone: 0,
  extraProcessing: 0,
  mutantSpecies: 0
}

const ExpertContext = createContext<ExpertContextType | null>(null)

// localStorage 로드 함수
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const saved = localStorage.getItem(key)
    return saved ? { ...defaultValue, ...JSON.parse(saved) } : defaultValue
  } catch { return defaultValue }
}

// localStorage 저장 함수
function saveToStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function ExpertProvider({ children }: { children: ReactNode }) {
  const [mining, setMining] = useState<MiningSettings>(defaultMining)
  const [farming, setFarming] = useState<FarmingSettings>(defaultFarming)
  const [ocean, setOcean] = useState<OceanSettings>(defaultOcean)
  const [hunting, setHunting] = useState<HuntingSettings>(defaultHunting)  // ← 추가

  // 클라이언트에서 한 번만 localStorage 로드
  useEffect(() => {
    setMining(loadFromStorage('miningExpert', defaultMining))
    setFarming(loadFromStorage('farmingExpert', defaultFarming))
    setOcean(loadFromStorage('oceanExpert', defaultOcean))
    setHunting(loadFromStorage('huntingExpert', defaultHunting))  // ← 추가
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

  // ============ 🎯 updateHunting 함수 추가 ============
  const updateHunting = useCallback((key: keyof HuntingSettings, value: number) => {
    setHunting(prev => {
      const next = { ...prev, [key]: value }
      saveToStorage('huntingExpert', next)
      return next
    })
  }, [])

  const value = useMemo(() => ({
    mining, farming, ocean, hunting, updateMining, updateFarming, updateOcean, updateHunting  // ← hunting, updateHunting 추가
  }), [mining, farming, ocean, hunting, updateMining, updateFarming, updateOcean, updateHunting])

  return (
    <ExpertContext.Provider value={value}>
      {children}
    </ExpertContext.Provider>
  )
}

export function useExpert() {
  const context = useContext(ExpertContext)
  if (!context) throw new Error('useExpert must be used within ExpertProvider')
  return context
}