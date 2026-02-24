'use client'

import { useState, useEffect, useRef } from 'react'

const GoldIcon = () => (
  <img 
    src="/img/gold.png" 
    alt="골드" 
    style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }} 
  />
)
import { useExpert } from '@/hooks/useExpert'
import { useSecurityLock } from '@/hooks/useSecurityLock'
import { 
  calculate1Star, calculate2Star, calculate3Star, calculateAll,
  PREMIUM_PRICE_RATE,
  Result1Star, Result2Star, Result3Star, ResultAll
} from './ocean-calculator'
import './ocean-gold.css'
import { INGREDIENT_TOOLTIPS, TooltipItem } from '@/data/ocean'
import { 
  MaterialPrices, MATERIAL_LABELS, CATEGORY_LABELS, INITIAL_MATERIAL_PRICES,
  calculate1StarMaterialCost, calculate2StarMaterialCost, calculate3StarMaterialCost
} from './material-prices'

type StarLevel = 'all' | '1' | '2' | '3'

// localStorage 키
const STORAGE_KEY = 'ocean-gold-data'

export default function OceanGoldPage() {
  const { ocean } = useExpert()
  const [starLevel, setStarLevel] = useState<StarLevel>('all')
  const [advancedMode, setAdvancedMode] = useState(false)
  const [setMode, setSetMode] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [independentMode, setIndependentMode] = useState(false) // 독립 계산 스위치
  const [showGuide, setShowGuide] = useState(false) // 가이드 열림/닫힘
  const [showPriceInput, setShowPriceInput] = useState(false) // 재료 시세 토글
  const [priceAccordion, setPriceAccordion] = useState({ star1: false, star2: false, star3: false }) // 통합탭 아코디언
  
  // 재료 시세 입력
  const [materialPrices, setMaterialPrices] = useState({
    // 어패류 (1/2/3성)
    shellfish1: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    shellfish2: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    shellfish3: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    // 1성 블록
    block1: { clay: 0, sand: 0, dirt: 0, gravel: 0, granite: 0 },
    // 1성 물고기
    fish1: { shrimp: 0, domi: 0, herring: 0, goldfish: 0, bass: 0 },
    // 2성 재료
    material2: { seaweed: 0, kelp: 0 },
    // 2성 잎
    leaf2: { oak: 0, spruce: 0, birch: 0, acacia: 0, cherry: 0 },
    // 2성 광물
    mineral2: { lapis: 0, redstone: 0, iron: 0, gold: 0, diamond: 0 },
    // 3성 재료
    material3: { seaSquirt: 0, glassBottle: 0, driedKelp: 0, glowBerry: 0 },
    // 3성 블록
    block3: { netherrack: 0, magma: 0, soulSoil: 0, crimson: 0, warped: 0 },
    // 3성 산호
    coral3: { tube: 0, brain: 0, bubble: 0, fire: 0, horn: 0 }
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false) // 계산 중 상태
  const [workerReady, setWorkerReady] = useState(false) // Worker 준비 상태
  
  // Web Worker 참조
  const workerRef = useRef<Worker | null>(null)
  
  // 입력 필드 텍스트 상태 (세트 표기 유지용)
  const [inputTexts, setInputTexts] = useState<Record<string, string>>({})
  
  const [result1, setResult1] = useState<Result1Star | null>(null)
  const [result2, setResult2] = useState<Result2Star | null>(null)
  const [result3, setResult3] = useState<Result3Star | null>(null)
  const [resultAll, setResultAll] = useState<ResultAll | null>(null)

  // 통합 어패류 입력 (모든 탭에서 공유)
  const [shellfish, setShellfish] = useState({
    star1: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    star2: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
    star3: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 }
  })

  // 고급 입력 (각 티어별)
  const [advanced1, setAdvanced1] = useState({
    essGuard: 0, essWave: 0, essChaos: 0, essLife: 0, essDecay: 0,
    coreWG: 0, coreWP: 0, coreOD: 0, coreVD: 0, coreED: 0
  })
  const [advanced2, setAdvanced2] = useState({
    essGuard: 0, essWave: 0, essChaos: 0, essLife: 0, essDecay: 0,
    crystalVital: 0, crystalErosion: 0, crystalDefense: 0, crystalRegen: 0, crystalPoison: 0
  })
  const [advanced3, setAdvanced3] = useState({
    elixGuard: 0, elixWave: 0, elixChaos: 0, elixLife: 0, elixDecay: 0,
    potionImmortal: 0, potionBarrier: 0, potionCorrupt: 0, potionFrenzy: 0, potionVenom: 0
  })

  // localStorage에서 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.shellfish) setShellfish(parsed.shellfish)
        if (parsed.advanced1) setAdvanced1(parsed.advanced1)
        if (parsed.advanced2) setAdvanced2(parsed.advanced2)
        if (parsed.advanced3) setAdvanced3(parsed.advanced3)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
    setIsLoaded(true)
  }, [])

  // 데이터 변경 시 localStorage에 저장
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          shellfish, advanced1, advanced2, advanced3
        }))
      } catch (e) {
        console.error('Failed to save to localStorage:', e)
      }
    }
  }, [shellfish, advanced1, advanced2, advanced3, isLoaded])

  // Web Worker 초기화
  useEffect(() => {
    try {
      workerRef.current = new Worker('/ocean-worker.js')
      
      workerRef.current.onmessage = (e) => {
        const { type, result } = e.data
        setIsCalculating(false)
        
        switch(type) {
          case 'calculate1Star':
            setResult1(result)
            setIndependentMode(true)
            break
          case 'calculate2Star':
            setResult2(result)
            setIndependentMode(true)
            break
          case 'calculate3Star':
            setResult3(result)
            setIndependentMode(true)
            break
          case 'calculateAll':
            setResultAll(result)
            if (result) {
              setResult1(result.result1)
              setResult2(result.result2)
              setResult3(result.result3)
            }
            setIndependentMode(false)
            break
        }
      }
      
      workerRef.current.onerror = (e) => {
        console.error('Worker error:', e)
        setWorkerReady(false)
        setIsCalculating(false)
      }
      
      setWorkerReady(true)
    } catch (e) {
      console.error('Worker init failed:', e)
      setWorkerReady(false)
    }
    
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  // 보안 잠금 (스크롤/복사 방지) - 전체 사이트에 적용하려면 layout.tsx에서 SecurityLock 컴포넌트 사용
  useSecurityLock()

  const fmt = (n: number) => n.toLocaleString()
  const getPremiumRate = () => PREMIUM_PRICE_RATE[ocean.premiumPrice] || 0
  
  // 2개 단위로 올림 (정수/에센스/엘릭서는 2개씩 제작되므로)
  const ceilToTwo = (n: number) => Math.ceil(n / 2) * 2
  
  // 64개 단위로 세트 표시 (예: 136 → "2/8")
  const formatSet = (n: number) => `${Math.floor(n / 64)}/${n % 64}`
  
  const formatValue = (n: number): string => {
    if (!setMode) return String(n)
    const sets = Math.floor(n / 64)
    const remainder = n % 64
    return `${sets} / ${remainder}`
  }

  // 어패류 입력 업데이트 (동기화)
  const updateShellfish = (tier: 'star1' | 'star2' | 'star3', key: string, value: number) => {
    setShellfish(prev => ({
      ...prev,
      [tier]: { ...prev[tier], [key]: value }
    }))
  }

  // 모든 성급에 어패류가 있는지 확인
  const hasAllTiers = () => {
    const has1 = Object.values(shellfish.star1).some(v => v > 0)
    const has2 = Object.values(shellfish.star2).some(v => v > 0)
    const has3 = Object.values(shellfish.star3).some(v => v > 0)
    return has1 && has2 && has3
  }

  // 독립 계산 스위치 변경 시 자동 재계산
  useEffect(() => {
    if (starLevel === 'all') return
    if (!workerRef.current) return
    
    if (independentMode) {
      // 독립 계산 모드: 해당 성급만 계산 (Worker 사용)
      setIsCalculating(true)
      if (starLevel === '1') {
        workerRef.current.postMessage({
          type: 'calculate1Star',
          payload: {
            input: { ...shellfish.star1, ...(advancedMode ? advanced1 : {}) },
            isAdvanced: advancedMode
          }
        })
      } else if (starLevel === '2') {
        workerRef.current.postMessage({
          type: 'calculate2Star',
          payload: {
            input: {
              guard2: shellfish.star2.guard, wave2: shellfish.star2.wave,
              chaos2: shellfish.star2.chaos, life2: shellfish.star2.life, decay2: shellfish.star2.decay,
              ...(advancedMode ? advanced2 : {})
            },
            isAdvanced: advancedMode
          }
        })
      } else if (starLevel === '3') {
        workerRef.current.postMessage({
          type: 'calculate3Star',
          payload: {
            input: { ...shellfish.star3, ...(advancedMode ? advanced3 : {}) },
            isAdvanced: advancedMode
          }
        })
      }
    } else if (resultAll) {
      // 통합 연동 모드: 통합 결과 사용
      setResult1(resultAll.result1)
      setResult2(resultAll.result2)
      setResult3(resultAll.result3)
    }
  }, [independentMode, starLevel])

  const calculate = () => {
    setIsCalculating(true)
    
    // Worker가 준비되었으면 Worker 사용, 아니면 직접 계산 (fallback)
    if (workerReady && workerRef.current) {
      if (starLevel === 'all') {
        workerRef.current.postMessage({
          type: 'calculateAll',
          payload: { shellfish, advanced1, advanced2, advanced3 }
        })
      } else if (starLevel === '1') {
        workerRef.current.postMessage({
          type: 'calculate1Star',
          payload: {
            input: { ...shellfish.star1, ...(advancedMode ? advanced1 : {}) },
            isAdvanced: advancedMode
          }
        })
      } else if (starLevel === '2') {
        workerRef.current.postMessage({
          type: 'calculate2Star',
          payload: {
            input: {
              guard2: shellfish.star2.guard, wave2: shellfish.star2.wave,
              chaos2: shellfish.star2.chaos, life2: shellfish.star2.life, decay2: shellfish.star2.decay,
              ...(advancedMode ? advanced2 : {})
            },
            isAdvanced: advancedMode
          }
        })
      } else if (starLevel === '3') {
        workerRef.current.postMessage({
          type: 'calculate3Star',
          payload: {
            input: { ...shellfish.star3, ...(advancedMode ? advanced3 : {}) },
            isAdvanced: advancedMode
          }
        })
      }
    } else {
      // Fallback: Worker 없이 직접 계산
      try {
        if (starLevel === 'all') {
          const res = calculateAll(shellfish, advanced1, advanced2, advanced3)
          setResultAll(res)
          setResult1(res.result1)
          setResult2(res.result2)
          setResult3(res.result3)
          setIndependentMode(false)
        } else if (starLevel === '1') {
          const res = calculate1Star({ 
            ...shellfish.star1, 
            ...(advancedMode ? advanced1 : {})
          }, advancedMode)
          setResult1(res)
          setIndependentMode(true)
        } else if (starLevel === '2') {
          const res = calculate2Star({ 
            guard2: shellfish.star2.guard, wave2: shellfish.star2.wave,
            chaos2: shellfish.star2.chaos, life2: shellfish.star2.life, decay2: shellfish.star2.decay,
            ...(advancedMode ? advanced2 : {})
          }, advancedMode)
          setResult2(res)
          setIndependentMode(true)
        } else if (starLevel === '3') {
          const res = calculate3Star({ 
            ...shellfish.star3, 
            ...(advancedMode ? advanced3 : {})
          }, advancedMode)
          setResult3(res)
          setIndependentMode(true)
        }
      } finally {
        setIsCalculating(false)
      }
    }
  }

  // 전체 초기화
  const resetAll = () => {
    const emptyShellfish = {
      star1: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
      star2: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
      star3: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 }
    }
    const emptyAdvanced1 = {
      essGuard: 0, essWave: 0, essChaos: 0, essLife: 0, essDecay: 0,
      coreWG: 0, coreWP: 0, coreOD: 0, coreVD: 0, coreED: 0
    }
    const emptyAdvanced2 = {
      essGuard: 0, essWave: 0, essChaos: 0, essLife: 0, essDecay: 0,
      crystalVital: 0, crystalErosion: 0, crystalDefense: 0, crystalRegen: 0, crystalPoison: 0
    }
    const emptyAdvanced3 = {
      elixGuard: 0, elixWave: 0, elixChaos: 0, elixLife: 0, elixDecay: 0,
      potionImmortal: 0, potionBarrier: 0, potionCorrupt: 0, potionFrenzy: 0, potionVenom: 0
    }
    setShellfish(emptyShellfish)
    setAdvanced1(emptyAdvanced1)
    setAdvanced2(emptyAdvanced2)
    setAdvanced3(emptyAdvanced3)
    setInputTexts({}) // 입력 텍스트 초기화
    setResult1(null)
    setResult2(null)
    setResult3(null)
    setResultAll(null)
    // localStorage도 초기화
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
  }

  const productNames = {
    '1': { A: '영생의 아쿠티스', K: '크라켄의 광란체', L: '리바이던의 깃털' },
    '2': { A: '해구의 파동 코어', K: '침묵의 심해 비약', L: '청해룡의 날개' },
    '3': { A: '아쿠아 펄스 파편', K: '나우틸러스의 손', L: '무저의 척추' }
  }

  // 세트 표기 파싱 (예: "2/2" → 130, "1/5" → 69)
  const parseSetNotation = (input: string): number => {
    const trimmed = input.trim()
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/')
      const sets = parseInt(parts[0]) || 0
      const remainder = parseInt(parts[1]) || 0
      return sets * 64 + remainder
    }
    return parseInt(trimmed) || 0
  }

  // 숫자를 세트 표기로 변환 (예: 130 → "2/2")
  const toSetNotation = (value: number): string => {
    if (value === 0) return ''
    const sets = Math.floor(value / 64)
    const remainder = value % 64
    if (sets === 0) return String(remainder)
    return `${sets}/${remainder}`
  }

  const renderInput = (label: string, value: number, onChange: (v: number) => void, inputKey: string) => {
    // inputTexts에 값이 있으면 그것을, 없으면 세트 표기로 변환해서 표시
    const displayValue = inputTexts[inputKey] !== undefined ? inputTexts[inputKey] : toSetNotation(value)
    
    return (
      <label className="gold-input-label">
        <span>{label}</span>
        <input 
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={(e) => {
            // 입력 중에는 텍스트 그대로 저장
            setInputTexts(prev => ({ ...prev, [inputKey]: e.target.value }))
          }}
          onBlur={(e) => {
            // 포커스 벗어날 때 실제 값으로 변환
            const parsed = parseSetNotation(e.target.value)
            onChange(parsed)
            // 입력 텍스트도 정리 (빈 값이면 지우고, 아니면 유지)
            if (e.target.value.trim() === '') {
              setInputTexts(prev => {
                const newState = { ...prev }
                delete newState[inputKey]
                return newState
              })
            }
          }}
          placeholder="세트/개"
          style={{ userSelect: 'text' } as React.CSSProperties}
        />
        {setMode && <span className="input-set-display">{Math.floor(value / 64)} / {value % 64}</span>}
      </label>
    )
  }

  // 보유량 요약 표시 (0보다 큰 것만)
  const renderOwnedSummary1 = () => {
    const items = [
      { name: '수호 정수', value: advanced1.essGuard },
      { name: '파동 정수', value: advanced1.essWave },
      { name: '혼란 정수', value: advanced1.essChaos },
      { name: '생명 정수', value: advanced1.essLife },
      { name: '부식 정수', value: advanced1.essDecay },
      { name: '물결수호 핵', value: advanced1.coreWG },
      { name: '파동오염 핵', value: advanced1.coreWP },
      { name: '질서파괴 핵', value: advanced1.coreOD },
      { name: '활력붕괴 핵', value: advanced1.coreVD },
      { name: '침식방어 핵', value: advanced1.coreED },
    ].filter(i => i.value > 0)
    if (items.length === 0) return null
    return <span className="owned-summary">+{items.map(i => `${i.name} ${i.value}`).join(', ')}</span>
  }

  const renderOwnedSummary2 = () => {
    const items = [
      { name: '수호 에센스', value: advanced2.essGuard },
      { name: '파동 에센스', value: advanced2.essWave },
      { name: '혼란 에센스', value: advanced2.essChaos },
      { name: '생명 에센스', value: advanced2.essLife },
      { name: '부식 에센스', value: advanced2.essDecay },
      { name: '활기 보존', value: advanced2.crystalVital },
      { name: '파도 침식', value: advanced2.crystalErosion },
      { name: '방어 오염', value: advanced2.crystalDefense },
      { name: '격류 재생', value: advanced2.crystalRegen },
      { name: '맹독 혼란', value: advanced2.crystalPoison },
    ].filter(i => i.value > 0)
    if (items.length === 0) return null
    return <span className="owned-summary">+{items.map(i => `${i.name} ${i.value}`).join(', ')}</span>
  }

  const renderOwnedSummary3 = () => {
    const items = [
      { name: '수호 엘릭서', value: advanced3.elixGuard },
      { name: '파동 엘릭서', value: advanced3.elixWave },
      { name: '혼란 엘릭서', value: advanced3.elixChaos },
      { name: '생명 엘릭서', value: advanced3.elixLife },
      { name: '부식 엘릭서', value: advanced3.elixDecay },
      { name: '불멸 재생', value: advanced3.potionImmortal },
      { name: '파동 장벽', value: advanced3.potionBarrier },
      { name: '타락 침식', value: advanced3.potionCorrupt },
      { name: '생명 광란', value: advanced3.potionFrenzy },
      { name: '맹독 파동', value: advanced3.potionVenom },
    ].filter(i => i.value > 0)
    if (items.length === 0) return null
    return <span className="owned-summary">+{items.map(i => `${i.name} ${i.value}`).join(', ')}</span>
  }

  // 수정: 0 값도 표시, 툴팁 추가, tooltipKey 지원
  const renderSectionWithImage = (title: string, items: { name: string; value: number; icon?: string; tooltipKey?: string }[]) => {
    return (
      <div className="gold-result-section">
        <h5>{title}</h5>
        <div className="gold-material-tags with-image">
          {items.map((item, idx) => {
            const tooltipData = INGREDIENT_TOOLTIPS[item.tooltipKey || item.name]
            return (
              <span key={idx} className="gold-material-tag with-image tooltip-wrapper">
                {item.icon && <span className="mat-icon"><img src={item.icon} alt={item.name} /></span>}
                <span className="mat-name">{item.name}</span>
                <span className="mat-value">{formatValue(item.value)}</span>
                {tooltipData && (
                  <div className="ingredient-tooltip">
                    {tooltipData.ingredients.map((ing: TooltipItem, i: number) => (
                      <div key={i} className="tooltip-item">
                        {ing.icon && <img src={ing.icon} alt={ing.name} className="tooltip-icon" />}
                        <span className="tooltip-text">{ing.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  // 최종 결과품 렌더링 (기존 디자인 유지 + 툴팁 추가)
  const renderProductWithTooltip = (name: string, count: number) => {
    const tooltipData = INGREDIENT_TOOLTIPS[name]
    return (
      <div className={tooltipData ? 'tooltip-wrapper' : ''}>
        <div className="product-name">{name}</div>
        <div className="product-count">{count}</div>
        {tooltipData && (
          <div className="ingredient-tooltip product-tooltip">
            {tooltipData.ingredients.map((ing: TooltipItem, i: number) => (
              <div key={i} className="tooltip-item">
                {ing.icon && <img src={ing.icon} alt={ing.name} className="tooltip-icon" />}
                <span className="tooltip-text">{ing.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 통합 탭용 미니 제품 렌더링 (툴팁 없음)
  const renderMiniProduct = (name: string, count: number) => {
    return (
      <div className="mini-product">
        <span className="mini-product-name">{name}</span>
        <span className="mini-product-count">{count}</span>
      </div>
    )
  }

  // 수정: 0 값도 표시
  const renderSection = (title: string, items: { name: string; value: number }[]) => {
    return (
      <div className="gold-result-section">
        <h5>{title}</h5>
        <div className="gold-material-tags">
          {items.map((item, idx) => (
            <span key={idx} className="gold-material-tag">
              <span className="mat-name">{item.name}</span>
              <span className="mat-value">{formatValue(item.value)}</span>
            </span>
          ))}
        </div>
      </div>
    )
  }

  // 순수익 계산 (실제 사용된 재료 기준)
  const getNetProfit = (star: '1' | '2' | '3' | 'all') => {
    let sellPrice = 0
    let materialCost = 0

    if (star === '1' && result1) {
      sellPrice = Math.floor(result1.best.gold * (1 + getPremiumRate()))
      materialCost = calculate1StarMaterialCost(materialPrices, result1)
    } else if (star === '2' && result2) {
      sellPrice = Math.floor(result2.best.gold * (1 + getPremiumRate()))
      materialCost = calculate2StarMaterialCost(materialPrices, result2)
    } else if (star === '3' && result3) {
      sellPrice = Math.floor(result3.best.gold * (1 + getPremiumRate()))
      materialCost = calculate3StarMaterialCost(materialPrices, result3)
    } else if (star === 'all' && resultAll) {
      sellPrice = Math.floor(resultAll.totalGold * (1 + getPremiumRate()))
      const cost1 = calculate1StarMaterialCost(materialPrices, resultAll.result1)
      const cost2 = calculate2StarMaterialCost(materialPrices, resultAll.result2)
      const cost3 = calculate3StarMaterialCost(materialPrices, resultAll.result3)
      materialCost = cost1 + cost2 + cost3
    }

    const profit = sellPrice - materialCost
    const percent = sellPrice > 0 ? ((profit / sellPrice) * 100).toFixed(1) : '0'
    return { sellPrice, materialCost, profit, percent }
  }

  // 골드 결과 + 순수익 툴팁 렌더링
  const renderGoldWithProfit = (gold: number, star: '1' | '2' | '3' | 'all') => {
    const { materialCost, profit, percent } = getNetProfit(star)
    const hasPriceInput = materialCost > 0

    return (
      <div className={`gold-result-gold ${hasPriceInput ? 'has-net-profit' : ''}`}>
        <GoldIcon /> {fmt(gold)}
        {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
        {hasPriceInput && (
          <div className="net-profit-tooltip">
            <div>재료비 : {fmt(materialCost)} G</div>
            <div className={profit >= 0 ? 'net-profit-positive' : 'net-profit-negative'}>
              순수익 : {fmt(profit)} G ({profit >= 0 ? '+' : ''}{percent}%)
            </div>
          </div>
        )}
      </div>
    )
  }

  // 재료 시세 입력 렌더링 - 1성
  const renderPriceInput1Star = () => (
    <div className="price-input-content">
      <div className="price-category-section">
        <span className="price-section-label">어패류★</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.shellfish1).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label.replace(' ★', '')}</span>
              <input
                type="number"
                value={materialPrices.shellfish1[key as keyof typeof materialPrices.shellfish1] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  shellfish1: { ...prev.shellfish1, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">블록</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.block1).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label}</span>
              <input
                type="number"
                value={materialPrices.block1[key as keyof typeof materialPrices.block1] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  block1: { ...prev.block1, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">물고기</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.fish1).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label}</span>
              <input
                type="number"
                value={materialPrices.fish1[key as keyof typeof materialPrices.fish1] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  fish1: { ...prev.fish1, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 재료 시세 입력 렌더링 - 2성
  const renderPriceInput2Star = () => (
    <div className="price-input-content">
      <div className="price-category-section">
        <span className="price-section-label">어패류★★</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.shellfish2).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label.replace(' ★★', '')}</span>
              <input
                type="number"
                value={materialPrices.shellfish2[key as keyof typeof materialPrices.shellfish2] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  shellfish2: { ...prev.shellfish2, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">재료</span>
        <div className="price-input-grid price-input-grid-2">
          {Object.entries(MATERIAL_LABELS.material2).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label}</span>
              <input
                type="number"
                value={materialPrices.material2[key as keyof typeof materialPrices.material2] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  material2: { ...prev.material2, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">잎</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.leaf2).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label.replace(' 잎', '')}</span>
              <input
                type="number"
                value={materialPrices.leaf2[key as keyof typeof materialPrices.leaf2] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  leaf2: { ...prev.leaf2, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">광물</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.mineral2).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label}</span>
              <input
                type="number"
                value={materialPrices.mineral2[key as keyof typeof materialPrices.mineral2] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  mineral2: { ...prev.mineral2, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 재료 시세 입력 렌더링 - 3성
  const renderPriceInput3Star = () => (
    <div className="price-input-content">
      <div className="price-category-section">
        <span className="price-section-label">어패류★★★</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.shellfish3).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label.replace(' ★★★', '')}</span>
              <input
                type="number"
                value={materialPrices.shellfish3[key as keyof typeof materialPrices.shellfish3] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  shellfish3: { ...prev.shellfish3, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">재료</span>
        <div className="price-input-grid price-input-grid-4">
          {Object.entries(MATERIAL_LABELS.material3).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label}</span>
              <input
                type="number"
                value={materialPrices.material3[key as keyof typeof materialPrices.material3] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  material3: { ...prev.material3, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">블록</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.block3).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label}</span>
              <input
                type="number"
                value={materialPrices.block3[key as keyof typeof materialPrices.block3] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  block3: { ...prev.block3, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="price-category-section">
        <span className="price-section-label">산호</span>
        <div className="price-input-grid">
          {Object.entries(MATERIAL_LABELS.coral3).map(([key, label]) => (
            <div key={key} className="price-input-item">
              <span className="price-item-label">{label.replace('죽은 ', '').replace(' 산호', '')}</span>
              <input
                type="number"
                value={materialPrices.coral3[key as keyof typeof materialPrices.coral3] || ''}
                onChange={(e) => setMaterialPrices(prev => ({
                  ...prev,
                  coral3: { ...prev.coral3, [key]: Number(e.target.value) || 0 }
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="gold-container">
        {/* 연금품 가이드 */}
        <div className="data-card">
          <button className={`data-toggle ${showGuide ? 'open' : ''}`} onClick={() => setShowGuide(v => !v)}>
            <span>연금품 가이드</span>
            <span className="toggle-icon">{showGuide ? '▼' : 'ㅡ'}</span>
          </button>
          <div className={`data-table-wrapper ${showGuide ? 'open' : ''}`}>
            <div className="guide-content">
              <div className="guide-section">
                <h4>옵션 설명</h4>
                <ul>
                  <li><strong>세트 변환</strong> : 세트 / 수량 으로 표기를 바꿉니다</li>
                  <li><strong>보유량 입력</strong> : 기존 보유하고 있던 보유량도 고려하여 계산합니다</li>
                  <li><strong>독립 계산</strong> : 0성을 고려하지 않은 값으로 보여줍니다</li>
                  <li><strong>재료 시세</strong> : 1개당 가격으로 입력해주세요. 골드 계산 결과 위에 마우스 커서를 올리면 순수익 확인이 가능합니다</li>
                </ul>
              </div>
              <div className="guide-section">
                <p>⚠️ 주의 : 입력값이 클 수록 계산 시간이 늘어납니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 재료 시세 - 탭에 따라 다르게 표시 */}
        <div className="data-card price-card">
          <button className={`data-toggle ${showPriceInput ? 'open' : ''}`} onClick={() => setShowPriceInput(v => !v)}>
            <span>재료 시세(TEST) {starLevel !== 'all' ? `(${starLevel}성)` : ''}</span>
            <span className="toggle-icon">{showPriceInput ? '▼' : 'ㅡ'}</span>
          </button>
          <div className={`price-accordion-wrapper ${showPriceInput ? 'open' : ''}`}>
            {starLevel === 'all' ? (
              <>
                {/* 통합: 아코디언 */}
                <div className="price-accordion-item">
                  <button 
                    className={`price-accordion-toggle ${priceAccordion.star1 ? 'open' : ''}`}
                    onClick={() => setPriceAccordion(prev => ({ ...prev, star1: !prev.star1 }))}
                  >
                    <span>1성 재료</span>
                    <span className="toggle-icon">{priceAccordion.star1 ? '▼' : 'ㅡ'}</span>
                  </button>
                  {priceAccordion.star1 && renderPriceInput1Star()}
                </div>
                <div className="price-accordion-item">
                  <button 
                    className={`price-accordion-toggle ${priceAccordion.star2 ? 'open' : ''}`}
                    onClick={() => setPriceAccordion(prev => ({ ...prev, star2: !prev.star2 }))}
                  >
                    <span>2성 재료</span>
                    <span className="toggle-icon">{priceAccordion.star2 ? '▼' : 'ㅡ'}</span>
                  </button>
                  {priceAccordion.star2 && renderPriceInput2Star()}
                </div>
                <div className="price-accordion-item">
                  <button 
                    className={`price-accordion-toggle ${priceAccordion.star3 ? 'open' : ''}`}
                    onClick={() => setPriceAccordion(prev => ({ ...prev, star3: !prev.star3 }))}
                  >
                    <span>3성 재료</span>
                    <span className="toggle-icon">{priceAccordion.star3 ? '▼' : 'ㅡ'}</span>
                  </button>
                  {priceAccordion.star3 && renderPriceInput3Star()}
                </div>
              </>
            ) : starLevel === '1' ? (
              renderPriceInput1Star()
            ) : starLevel === '2' ? (
              renderPriceInput2Star()
            ) : (
              renderPriceInput3Star()
            )}
          </div>
        </div>

        {/* 탭 선택 */}
        <div className="gold-star-toggle">
          {(['all', '1', '2', '3'] as StarLevel[]).map(s => (
            <label key={s} className={starLevel === s ? 'active' : ''}>
              <input type="radio" name="star" checked={starLevel === s} onChange={() => setStarLevel(s)} />
              {s === 'all' ? '통합' : `${s}성`}
            </label>
          ))}
          <div className="gold-switch-container switch-container">
            <div className="switch-wrapper">
              <span className="switch-label" onClick={() => setSetMode(v => !v)}>세트 변환</span>
              <div className="switcher">
                <input type="checkbox" id="set-mode-switch" checked={setMode} onChange={(e) => setSetMode(e.target.checked)} />
                <label htmlFor="set-mode-switch" className="switch_label"><span className="onf_btn" /></label>
              </div>
            </div>
            {starLevel !== 'all' && (
              <>
                <div className="switch-wrapper">
                  <span className="switch-label" onClick={() => setAdvancedMode(v => !v)}>보유량 입력</span>
                  <div className="switcher">
                    <input type="checkbox" id="advanced-mode-switch" checked={advancedMode} onChange={(e) => setAdvancedMode(e.target.checked)} />
                    <label htmlFor="advanced-mode-switch" className="switch_label"><span className="onf_btn" /></label>
                  </div>
                </div>
                {(resultAll || result1 || result2 || result3) && (
                  <div className="switch-wrapper">
                    <span className="switch-label" onClick={() => setIndependentMode(v => !v)}>독립 계산</span>
                    <div className="switcher">
                      <input type="checkbox" id="independent-mode-switch" checked={independentMode} onChange={(e) => setIndependentMode(e.target.checked)} />
                      <label htmlFor="independent-mode-switch" className="switch_label"><span className="onf_btn" /></label>
                    </div>
                  </div>
                )}
              </>
            )}
            <button type="button" className="gold-reset-btn" onClick={resetAll}>
              초기화
            </button>
          </div>
        </div>

        {/* 통합 계산기 */}
        {starLevel === 'all' && (
          <div className="gold-card">
            <div className="gold-card-header">통합 계산기</div>
            <div className="gold-card-body">
              <div className="gold-advanced-section">
                <h4 className="section-header-with-owned">1성 어패류 {renderOwnedSummary1()}</h4>
                <div className="gold-input-grid">
                  {renderInput('굴 ★', shellfish.star1.guard, v => updateShellfish('star1', 'guard', v), 's1-guard')}
                  {renderInput('소라 ★', shellfish.star1.wave, v => updateShellfish('star1', 'wave', v), 's1-wave')}
                  {renderInput('문어 ★', shellfish.star1.chaos, v => updateShellfish('star1', 'chaos', v), 's1-chaos')}
                  {renderInput('미역 ★', shellfish.star1.life, v => updateShellfish('star1', 'life', v), 's1-life')}
                  {renderInput('성게 ★', shellfish.star1.decay, v => updateShellfish('star1', 'decay', v), 's1-decay')}
                </div>
              </div>
              <div className="gold-advanced-section">
                <h4 className="section-header-with-owned">2성 어패류 {renderOwnedSummary2()}</h4>
                <div className="gold-input-grid">
                  {renderInput('굴 ★★', shellfish.star2.guard, v => updateShellfish('star2', 'guard', v), 's2-guard')}
                  {renderInput('소라 ★★', shellfish.star2.wave, v => updateShellfish('star2', 'wave', v), 's2-wave')}
                  {renderInput('문어 ★★', shellfish.star2.chaos, v => updateShellfish('star2', 'chaos', v), 's2-chaos')}
                  {renderInput('미역 ★★', shellfish.star2.life, v => updateShellfish('star2', 'life', v), 's2-life')}
                  {renderInput('성게 ★★', shellfish.star2.decay, v => updateShellfish('star2', 'decay', v), 's2-decay')}
                </div>
              </div>
              <div className="gold-advanced-section">
                <h4 className="section-header-with-owned">3성 어패류 {renderOwnedSummary3()}</h4>
                <div className="gold-input-grid">
                  {renderInput('굴 ★★★', shellfish.star3.guard, v => updateShellfish('star3', 'guard', v), 's3-guard')}
                  {renderInput('소라 ★★★', shellfish.star3.wave, v => updateShellfish('star3', 'wave', v), 's3-wave')}
                  {renderInput('문어 ★★★', shellfish.star3.chaos, v => updateShellfish('star3', 'chaos', v), 's3-chaos')}
                  {renderInput('미역 ★★★', shellfish.star3.life, v => updateShellfish('star3', 'life', v), 's3-life')}
                  {renderInput('성게 ★★★', shellfish.star3.decay, v => updateShellfish('star3', 'decay', v), 's3-decay')}
                </div>
              </div>
              <button className="gold-btn-calculate" onClick={calculate} disabled={isCalculating}>
                {isCalculating ? '계산 중입니다...' : '최대 골드 계산'}
              </button>
            </div>

            {/* 통합 결과 */}
            {resultAll && (resultAll.result1 || resultAll.result2 || resultAll.result3) && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>최적 조합 결과</h4>
                  {renderGoldWithProfit(Math.floor(resultAll.totalGold * (1 + getPremiumRate())), 'all')}
                </div>

                {/* 4열 카드 형태 결과 (항상 추출액 포함) */}
                <div className="gold-unified-cards">
                  {/* 추출액 (0성) - 항상 표시 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">희석액 (0성)</div>
                    <div className="mini-card-products">
                      <div className="mini-product">
                        <span className="mini-product-name">추출된 희석액</span>
                        <span className="mini-product-count">{resultAll.dilution}</span>
                      </div>
                    </div>
                    <div className="mini-card-gold"><GoldIcon /> {fmt(Math.floor(resultAll.summary.dilutionGold * (1 + getPremiumRate())))}</div>
                  </div>

                  {/* 1성 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">1성</div>
                    <div className="mini-card-products">
                      {renderMiniProduct('영생의 아쿠티스', resultAll.result1?.best.A || 0)}
                      {renderMiniProduct('크라켄의 광란체', resultAll.result1?.best.K || 0)}
                      {renderMiniProduct('리바이던의 깃털', resultAll.result1?.best.L || 0)}
                    </div>
                    <div className="mini-card-gold"><GoldIcon /> {fmt(Math.floor(resultAll.summary.star1Gold * (1 + getPremiumRate())))}</div>
                  </div>

                  {/* 2성 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">2성</div>
                    <div className="mini-card-products">
                      {renderMiniProduct('해구 파동의 코어', resultAll.result2?.best.CORE || 0)}
                      {renderMiniProduct('침묵의 심해 비약', resultAll.result2?.best.POTION || 0)}
                      {renderMiniProduct('청해룡의 날개', resultAll.result2?.best.WING || 0)}
                    </div>
                    <div className="mini-card-gold"><GoldIcon /> {fmt(Math.floor(resultAll.summary.star2Gold * (1 + getPremiumRate())))}</div>
                  </div>

                  {/* 3성 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">3성</div>
                    <div className="mini-card-products">
                      {renderMiniProduct('아쿠아 펄스 파편', resultAll.result3?.best.AQUA || 0)}
                      {renderMiniProduct('나우틸러스의 손', resultAll.result3?.best.NAUTILUS || 0)}
                      {renderMiniProduct('무저의 척추', resultAll.result3?.best.SPINE || 0)}
                    </div>
                    <div className="mini-card-gold"><GoldIcon /> {fmt(Math.floor(resultAll.summary.star3Gold * (1 + getPremiumRate())))}</div>
                  </div>
                </div>

                {/* 추출액 필요 재료 - 3열 카드 */}
                {resultAll.dilution > 0 && (
                  <div className="gold-dilution-materials">
                    <h5>희석액 {resultAll.dilution}개 제작</h5>

                    <div className="dilution-tier-grid">
                      {/* 1성: 침식 방어 핵 */}
                      <div className="dilution-tier-card tier1">
                        <div className="tier-card-header">
                          <img src="/img/ocean/core_ed.png" alt="침식방어핵" style={{ width: 20, height: 20, marginRight: 4 }} />
                          <span className="tier-card-title">침식 방어의 핵 ★</span>
                          <span className="tier-card-count">{resultAll.result1?.reservedCoreED || 0}개</span>
                        </div>
                        <div className="tier-card-body">
                          <div className="tier-material-row">
                            <span className="material-label">정수</span>
                            <span>부식 {setMode ? formatSet(resultAll.result1?.essNeedDilution?.decay || 0) : resultAll.result1?.essNeedDilution?.decay || 0}</span>
                            <span>수호 {setMode ? formatSet(resultAll.result1?.essNeedDilution?.guard || 0) : resultAll.result1?.essNeedDilution?.guard || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">블록</span>
                            <span>화강암 {setMode ? formatSet(resultAll.result1?.blockNeedDilution?.granite || 0) : resultAll.result1?.blockNeedDilution?.granite || 0}</span>
                            <span>점토 {setMode ? formatSet(resultAll.result1?.blockNeedDilution?.clay || 0) : resultAll.result1?.blockNeedDilution?.clay || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">물고기</span>
                            <span>농어 {setMode ? formatSet(resultAll.result1?.fishNeedDilution?.bass || 0) : resultAll.result1?.fishNeedDilution?.bass || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* 2성: 방어 오염 결정 */}
                      <div className="dilution-tier-card tier2">
                        <div className="tier-card-header">
                          <img src="/img/ocean/crystal_defense.png" alt="방어오염결정" style={{ width: 17, height: 20, marginRight: 4 }} />
                          <span className="tier-card-title">방어 오염의 결정 ★★</span>
                          <span className="tier-card-count">{resultAll.result2?.reservedCrystalDefense || 0}개</span>
                        </div>
                        <div className="tier-card-body">
                          <div className="tier-material-row">
                            <span className="material-label">에센스</span>
                            <span>수호 {setMode ? formatSet(resultAll.result2?.essNeedDilution?.guard || 0) : resultAll.result2?.essNeedDilution?.guard || 0}</span>
                            <span>혼란 {setMode ? formatSet(resultAll.result2?.essNeedDilution?.chaos || 0) : resultAll.result2?.essNeedDilution?.chaos || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">잎</span>
                            <span>참나무 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.oakLeaves || 0) : resultAll.result2?.materialNeedDilution?.oakLeaves || 0}</span>
                            <span>자작나무 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.birchLeaves || 0) : resultAll.result2?.materialNeedDilution?.birchLeaves || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">기타</span>
                            <span>해초 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.seaweed || 0) : resultAll.result2?.materialNeedDilution?.seaweed || 0}</span>
                            <span>켈프 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.kelp || 0) : resultAll.result2?.materialNeedDilution?.kelp || 0}</span>
                            <span>철 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.ironIngot || 0) : resultAll.result2?.materialNeedDilution?.ironIngot || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* 3성: 타락 침식 영약 */}
                      <div className="dilution-tier-card tier3">
                        <div className="tier-card-header">
                          <img src="/img/ocean/potion-corrupt.png" alt="타락침식영약" style={{ width: 20, height: 20, marginRight: 4 }} />
                          <span className="tier-card-title">타락 침식의 영약 ★★★</span>
                          <span className="tier-card-count">{resultAll.result3?.reservedPotionCorrupt || 0}개</span>
                        </div>
                        <div className="tier-card-body">
                          <div className="tier-material-row">
                            <span className="material-label">엘릭서</span>
                            <span>혼란 {setMode ? formatSet(resultAll.result3?.elixNeedDilution?.chaos || 0) : resultAll.result3?.elixNeedDilution?.chaos || 0}</span>
                            <span>부식 {setMode ? formatSet(resultAll.result3?.elixNeedDilution?.decay || 0) : resultAll.result3?.elixNeedDilution?.decay || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">엘릭서 재료</span>
                            <span>불우렁쉥이 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.seaSquirt || 0) : resultAll.result3?.materialNeedDilution?.seaSquirt || 0}</span>
                            <span>유리병 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.glassBottle || 0) : resultAll.result3?.materialNeedDilution?.glassBottle || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">엘릭서 블록</span>
                            <span>영혼흙 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.soulSoil || 0) : resultAll.result3?.materialNeedDilution?.soulSoil || 0}</span>
                            <span>뒤틀린자루 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.warpedStem || 0) : resultAll.result3?.materialNeedDilution?.warpedStem || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">영약 재료</span>
                            <span>말린켈프 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.driedKelp || 0) : resultAll.result3?.materialNeedDilution?.driedKelp || 0}</span>
                            <span>발광열매 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.glowBerry || 0) : resultAll.result3?.materialNeedDilution?.glowBerry || 0}</span>
                          </div>
                          <div className="tier-material-row">
                            <span className="material-label">영약 블록</span>
                            <span>죽은거품 {setMode ? formatSet(resultAll.result3?.deadCoralNeedDilution?.deadBubbleCoral || 0) : resultAll.result3?.deadCoralNeedDilution?.deadBubbleCoral || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 1성 계산기 */}
        {starLevel === '1' && (
          <div className="gold-card">
            <div className="gold-card-header">1성 계산기</div>
            <div className="gold-card-body">
              <div className="gold-input-grid">
                {renderInput('굴 ★', shellfish.star1.guard, v => updateShellfish('star1', 'guard', v), 's1-guard')}
                {renderInput('소라 ★', shellfish.star1.wave, v => updateShellfish('star1', 'wave', v), 's1-wave')}
                {renderInput('문어 ★', shellfish.star1.chaos, v => updateShellfish('star1', 'chaos', v), 's1-chaos')}
                {renderInput('미역 ★', shellfish.star1.life, v => updateShellfish('star1', 'life', v), 's1-life')}
                {renderInput('성게 ★', shellfish.star1.decay, v => updateShellfish('star1', 'decay', v), 's1-decay')}
              </div>
              {advancedMode && (
                <>
                  <div className="gold-advanced-section">
                    <h4>보유 정수</h4>
                    <div className="gold-input-grid">
                      {renderInput('수호의 정수', advanced1.essGuard, v => setAdvanced1({ ...advanced1, essGuard: v }), 'a1-essGuard')}
                      {renderInput('파동의 정수', advanced1.essWave, v => setAdvanced1({ ...advanced1, essWave: v }), 'a1-essWave')}
                      {renderInput('혼란의 정수', advanced1.essChaos, v => setAdvanced1({ ...advanced1, essChaos: v }), 'a1-essChaos')}
                      {renderInput('생명의 정수', advanced1.essLife, v => setAdvanced1({ ...advanced1, essLife: v }), 'a1-essLife')}
                      {renderInput('부식의 정수', advanced1.essDecay, v => setAdvanced1({ ...advanced1, essDecay: v }), 'a1-essDecay')}
                    </div>
                  </div>
                  <div className="gold-advanced-section">
                    <h4>보유 핵</h4>
                    <div className="gold-input-grid">
                      {renderInput('물결 수호', advanced1.coreWG, v => setAdvanced1({ ...advanced1, coreWG: v }), 'a1-coreWG')}
                      {renderInput('파동 오염', advanced1.coreWP, v => setAdvanced1({ ...advanced1, coreWP: v }), 'a1-coreWP')}
                      {renderInput('질서 파괴', advanced1.coreOD, v => setAdvanced1({ ...advanced1, coreOD: v }), 'a1-coreOD')}
                      {renderInput('활력 붕괴', advanced1.coreVD, v => setAdvanced1({ ...advanced1, coreVD: v }), 'a1-coreVD')}
                      {renderInput('침식 방어', advanced1.coreED, v => setAdvanced1({ ...advanced1, coreED: v }), 'a1-coreED')}
                    </div>
                  </div>
                </>
              )}
              <button className="gold-btn-calculate" onClick={calculate} disabled={isCalculating}>
                {isCalculating ? '계산 중입니다...' : '1성 최대 골드 계산'}
              </button>
            </div>

            {result1 && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>최적 조합 결과{resultAll && !independentMode ? '' : ''}</h4>
                  {renderGoldWithProfit(Math.floor((resultAll && !independentMode ? resultAll.summary.star1Gold : result1.best.gold) * (1 + getPremiumRate())), '1')}
                </div>

                <div className="gold-result-products">
                  {renderProductWithTooltip(productNames['1'].A, result1.best.A)}
                  {renderProductWithTooltip(productNames['1'].K, result1.best.K)}
                  {renderProductWithTooltip(productNames['1'].L, result1.best.L)}
                </div>

                {renderSectionWithImage('🔹 제작할 정수 ', [
                  { name: '수호', value: ceilToTwo(result1.essNeedProduct.guard), icon: '/img/ocean/essence_guard.png' },
                  { name: '파동', value: ceilToTwo(result1.essNeedProduct.wave), icon: '/img/ocean/essence_wave.png' },
                  { name: '혼란', value: ceilToTwo(result1.essNeedProduct.chaos), icon: '/img/ocean/essence_chaos.png' },
                  { name: '생명', value: ceilToTwo(result1.essNeedProduct.life), icon: '/img/ocean/essence_life.png' },
                  { name: '부식', value: ceilToTwo(result1.essNeedProduct.decay), icon: '/img/ocean/essence_decay.png' }
                ])}
                {renderSectionWithImage('🔹 제작할 핵 ', [
                  { name: '물결 수호', value: result1.coreToMakeProduct.WG, icon: '/img/ocean/core_wg.png' },
                  { name: '파동 오염', value: result1.coreToMakeProduct.WP, icon: '/img/ocean/core_wp.png' },
                  { name: '질서 파괴', value: result1.coreToMakeProduct.OD, icon: '/img/ocean/core_od.png' },
                  { name: '활력 붕괴', value: result1.coreToMakeProduct.VD, icon: '/img/ocean/core_vd.png' },
                  { name: '침식 방어', value: result1.coreToMakeProduct.ED, icon: '/img/ocean/core_ed.png' }
                ])}
                {renderSection('🔹 필요 블록 ', [
                  { name: '점토', value: result1.blockNeedProduct.clay },
                  { name: '모래', value: result1.blockNeedProduct.sand },
                  { name: '흙', value: result1.blockNeedProduct.dirt },
                  { name: '자갈', value: result1.blockNeedProduct.gravel },
                  { name: '화강암', value: result1.blockNeedProduct.granite }
                ])}
                {renderSection('🔹 필요 물고기 ', [
                  { name: '새우', value: result1.fishNeedProduct.shrimp },
                  { name: '도미', value: result1.fishNeedProduct.domi },
                  { name: '청어', value: result1.fishNeedProduct.herring },
                  { name: '금붕어', value: result1.fishNeedProduct.goldfish },
                  { name: '농어', value: result1.fishNeedProduct.bass }
                ])}
              </div>
            )}
          </div>
        )}

        {/* 2성 계산기 */}
        {starLevel === '2' && (
          <div className="gold-card">
            <div className="gold-card-header">2성 계산기</div>
            <div className="gold-card-body">
              <div className="gold-input-grid">
                {renderInput('굴 ★★', shellfish.star2.guard, v => updateShellfish('star2', 'guard', v), 's2-guard')}
                {renderInput('소라 ★★', shellfish.star2.wave, v => updateShellfish('star2', 'wave', v), 's2-wave')}
                {renderInput('문어 ★★', shellfish.star2.chaos, v => updateShellfish('star2', 'chaos', v), 's2-chaos')}
                {renderInput('미역 ★★', shellfish.star2.life, v => updateShellfish('star2', 'life', v), 's2-life')}
                {renderInput('성게 ★★', shellfish.star2.decay, v => updateShellfish('star2', 'decay', v), 's2-decay')}
              </div>
              {advancedMode && (
                <>
                  <div className="gold-advanced-section">
                    <h4>보유 에센스</h4>
                    <div className="gold-input-grid">
                      {renderInput('수호 에센스', advanced2.essGuard, v => setAdvanced2({ ...advanced2, essGuard: v }), 'a2-essGuard')}
                      {renderInput('파동 에센스', advanced2.essWave, v => setAdvanced2({ ...advanced2, essWave: v }), 'a2-essWave')}
                      {renderInput('혼란 에센스', advanced2.essChaos, v => setAdvanced2({ ...advanced2, essChaos: v }), 'a2-essChaos')}
                      {renderInput('생명 에센스', advanced2.essLife, v => setAdvanced2({ ...advanced2, essLife: v }), 'a2-essLife')}
                      {renderInput('부식 에센스', advanced2.essDecay, v => setAdvanced2({ ...advanced2, essDecay: v }), 'a2-essDecay')}
                    </div>
                  </div>
                  <div className="gold-advanced-section">
                    <h4>보유 결정</h4>
                    <div className="gold-input-grid">
                      {renderInput('활기 보존', advanced2.crystalVital, v => setAdvanced2({ ...advanced2, crystalVital: v }), 'a2-crystalVital')}
                      {renderInput('파도 침식', advanced2.crystalErosion, v => setAdvanced2({ ...advanced2, crystalErosion: v }), 'a2-crystalErosion')}
                      {renderInput('방어 오염', advanced2.crystalDefense, v => setAdvanced2({ ...advanced2, crystalDefense: v }), 'a2-crystalDefense')}
                      {renderInput('격류 재생', advanced2.crystalRegen, v => setAdvanced2({ ...advanced2, crystalRegen: v }), 'a2-crystalRegen')}
                      {renderInput('맹독 혼란', advanced2.crystalPoison, v => setAdvanced2({ ...advanced2, crystalPoison: v }), 'a2-crystalPoison')}
                    </div>
                  </div>
                </>
              )}
              <button className="gold-btn-calculate" onClick={calculate} disabled={isCalculating}>
                {isCalculating ? '계산 중입니다...' : '2성 최대 골드 계산'}
              </button>
            </div>

            {result2 && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>최적 조합 결과{resultAll && !independentMode ? '' : ''}</h4>
                  {renderGoldWithProfit(Math.floor((resultAll && !independentMode ? resultAll.summary.star2Gold : result2.best.gold) * (1 + getPremiumRate())), '2')}
                </div>

                <div className="gold-result-products">
                  {renderProductWithTooltip(productNames['2'].A, result2.best.CORE)}
                  {renderProductWithTooltip(productNames['2'].K, result2.best.POTION)}
                  {renderProductWithTooltip(productNames['2'].L, result2.best.WING)}
                </div>

                {renderSectionWithImage('🔹 제작할 에센스 ', [
                  { name: '수호', value: ceilToTwo(result2.essNeedProduct.guard), icon: '/img/ocean/essence_guard_2.png', tooltipKey: '수호 에센스' },
                  { name: '파동', value: ceilToTwo(result2.essNeedProduct.wave), icon: '/img/ocean/essence_wave_2.png', tooltipKey: '파동 에센스' },
                  { name: '혼란', value: ceilToTwo(result2.essNeedProduct.chaos), icon: '/img/ocean/essence_chaos_2.png', tooltipKey: '혼란 에센스' },
                  { name: '생명', value: ceilToTwo(result2.essNeedProduct.life), icon: '/img/ocean/essence_life_2.png', tooltipKey: '생명 에센스' },
                  { name: '부식', value: ceilToTwo(result2.essNeedProduct.decay), icon: '/img/ocean/essence_decay_2.png', tooltipKey: '부식 에센스' }
                ])}
                {renderSectionWithImage('🔹 제작할 결정 ', [
                  { name: '활기 보존', value: result2.crystalToMakeProduct.vital, icon: '/img/ocean/crystal_vital.png' },
                  { name: '파도 침식', value: result2.crystalToMakeProduct.erosion, icon: '/img/ocean/crystal_erosion.png' },
                  { name: '방어 오염', value: result2.crystalToMakeProduct.defense, icon: '/img/ocean/crystal_defense.png' },
                  { name: '격류 재생', value: result2.crystalToMakeProduct.regen, icon: '/img/ocean/crystal_regen.png' },
                  { name: '맹독 혼란', value: result2.crystalToMakeProduct.poison, icon: '/img/ocean/crystal_poison.png' }
                ])}
                {renderSection('🔹 필요 재료 ', [
                  { name: '해초', value: result2.materialNeedProduct.seaweed },
                  { name: '켈프', value: result2.materialNeedProduct.kelp }
                ])}
                {renderSection('🔹 필요 블록 ', [
                  { name: '참나무 잎', value: result2.materialNeedProduct.oakLeaves },
                  { name: '가문비 잎', value: result2.materialNeedProduct.spruceLeaves },
                  { name: '자작나무 잎', value: result2.materialNeedProduct.birchLeaves },
                  { name: '아카시아 잎', value: result2.materialNeedProduct.acaciaLeaves },
                  { name: '벚나무 잎', value: result2.materialNeedProduct.cherryLeaves }
                ])}
                {renderSection('🔹 필요 광물 ', [
                  { name: '청금석 블록', value: result2.materialNeedProduct.lapisBlock },
                  { name: '레드스톤 블록', value: result2.materialNeedProduct.redstoneBlock },
                  { name: '철 주괴', value: result2.materialNeedProduct.ironIngot },
                  { name: '금 주괴', value: result2.materialNeedProduct.goldIngot },
                  { name: '다이아몬드', value: result2.materialNeedProduct.diamond }
                ])}
              </div>
            )}
          </div>
        )}

        {/* 3성 계산기 */}
        {starLevel === '3' && (
          <div className="gold-card">
            <div className="gold-card-header">3성 계산기</div>
            <div className="gold-card-body">
              <div className="gold-input-grid">
                {renderInput('굴 ★★★', shellfish.star3.guard, v => updateShellfish('star3', 'guard', v), 's3-guard')}
                {renderInput('소라 ★★★', shellfish.star3.wave, v => updateShellfish('star3', 'wave', v), 's3-wave')}
                {renderInput('문어 ★★★', shellfish.star3.chaos, v => updateShellfish('star3', 'chaos', v), 's3-chaos')}
                {renderInput('미역 ★★★', shellfish.star3.life, v => updateShellfish('star3', 'life', v), 's3-life')}
                {renderInput('성게 ★★★', shellfish.star3.decay, v => updateShellfish('star3', 'decay', v), 's3-decay')}
              </div>
              {advancedMode && (
                <>
                  <div className="gold-advanced-section">
                    <h4>보유 엘릭서</h4>
                    <div className="gold-input-grid">
                      {renderInput('수호 엘릭서', advanced3.elixGuard, v => setAdvanced3({ ...advanced3, elixGuard: v }), 'a3-elixGuard')}
                      {renderInput('파동 엘릭서', advanced3.elixWave, v => setAdvanced3({ ...advanced3, elixWave: v }), 'a3-elixWave')}
                      {renderInput('혼란 엘릭서', advanced3.elixChaos, v => setAdvanced3({ ...advanced3, elixChaos: v }), 'a3-elixChaos')}
                      {renderInput('생명 엘릭서', advanced3.elixLife, v => setAdvanced3({ ...advanced3, elixLife: v }), 'a3-elixLife')}
                      {renderInput('부식 엘릭서', advanced3.elixDecay, v => setAdvanced3({ ...advanced3, elixDecay: v }), 'a3-elixDecay')}
                    </div>
                  </div>
                  <div className="gold-advanced-section">
                    <h4>보유 영약</h4>
                    <div className="gold-input-grid">
                      {renderInput('불멸 재생', advanced3.potionImmortal, v => setAdvanced3({ ...advanced3, potionImmortal: v }), 'a3-potionImmortal')}
                      {renderInput('파동 장벽', advanced3.potionBarrier, v => setAdvanced3({ ...advanced3, potionBarrier: v }), 'a3-potionBarrier')}
                      {renderInput('타락 침식', advanced3.potionCorrupt, v => setAdvanced3({ ...advanced3, potionCorrupt: v }), 'a3-potionCorrupt')}
                      {renderInput('생명 광란', advanced3.potionFrenzy, v => setAdvanced3({ ...advanced3, potionFrenzy: v }), 'a3-potionFrenzy')}
                      {renderInput('맹독 파동', advanced3.potionVenom, v => setAdvanced3({ ...advanced3, potionVenom: v }), 'a3-potionVenom')}
                    </div>
                  </div>
                </>
              )}
              <button className="gold-btn-calculate" onClick={calculate} disabled={isCalculating}>
                {isCalculating ? '계산 중입니다...' : '3성 최대 골드 계산'}
              </button>
            </div>

            {result3 && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>최적 조합 결과{resultAll && !independentMode ? '' : ''}</h4>
                  {renderGoldWithProfit(Math.floor((resultAll && !independentMode ? resultAll.summary.star3Gold : result3.best.gold) * (1 + getPremiumRate())), '3')}
                </div>

                <div className="gold-result-products">
                  {renderProductWithTooltip(productNames['3'].A, result3.best.AQUA)}
                  {renderProductWithTooltip(productNames['3'].K, result3.best.NAUTILUS)}
                  {renderProductWithTooltip(productNames['3'].L, result3.best.SPINE)}
                </div>

                {renderSectionWithImage('🔹 제작할 엘릭서 ', [
                  { name: '수호', value: (result3.elixNeedProduct.guard), icon: '/img/ocean/elixir-guard.png', tooltipKey: '수호 엘릭서' },
                  { name: '파동', value: (result3.elixNeedProduct.wave), icon: '/img/ocean/elixir-wave.png', tooltipKey: '파동 엘릭서' },
                  { name: '혼란', value: (result3.elixNeedProduct.chaos), icon: '/img/ocean/elixir-chaos.png', tooltipKey: '혼란 엘릭서' },
                  { name: '생명', value: (result3.elixNeedProduct.life), icon: '/img/ocean/elixir-life.png', tooltipKey: '생명 엘릭서' },
                  { name: '부식', value: (result3.elixNeedProduct.decay), icon: '/img/ocean/elixir-decay.png', tooltipKey: '부식 엘릭서' }
                ])}
                {renderSectionWithImage('🔹 제작할 영약 ', [
                  { name: '불멸 재생', value: result3.potionToMakeProduct.immortal, icon: '/img/ocean/potion-immortal.png' },
                  { name: '파동 장벽', value: result3.potionToMakeProduct.barrier, icon: '/img/ocean/potion-barrier.png' },
                  { name: '타락 침식', value: result3.potionToMakeProduct.corrupt, icon: '/img/ocean/potion-corrupt.png' },
                  { name: '생명 광란', value: result3.potionToMakeProduct.frenzy, icon: '/img/ocean/potion-frenzy.png' },
                  { name: '맹독 파동', value: result3.potionToMakeProduct.venom, icon: '/img/ocean/potion-venom.png' }
                ])}
                {renderSection('🔹 필요 재료 ', [
                  { name: '불우렁쉥이', value: result3.materialNeedProduct.seaSquirt },
                  { name: '유리병', value: result3.materialNeedProduct.glassBottle },
                  { name: '말린 켈프', value: result3.materialNeedProduct.driedKelp },
                  { name: '발광 열매', value: result3.materialNeedProduct.glowBerry }
                ])}
                {renderSection('🔹 필요 블록 ', [
                  { name: '네더랙', value: result3.materialNeedProduct.netherrack },
                  { name: '마그마 블록', value: result3.materialNeedProduct.magmaBlock },
                  { name: '영혼 흙', value: result3.materialNeedProduct.soulSoil },
                  { name: '진홍빛 자루', value: result3.materialNeedProduct.crimsonStem },
                  { name: '뒤틀린 자루', value: result3.materialNeedProduct.warpedStem }
                ])}
                {renderSection('🔹 필요 산호 ', [
                  { name: '죽은 관 산호', value: result3.deadCoralNeedProduct.deadTubeCoral },
                  { name: '죽은 사방산호', value: result3.deadCoralNeedProduct.deadBrainCoral },
                  { name: '죽은 거품 산호', value: result3.deadCoralNeedProduct.deadBubbleCoral },
                  { name: '죽은 불 산호', value: result3.deadCoralNeedProduct.deadFireCoral },
                  { name: '죽은 뇌 산호', value: result3.deadCoralNeedProduct.deadHornCoral }
                ])}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}