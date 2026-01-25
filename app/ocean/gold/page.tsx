'use client'

import { useState, useEffect } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { useSecurityLock } from '@/hooks/useSecurityLock'
import { 
  calculate1Star, calculate2Star, calculate3Star, calculateAll,
  PREMIUM_PRICE_RATE,
  Result1Star, Result2Star, Result3Star, ResultAll
} from './ocean-calculator'
import './ocean-gold.css'

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
  const [isLoaded, setIsLoaded] = useState(false)
  
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
    
    if (independentMode) {
      // 독립 계산 모드: 해당 성급만 계산
      if (starLevel === '1') {
        const res = calculate1Star({ 
          ...shellfish.star1, 
          ...(advancedMode ? advanced1 : {})
        }, advancedMode)
        if (res) setResult1(res)
      } else if (starLevel === '2') {
        const res = calculate2Star({ 
          guard2: shellfish.star2.guard, wave2: shellfish.star2.wave,
          chaos2: shellfish.star2.chaos, life2: shellfish.star2.life, decay2: shellfish.star2.decay,
          ...(advancedMode ? advanced2 : {})
        }, advancedMode)
        if (res) setResult2(res)
      } else if (starLevel === '3') {
        const res = calculate3Star({ 
          ...shellfish.star3, 
          ...(advancedMode ? advanced3 : {})
        }, advancedMode)
        if (res) setResult3(res)
      }
    } else if (resultAll) {
      // 통합 연동 모드: 통합 결과 사용
      setResult1(resultAll.result1)
      setResult2(resultAll.result2)
      setResult3(resultAll.result3)
    }
  }, [independentMode, starLevel])

  const calculate = () => {
    if (starLevel === 'all') {
      // 통합: 항상 추출액 포함
      const res = calculateAll(shellfish, advanced1, advanced2, advanced3)
      setResultAll(res)
      // 개별 탭 결과도 저장 (연동용)
      setResult1(res.result1)
      setResult2(res.result2)
      setResult3(res.result3)
      // 독립 모드 리셋
      setIndependentMode(false)
    } else if (starLevel === '1') {
      // 독립 계산
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

  const renderInput = (label: string, value: number, onChange: (v: number) => void) => (
    <label className="gold-input-label">
      <span>{label}</span>
      <input 
        type="number" 
        min={0} 
        value={value || ''} 
        onChange={(e) => onChange(parseInt(e.target.value) || 0)} 
        style={{ userSelect: 'text' } as React.CSSProperties}
      />
      {setMode && <span className="input-set-display">{Math.floor(value / 64)} / {value % 64}</span>}
    </label>
  )

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

  // 수정: 0 값도 표시
  const renderSectionWithImage = (title: string, items: { name: string; value: number; icon?: string }[]) => {
    return (
      <div className="gold-result-section">
        <h5>{title}</h5>
        <div className="gold-material-tags with-image">
          {items.map((item, idx) => (
            <span key={idx} className="gold-material-tag with-image">
              {item.icon && <span className="mat-icon"><img src={item.icon} alt={item.name} /></span>}
              <span className="mat-name">{item.name}</span>
              <span className="mat-value">{formatValue(item.value)}</span>
            </span>
          ))}
        </div>
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

  return (
    <div>
      <div className="gold-container">
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
                  {renderInput('굴 ★', shellfish.star1.guard, v => updateShellfish('star1', 'guard', v))}
                  {renderInput('소라 ★', shellfish.star1.wave, v => updateShellfish('star1', 'wave', v))}
                  {renderInput('문어 ★', shellfish.star1.chaos, v => updateShellfish('star1', 'chaos', v))}
                  {renderInput('미역 ★', shellfish.star1.life, v => updateShellfish('star1', 'life', v))}
                  {renderInput('성게 ★', shellfish.star1.decay, v => updateShellfish('star1', 'decay', v))}
                </div>
              </div>
              <div className="gold-advanced-section">
                <h4 className="section-header-with-owned">2성 어패류 {renderOwnedSummary2()}</h4>
                <div className="gold-input-grid">
                  {renderInput('굴 ★★', shellfish.star2.guard, v => updateShellfish('star2', 'guard', v))}
                  {renderInput('소라 ★★', shellfish.star2.wave, v => updateShellfish('star2', 'wave', v))}
                  {renderInput('문어 ★★', shellfish.star2.chaos, v => updateShellfish('star2', 'chaos', v))}
                  {renderInput('미역 ★★', shellfish.star2.life, v => updateShellfish('star2', 'life', v))}
                  {renderInput('성게 ★★', shellfish.star2.decay, v => updateShellfish('star2', 'decay', v))}
                </div>
              </div>
              <div className="gold-advanced-section">
                <h4 className="section-header-with-owned">3성 어패류 {renderOwnedSummary3()}</h4>
                <div className="gold-input-grid">
                  {renderInput('굴 ★★★', shellfish.star3.guard, v => updateShellfish('star3', 'guard', v))}
                  {renderInput('소라 ★★★', shellfish.star3.wave, v => updateShellfish('star3', 'wave', v))}
                  {renderInput('문어 ★★★', shellfish.star3.chaos, v => updateShellfish('star3', 'chaos', v))}
                  {renderInput('미역 ★★★', shellfish.star3.life, v => updateShellfish('star3', 'life', v))}
                  {renderInput('성게 ★★★', shellfish.star3.decay, v => updateShellfish('star3', 'decay', v))}
                </div>
              </div>
              <button className="gold-btn-calculate" onClick={calculate}>최대 골드 계산</button>
            </div>

            {/* 통합 결과 */}
            {resultAll && (resultAll.result1 || resultAll.result2 || resultAll.result3) && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>📊 최적 분배 결과</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor(resultAll.totalGold * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                {/* 4열 카드 형태 결과 (항상 추출액 포함) */}
                <div className="gold-unified-cards">
                  {/* 추출액 (0성) - 항상 표시 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">추출액 (0성)</div>
                    <div className="mini-card-products">
                      <div className="mini-product">
                        <span className="mini-product-name">희석된 추출액</span>
                        <span className="mini-product-count">{resultAll.dilution}</span>
                      </div>
                    </div>
                    <div className="mini-card-gold">💰 {fmt(Math.floor(resultAll.summary.dilutionGold * (1 + getPremiumRate())))}</div>
                  </div>

                  {/* 1성 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">1성</div>
                    <div className="mini-card-products">
                      <div className="mini-product">
                        <span className="mini-product-name">영생의 아쿠티스</span>
                        <span className="mini-product-count">{resultAll.result1?.best.A || 0}</span>
                      </div>
                      <div className="mini-product">
                        <span className="mini-product-name">크라켄의 광란체</span>
                        <span className="mini-product-count">{resultAll.result1?.best.K || 0}</span>
                      </div>
                      <div className="mini-product">
                        <span className="mini-product-name">리바이던의 깃털</span>
                        <span className="mini-product-count">{resultAll.result1?.best.L || 0}</span>
                      </div>
                    </div>
                    <div className="mini-card-gold">💰 {fmt(Math.floor(resultAll.summary.star1Gold * (1 + getPremiumRate())))}</div>
                  </div>

                  {/* 2성 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">2성</div>
                    <div className="mini-card-products">
                      <div className="mini-product">
                        <span className="mini-product-name">해구의 파동 코어</span>
                        <span className="mini-product-count">{resultAll.result2?.best.CORE || 0}</span>
                      </div>
                      <div className="mini-product">
                        <span className="mini-product-name">침묵의 심해 비약</span>
                        <span className="mini-product-count">{resultAll.result2?.best.POTION || 0}</span>
                      </div>
                      <div className="mini-product">
                        <span className="mini-product-name">청해룡의 날개</span>
                        <span className="mini-product-count">{resultAll.result2?.best.WING || 0}</span>
                      </div>
                    </div>
                    <div className="mini-card-gold">💰 {fmt(Math.floor(resultAll.summary.star2Gold * (1 + getPremiumRate())))}</div>
                  </div>

                  {/* 3성 */}
                  <div className="gold-result-mini-card">
                    <div className="mini-card-header">3성</div>
                    <div className="mini-card-products">
                      <div className="mini-product">
                        <span className="mini-product-name">아쿠아 펄스 파편</span>
                        <span className="mini-product-count">{resultAll.result3?.best.AQUA || 0}</span>
                      </div>
                      <div className="mini-product">
                        <span className="mini-product-name">나우틸러스의 손</span>
                        <span className="mini-product-count">{resultAll.result3?.best.NAUTILUS || 0}</span>
                      </div>
                      <div className="mini-product">
                        <span className="mini-product-name">무저의 척추</span>
                        <span className="mini-product-count">{resultAll.result3?.best.SPINE || 0}</span>
                      </div>
                    </div>
                    <div className="mini-card-gold">💰 {fmt(Math.floor(resultAll.summary.star3Gold * (1 + getPremiumRate())))}</div>
                  </div>
                </div>

                {/* 추출액 필요 재료 - 항상 표시 */}
                <div className="gold-dilution-materials">
                  <h5>추출액 필요 재료</h5>

                  {/* 세로 3열 배치 */}
                  <div className="dilution-tier-grid">
                    {/* 1성: 침식 방어 핵 */}
                    <div className="dilution-tier-card tier1">
                      <div className="tier-card-header">
                        <img src="/img/ocean/core_ed.png" alt="침식방어핵" style={{ width: 20, height: 20, marginRight: 4 }} />
                        <span className="tier-card-title">침식 방어의 핵★</span>
                        <span className="tier-card-count">{resultAll.result1?.reservedCoreED || 0}개</span>
                      </div>
                      <div className="tier-card-body">
                        <div className="tier-card-row">
                          <span className="row-label">정수</span>
                          <div className="row-items">
                            <span>부식 {setMode ? formatSet(resultAll.result1?.essNeedDilution?.decay || 0) : resultAll.result1?.essNeedDilution?.decay || 0}</span>
                            <span>수호 {setMode ? formatSet(resultAll.result1?.essNeedDilution?.guard || 0) : resultAll.result1?.essNeedDilution?.guard || 0}</span>
                          </div>
                        </div>
                        <div className="tier-card-row">
                          <span className="row-label">블록</span>
                          <div className="row-items">
                            <span>화강암 {setMode ? formatSet(resultAll.result1?.blockNeedDilution?.granite || 0) : resultAll.result1?.blockNeedDilution?.granite || 0}</span>
                            <span>점토 {setMode ? formatSet(resultAll.result1?.blockNeedDilution?.clay || 0) : resultAll.result1?.blockNeedDilution?.clay || 0}</span>
                          </div>
                        </div>
                        <div className="tier-card-row">
                          <span className="row-label">물고기</span>
                          <div className="row-items">
                            <span>농어 {setMode ? formatSet(resultAll.result1?.fishNeedDilution?.bass || 0) : resultAll.result1?.fishNeedDilution?.bass || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2성: 방어 오염 결정 */}
                    <div className="dilution-tier-card tier2">
                      <div className="tier-card-header">
                        <img src="/img/ocean/crystal_defense.png" alt="방어오염결정" style={{ width:17, height: 20, marginRight: 4 }} />
                        <span className="tier-card-title">방어 오염의 결정★★</span>
                        <span className="tier-card-count">{resultAll.result2?.reservedCrystalDefense || 0}개</span>
                      </div>
                      <div className="tier-card-body">
                        <div className="tier-card-row">
                          <span className="row-label">에센스 재료</span>
                          <div className="row-items">
                            <span>해초 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.seaweed || 0) : resultAll.result2?.materialNeedDilution?.seaweed || 0}</span>
                            <span>참나무잎 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.oakLeaves || 0) : resultAll.result2?.materialNeedDilution?.oakLeaves || 0}</span>
                            <span>자작나무잎 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.birchLeaves || 0) : resultAll.result2?.materialNeedDilution?.birchLeaves || 0}</span>
                          </div>
                        </div>
                        <div className="tier-card-row">
                          <span className="row-label">결정 재료</span>
                          <div className="row-items">
                            <span>켈프 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.kelp || 0) : resultAll.result2?.materialNeedDilution?.kelp || 0}</span>
                            <span>철 주괴 {setMode ? formatSet(resultAll.result2?.materialNeedDilution?.ironIngot || 0) : resultAll.result2?.materialNeedDilution?.ironIngot || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3성: 타락 침식 영약 */}
                    <div className="dilution-tier-card tier3">
                      <div className="tier-card-header">
                        <img src="/img/ocean/potion-corrupt.png" alt="타락침식영약" style={{ width: 20, height: 20, marginRight: 4 }} />
                        <span className="tier-card-title">타락 침식의 영약★★★</span>
                        <span className="tier-card-count">{resultAll.result3?.reservedPotionCorrupt || 0}개</span>
                      </div>
                      <div className="tier-card-body">
                        <div className="tier-card-row">
                          <span className="row-label">엘릭서</span>
                          <div className="row-items">
                            <span>혼란 {setMode ? formatSet(resultAll.result3?.elixNeedDilution?.chaos || 0) : resultAll.result3?.elixNeedDilution?.chaos || 0}</span>
                            <span>부식 {setMode ? formatSet(resultAll.result3?.elixNeedDilution?.decay || 0) : resultAll.result3?.elixNeedDilution?.decay || 0}</span>
                          </div>
                        </div>
                          <div className="tier-card-row">
                            <span className="row-label">엘릭서 재료</span>
                            <div className="row-items">
                              <span>불우렁쉥이 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.seaSquirt || 0) : resultAll.result3?.materialNeedDilution?.seaSquirt || 0}</span>
                              <span>유리병 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.glassBottle || 0) : resultAll.result3?.materialNeedDilution?.glassBottle || 0}</span>
                              <span>영혼흙 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.soulSoil || 0) : resultAll.result3?.materialNeedDilution?.soulSoil || 0}</span>
                              <span>뒤틀린 자루 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.warpedStem || 0) : resultAll.result3?.materialNeedDilution?.warpedStem || 0}</span>
                            </div>
                          </div>
                          <div className="tier-card-row">
                            <span className="row-label">영약 재료</span>
                            <div className="row-items">
                              <span>말린 켈프 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.driedKelp || 0) : resultAll.result3?.materialNeedDilution?.driedKelp || 0}</span>
                              <span>발광 열매 {setMode ? formatSet(resultAll.result3?.materialNeedDilution?.glowBerry || 0) : resultAll.result3?.materialNeedDilution?.glowBerry || 0}</span>
                            </div>
                          </div>
                        <div className="tier-card-row">
                          <span className="row-label">산호</span>
                          <div className="row-items">
                            <span>죽은 거품 산호 {setMode ? formatSet(resultAll.result3?.deadCoralNeedDilution?.deadBubbleCoral || 0) : resultAll.result3?.deadCoralNeedDilution?.deadBubbleCoral || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                {renderInput('굴 ★', shellfish.star1.guard, v => updateShellfish('star1', 'guard', v))}
                {renderInput('소라 ★', shellfish.star1.wave, v => updateShellfish('star1', 'wave', v))}
                {renderInput('문어 ★', shellfish.star1.chaos, v => updateShellfish('star1', 'chaos', v))}
                {renderInput('미역 ★', shellfish.star1.life, v => updateShellfish('star1', 'life', v))}
                {renderInput('성게 ★', shellfish.star1.decay, v => updateShellfish('star1', 'decay', v))}
              </div>
              {advancedMode && (
                <>
                  <div className="gold-advanced-section">
                    <h4>보유 정수</h4>
                    <div className="gold-input-grid">
                      {renderInput('수호의 정수', advanced1.essGuard, v => setAdvanced1({ ...advanced1, essGuard: v }))}
                      {renderInput('파동의 정수', advanced1.essWave, v => setAdvanced1({ ...advanced1, essWave: v }))}
                      {renderInput('혼란의 정수', advanced1.essChaos, v => setAdvanced1({ ...advanced1, essChaos: v }))}
                      {renderInput('생명의 정수', advanced1.essLife, v => setAdvanced1({ ...advanced1, essLife: v }))}
                      {renderInput('부식의 정수', advanced1.essDecay, v => setAdvanced1({ ...advanced1, essDecay: v }))}
                    </div>
                  </div>
                  <div className="gold-advanced-section">
                    <h4>보유 핵</h4>
                    <div className="gold-input-grid">
                      {renderInput('파동 수호', advanced1.coreWG, v => setAdvanced1({ ...advanced1, coreWG: v }))}
                      {renderInput('파동 생명', advanced1.coreWP, v => setAdvanced1({ ...advanced1, coreWP: v }))}
                      {renderInput('혼란 부식', advanced1.coreOD, v => setAdvanced1({ ...advanced1, coreOD: v }))}
                      {renderInput('생명 부식', advanced1.coreVD, v => setAdvanced1({ ...advanced1, coreVD: v }))}
                      {renderInput('침식 방어', advanced1.coreED, v => setAdvanced1({ ...advanced1, coreED: v }))}
                    </div>
                  </div>
                </>
              )}
              <button className="gold-btn-calculate" onClick={calculate}>1성 최대 골드 계산</button>
            </div>

            {result1 && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>📊 최적 조합 결과{resultAll && !independentMode ? ' + 0성 포함' : ''}</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor((resultAll && !independentMode ? resultAll.summary.star1Gold : result1.best.gold) * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                <div className="gold-result-products">
                  <div><div className="product-name">{productNames['1'].A}</div><div className="product-count">{result1.best.A}</div></div>
                  <div><div className="product-name">{productNames['1'].K}</div><div className="product-count">{result1.best.K}</div></div>
                  <div><div className="product-name">{productNames['1'].L}</div><div className="product-count">{result1.best.L}</div></div>
                </div>

                {renderSectionWithImage('🔹 필요 정수 ', [
                  { name: '수호', value: ceilToTwo(result1.essNeedProduct.guard), icon: '/img/ocean/essence_guard.png' },
                  { name: '파동', value: ceilToTwo(result1.essNeedProduct.wave), icon: '/img/ocean/essence_wave.png' },
                  { name: '혼란', value: ceilToTwo(result1.essNeedProduct.chaos), icon: '/img/ocean/essence_chaos.png' },
                  { name: '생명', value: ceilToTwo(result1.essNeedProduct.life), icon: '/img/ocean/essence_life.png' },
                  { name: '부식', value: ceilToTwo(result1.essNeedProduct.decay), icon: '/img/ocean/essence_decay.png' }
                ])}
                {renderSectionWithImage('🔹 필요 핵 ', [
                  { name: '물결 수호', value: result1.coreNeedProduct.WG, icon: '/img/ocean/core_wg.png' },
                  { name: '파동 오염', value: result1.coreNeedProduct.WP, icon: '/img/ocean/core_wp.png' },
                  { name: '질서 파괴', value: result1.coreNeedProduct.OD, icon: '/img/ocean/core_od.png' },
                  { name: '활력 붕괴', value: result1.coreNeedProduct.VD, icon: '/img/ocean/core_vd.png' },
                  { name: '침식 방어', value: result1.coreNeedProduct.ED, icon: '/img/ocean/core_ed.png' }
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
                {renderInput('굴 ★★', shellfish.star2.guard, v => updateShellfish('star2', 'guard', v))}
                {renderInput('소라 ★★', shellfish.star2.wave, v => updateShellfish('star2', 'wave', v))}
                {renderInput('문어 ★★', shellfish.star2.chaos, v => updateShellfish('star2', 'chaos', v))}
                {renderInput('미역 ★★', shellfish.star2.life, v => updateShellfish('star2', 'life', v))}
                {renderInput('성게 ★★', shellfish.star2.decay, v => updateShellfish('star2', 'decay', v))}
              </div>
              {advancedMode && (
                <>
                  <div className="gold-advanced-section">
                    <h4>보유 에센스</h4>
                    <div className="gold-input-grid">
                      {renderInput('수호 에센스', advanced2.essGuard, v => setAdvanced2({ ...advanced2, essGuard: v }))}
                      {renderInput('파동 에센스', advanced2.essWave, v => setAdvanced2({ ...advanced2, essWave: v }))}
                      {renderInput('혼란 에센스', advanced2.essChaos, v => setAdvanced2({ ...advanced2, essChaos: v }))}
                      {renderInput('생명 에센스', advanced2.essLife, v => setAdvanced2({ ...advanced2, essLife: v }))}
                      {renderInput('부식 에센스', advanced2.essDecay, v => setAdvanced2({ ...advanced2, essDecay: v }))}
                    </div>
                  </div>
                  <div className="gold-advanced-section">
                    <h4>보유 결정</h4>
                    <div className="gold-input-grid">
                      {renderInput('활기 보존', advanced2.crystalVital, v => setAdvanced2({ ...advanced2, crystalVital: v }))}
                      {renderInput('파도 침식', advanced2.crystalErosion, v => setAdvanced2({ ...advanced2, crystalErosion: v }))}
                      {renderInput('방어 오염', advanced2.crystalDefense, v => setAdvanced2({ ...advanced2, crystalDefense: v }))}
                      {renderInput('격류 재생', advanced2.crystalRegen, v => setAdvanced2({ ...advanced2, crystalRegen: v }))}
                      {renderInput('맹독 혼란', advanced2.crystalPoison, v => setAdvanced2({ ...advanced2, crystalPoison: v }))}
                    </div>
                  </div>
                </>
              )}
              <button className="gold-btn-calculate" onClick={calculate}>2성 최대 골드 계산</button>
            </div>

            {result2 && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>📊 최적 조합 결과{resultAll && !independentMode ? ' + 0성 포함' : ''}</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor((resultAll && !independentMode ? resultAll.summary.star2Gold : result2.best.gold) * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                <div className="gold-result-products">
                  <div><div className="product-name">{productNames['2'].A}</div><div className="product-count">{result2.best.CORE}</div></div>
                  <div><div className="product-name">{productNames['2'].K}</div><div className="product-count">{result2.best.POTION}</div></div>
                  <div><div className="product-name">{productNames['2'].L}</div><div className="product-count">{result2.best.WING}</div></div>
                </div>

                {renderSectionWithImage('🔹 필요 에센스 ', [
                  { name: '수호', value: ceilToTwo(result2.essNeedProduct.guard), icon: '/img/ocean/essence_guard_2.png' },
                  { name: '파동', value: ceilToTwo(result2.essNeedProduct.wave), icon: '/img/ocean/essence_wave_2.png' },
                  { name: '혼란', value: ceilToTwo(result2.essNeedProduct.chaos), icon: '/img/ocean/essence_chaos_2.png' },
                  { name: '생명', value: ceilToTwo(result2.essNeedProduct.life), icon: '/img/ocean/essence_life_2.png' },
                  { name: '부식', value: ceilToTwo(result2.essNeedProduct.decay), icon: '/img/ocean/essence_decay_2.png' }
                ])}
                {renderSectionWithImage('🔹 필요 결정 ', [
                  { name: '활기 보존', value: result2.crystalNeedProduct.vital, icon: '/img/ocean/crystal_vital.png' },
                  { name: '파도 침식', value: result2.crystalNeedProduct.erosion, icon: '/img/ocean/crystal_erosion.png' },
                  { name: '방어 오염', value: result2.crystalNeedProduct.defense, icon: '/img/ocean/crystal_defense.png' },
                  { name: '격류 재생', value: result2.crystalNeedProduct.regen, icon: '/img/ocean/crystal_regen.png' },
                  { name: '맹독 혼란', value: result2.crystalNeedProduct.poison, icon: '/img/ocean/crystal_poison.png' }
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
                {renderInput('굴 ★★★', shellfish.star3.guard, v => updateShellfish('star3', 'guard', v))}
                {renderInput('소라 ★★★', shellfish.star3.wave, v => updateShellfish('star3', 'wave', v))}
                {renderInput('문어 ★★★', shellfish.star3.chaos, v => updateShellfish('star3', 'chaos', v))}
                {renderInput('미역 ★★★', shellfish.star3.life, v => updateShellfish('star3', 'life', v))}
                {renderInput('성게 ★★★', shellfish.star3.decay, v => updateShellfish('star3', 'decay', v))}
              </div>
              {advancedMode && (
                <>
                  <div className="gold-advanced-section">
                    <h4>보유 엘릭서</h4>
                    <div className="gold-input-grid">
                      {renderInput('수호 엘릭서', advanced3.elixGuard, v => setAdvanced3({ ...advanced3, elixGuard: v }))}
                      {renderInput('파동 엘릭서', advanced3.elixWave, v => setAdvanced3({ ...advanced3, elixWave: v }))}
                      {renderInput('혼란 엘릭서', advanced3.elixChaos, v => setAdvanced3({ ...advanced3, elixChaos: v }))}
                      {renderInput('생명 엘릭서', advanced3.elixLife, v => setAdvanced3({ ...advanced3, elixLife: v }))}
                      {renderInput('부식 엘릭서', advanced3.elixDecay, v => setAdvanced3({ ...advanced3, elixDecay: v }))}
                    </div>
                  </div>
                  <div className="gold-advanced-section">
                    <h4>보유 영약</h4>
                    <div className="gold-input-grid">
                      {renderInput('불멸 재생', advanced3.potionImmortal, v => setAdvanced3({ ...advanced3, potionImmortal: v }))}
                      {renderInput('파동 장벽', advanced3.potionBarrier, v => setAdvanced3({ ...advanced3, potionBarrier: v }))}
                      {renderInput('타락 침식', advanced3.potionCorrupt, v => setAdvanced3({ ...advanced3, potionCorrupt: v }))}
                      {renderInput('생명 광란', advanced3.potionFrenzy, v => setAdvanced3({ ...advanced3, potionFrenzy: v }))}
                      {renderInput('맹독 파동', advanced3.potionVenom, v => setAdvanced3({ ...advanced3, potionVenom: v }))}
                    </div>
                  </div>
                </>
              )}
              <button className="gold-btn-calculate" onClick={calculate}>3성 최대 골드 계산</button>
            </div>

            {result3 && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>📊 최적 조합 결과{resultAll && !independentMode ? ' + 0성 포함' : ''}</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor((resultAll && !independentMode ? resultAll.summary.star3Gold : result3.best.gold) * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                <div className="gold-result-products">
                  <div><div className="product-name">{productNames['3'].A}</div><div className="product-count">{result3.best.AQUA}</div></div>
                  <div><div className="product-name">{productNames['3'].K}</div><div className="product-count">{result3.best.NAUTILUS}</div></div>
                  <div><div className="product-name">{productNames['3'].L}</div><div className="product-count">{result3.best.SPINE}</div></div>
                </div>

                {renderSectionWithImage('🔹 필요 엘릭서 ', [
                  { name: '수호', value: (result3.elixNeedProduct.guard), icon: '/img/ocean/elixir-guard.png' },
                  { name: '파동', value: (result3.elixNeedProduct.wave), icon: '/img/ocean/elixir-wave.png' },
                  { name: '혼란', value: (result3.elixNeedProduct.chaos), icon: '/img/ocean/elixir-chaos.png' },
                  { name: '생명', value: (result3.elixNeedProduct.life), icon: '/img/ocean/elixir-life.png' },
                  { name: '부식', value: (result3.elixNeedProduct.decay), icon: '/img/ocean/elixir-decay.png' }
                ])}
                {renderSectionWithImage('🔹 필요 영약 ', [
                  { name: '불멸 재생', value: result3.potionNeedProduct.immortal, icon: '/img/ocean/potion-immortal.png' },
                  { name: '파동 장벽', value: result3.potionNeedProduct.barrier, icon: '/img/ocean/potion-barrier.png' },
                  { name: '타락 침식', value: result3.potionNeedProduct.corrupt, icon: '/img/ocean/potion-corrupt.png' },
                  { name: '생명 광란', value: result3.potionNeedProduct.frenzy, icon: '/img/ocean/potion-frenzy.png' },
                  { name: '맹독 파동', value: result3.potionNeedProduct.venom, icon: '/img/ocean/potion-venom.png' }
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