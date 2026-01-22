'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { 
  calculate1Star, calculate2Star, calculate3Star, calculateAll,
  PREMIUM_PRICE_RATE,
  Result1Star, Result2Star, Result3Star, ResultAll
} from './ocean-calculator'
import './ocean-gold.css'

type StarLevel = 'all' | '1' | '2' | '3'

export default function OceanGoldPage() {
  const { ocean } = useExpert()
  const [starLevel, setStarLevel] = useState<StarLevel>('all')
  const [advancedMode, setAdvancedMode] = useState(false)
  const [setMode, setSetMode] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
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

  const fmt = (n: number) => n.toLocaleString()
  const getPremiumRate = () => PREMIUM_PRICE_RATE[ocean.premiumPrice] || 0
  
  // 2개 단위로 올림 (정수/에센스/엘릭서는 2개씩 제작되므로)
  const ceilToTwo = (n: number) => Math.ceil(n / 2) * 2
  
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

  const calculate = () => {
    if (starLevel === 'all') {
      const res = calculateAll(shellfish)
      if (res.totalGold === 0) { alert('재료가 부족합니다'); return }
      setResultAll(res)
    } else if (starLevel === '1') {
      // 모든 성급 입력 시 희석액 포함 계산
      if (hasAllTiers()) {
        const resAll = calculateAll(shellfish)
        if (resAll.result1) {
          setResult1(resAll.result1)
          setResultAll(resAll)
        } else {
          alert('재료가 부족합니다'); return
        }
      } else {
        // 1성만 독립 계산
        const res = calculate1Star({ 
          ...shellfish.star1, 
          ...(advancedMode ? advanced1 : {})
        }, advancedMode)
        if (!res) { alert('재료가 부족합니다'); return }
        setResult1(res)
        setResultAll(null)
      }
    } else if (starLevel === '2') {
      if (hasAllTiers()) {
        const resAll = calculateAll(shellfish)
        if (resAll.result2) {
          setResult2(resAll.result2)
          setResultAll(resAll)
        } else {
          alert('재료가 부족합니다'); return
        }
      } else {
        const res = calculate2Star({ 
          guard2: shellfish.star2.guard, wave2: shellfish.star2.wave,
          chaos2: shellfish.star2.chaos, life2: shellfish.star2.life, decay2: shellfish.star2.decay,
          ...(advancedMode ? advanced2 : {})
        }, advancedMode)
        if (!res) { alert('재료가 부족합니다'); return }
        setResult2(res)
        setResultAll(null)
      }
    } else if (starLevel === '3') {
      if (hasAllTiers()) {
        const resAll = calculateAll(shellfish)
        if (resAll.result3) {
          setResult3(resAll.result3)
          setResultAll(resAll)
        } else {
          alert('재료가 부족합니다'); return
        }
      } else {
        const res = calculate3Star({ 
          ...shellfish.star3, 
          ...(advancedMode ? advanced3 : {})
        }, advancedMode)
        if (!res) { alert('재료가 부족합니다'); return }
        setResult3(res)
        setResultAll(null)
      }
    }
  }

  // 전체 초기화
  const resetAll = () => {
    setShellfish({
      star1: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
      star2: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 },
      star3: { guard: 0, wave: 0, chaos: 0, life: 0, decay: 0 }
    })
    setResult1(null)
    setResult2(null)
    setResult3(null)
    setResultAll(null)
  }

  const productNames = {
    '1': { A: '영생의 아쿠티스', K: '크라켄의 광란체', L: '리바이던의 깃털' },
    '2': { A: '해구의 파동 코어', K: '침묵의 심해 비약', L: '청해룡의 날개' },
    '3': { A: '아쿠아 펄스 파편', K: '나우틸러스의 손', L: '무저의 척추' }
  }

  const renderInput = (label: string, value: number, onChange: (v: number) => void) => (
    <label className="gold-input-label">
      <span>{label}</span>
      <input type="number" min={0} value={value || ''} onChange={(e) => onChange(parseInt(e.target.value) || 0)} />
    </label>
  )

  const renderSectionWithImage = (title: string, items: { name: string; value: number; icon?: string }[]) => {
    const filtered = items.filter(i => i.value > 0)
    if (filtered.length === 0) return null
    return (
      <div className="gold-result-section">
        <h5>{title}</h5>
        <div className="gold-material-tags with-image">
          {filtered.map((item, idx) => (
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

  const renderSection = (title: string, items: { name: string; value: number }[]) => {
    const filtered = items.filter(i => i.value > 0)
    if (filtered.length === 0) return null
    return (
      <div className="gold-result-section">
        <h5>{title}</h5>
        <div className="gold-material-tags">
          {filtered.map((item, idx) => (
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
              {s === 'all' ? '📊 통합' : `${s}성`}
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
              <div className="switch-wrapper">
                <span className="switch-label" onClick={() => setAdvancedMode(v => !v)}>보유량 입력</span>
                <div className="switcher">
                  <input type="checkbox" id="advanced-mode-switch" checked={advancedMode} onChange={(e) => setAdvancedMode(e.target.checked)} />
                  <label htmlFor="advanced-mode-switch" className="switch_label"><span className="onf_btn" /></label>
                </div>
              </div>
            )}
            <button type="button" className="gold-reset-btn" onClick={resetAll}>
              초기화
            </button>
          </div>
        </div>

        {/* 통합 계산기 */}
        {starLevel === 'all' && (
          <div className="gold-card">
            <div className="gold-card-header">📊 통합 계산기</div>
            <div className="gold-card-body">
              <div className="gold-advanced-section">
                <h4>1성 어패류</h4>
                <div className="gold-input-grid">
                  {renderInput('굴 ★', shellfish.star1.guard, v => updateShellfish('star1', 'guard', v))}
                  {renderInput('소라 ★', shellfish.star1.wave, v => updateShellfish('star1', 'wave', v))}
                  {renderInput('문어 ★', shellfish.star1.chaos, v => updateShellfish('star1', 'chaos', v))}
                  {renderInput('미역 ★', shellfish.star1.life, v => updateShellfish('star1', 'life', v))}
                  {renderInput('성게 ★', shellfish.star1.decay, v => updateShellfish('star1', 'decay', v))}
                </div>
              </div>
              <div className="gold-advanced-section">
                <h4>2성 어패류</h4>
                <div className="gold-input-grid">
                  {renderInput('굴 ★★', shellfish.star2.guard, v => updateShellfish('star2', 'guard', v))}
                  {renderInput('소라 ★★', shellfish.star2.wave, v => updateShellfish('star2', 'wave', v))}
                  {renderInput('문어 ★★', shellfish.star2.chaos, v => updateShellfish('star2', 'chaos', v))}
                  {renderInput('미역 ★★', shellfish.star2.life, v => updateShellfish('star2', 'life', v))}
                  {renderInput('성게 ★★', shellfish.star2.decay, v => updateShellfish('star2', 'decay', v))}
                </div>
              </div>
              <div className="gold-advanced-section">
                <h4>3성 어패류</h4>
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
            {resultAll && (
              <div className="gold-result-card">
                <div className="gold-result-header">
                  <h4>📊 최적 분배 결과</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor(resultAll.totalGold * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                {/* 4열 그리드 결과 */}
                <div className="gold-unified-grid">
                  {/* 희석액 (0성) */}
                  <div className="gold-unified-col">
                    <div className="unified-tier-label">희석액 (0성)</div>
                    <div className="unified-products">
                      <div className="unified-product-row">
                        <span>희석된 추출액</span>
                        <strong>{resultAll.dilution}개</strong>
                      </div>
                    </div>
                    <div className="unified-gold">{fmt(Math.floor(resultAll.summary.dilutionGold * (1 + getPremiumRate())))}G</div>
                  </div>

                  {/* 1성 */}
                  <div className="gold-unified-col">
                    <div className="unified-tier-label">1성</div>
                    <div className="unified-products">
                      <div className="unified-product-row">
                        <span>아쿠티스</span>
                        <strong>{resultAll.result1?.best.A || 0}개</strong>
                      </div>
                      <div className="unified-product-row">
                        <span>광란체</span>
                        <strong>{resultAll.result1?.best.K || 0}개</strong>
                      </div>
                      <div className="unified-product-row">
                        <span>깃털</span>
                        <strong>{resultAll.result1?.best.L || 0}개</strong>
                      </div>
                    </div>
                    <div className="unified-gold">{fmt(Math.floor(resultAll.summary.star1Gold * (1 + getPremiumRate())))}G</div>
                  </div>

                  {/* 2성 */}
                  <div className="gold-unified-col">
                    <div className="unified-tier-label">2성</div>
                    <div className="unified-products">
                      <div className="unified-product-row">
                        <span>파동 코어</span>
                        <strong>{resultAll.result2?.best.CORE || 0}개</strong>
                      </div>
                      <div className="unified-product-row">
                        <span>심해 비약</span>
                        <strong>{resultAll.result2?.best.POTION || 0}개</strong>
                      </div>
                      <div className="unified-product-row">
                        <span>청해 날개</span>
                        <strong>{resultAll.result2?.best.WING || 0}개</strong>
                      </div>
                    </div>
                    <div className="unified-gold">{fmt(Math.floor(resultAll.summary.star2Gold * (1 + getPremiumRate())))}G</div>
                  </div>

                  {/* 3성 */}
                  <div className="gold-unified-col">
                    <div className="unified-tier-label">3성</div>
                    <div className="unified-products">
                      <div className="unified-product-row">
                        <span>아쿠아 파편</span>
                        <strong>{resultAll.result3?.best.AQUA || 0}개</strong>
                      </div>
                      <div className="unified-product-row">
                        <span>나우틸 손</span>
                        <strong>{resultAll.result3?.best.NAUTILUS || 0}개</strong>
                      </div>
                      <div className="unified-product-row">
                        <span>무저 척추</span>
                        <strong>{resultAll.result3?.best.SPINE || 0}개</strong>
                      </div>
                    </div>
                    <div className="unified-gold">{fmt(Math.floor(resultAll.summary.star3Gold * (1 + getPremiumRate())))}G</div>
                  </div>
                </div>

                {/* 희석액 필요 재료 */}
                {resultAll.dilution > 0 && (
                  <div className="gold-dilution-materials">
                    <h5>🧪 희석액 필요 재료 ({resultAll.dilution}개)</h5>
                    
                    {/* 어패류 */}
                    <div className="dilution-section">
                      <h6>필요 어패류</h6>
                      <div className="dilution-material-row">
                        {renderSection('1성 어패류', [
                          { name: '성게 ★', value: resultAll.dilution * 4 },
                          { name: '굴 ★', value: resultAll.dilution * 4 }
                        ])}
                        {renderSection('2성 어패류', [
                          { name: '굴 ★★', value: resultAll.dilution * 2 },
                          { name: '문어 ★★', value: resultAll.dilution * 2 }
                        ])}
                        {renderSection('3성 어패류', [
                          { name: '문어 ★★★', value: resultAll.dilution * 1 },
                          { name: '성게 ★★★', value: resultAll.dilution * 1 }
                        ])}
                      </div>
                    </div>

                    {/* 부가 재료 */}
                    <div className="dilution-section">
                      <h6>필요 부가 재료</h6>
                      <div className="dilution-material-row">
                        {renderSection('1성 (정수/핵)', [
                          { name: '부식의 정수', value: resultAll.dilution * 2 },
                          { name: '수호의 정수', value: resultAll.dilution * 2 },
                          { name: '침식방어 핵', value: resultAll.dilution * 1 }
                        ])}
                        {renderSection('2성 (에센스/결정)', [
                          { name: '수호 에센스', value: resultAll.dilution * 2 },
                          { name: '혼란 에센스', value: resultAll.dilution * 2 },
                          { name: '방어오염 결정', value: resultAll.dilution * 1 }
                        ])}
                        {renderSection('3성 (엘릭서/영약)', [
                          { name: '혼란 엘릭서', value: resultAll.dilution * 1 },
                          { name: '부식 엘릭서', value: resultAll.dilution * 1 },
                          { name: '타락침식 영약', value: resultAll.dilution * 1 }
                        ])}
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
                  <h4>📊 최적 조합 결과{resultAll ? ' (희석액 포함)' : ''}</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor((resultAll ? resultAll.summary.star1Gold : result1.best.gold) * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                <div className="gold-result-products">
                  <div><div className="product-name">{productNames['1'].A}</div><div className="product-count">{result1.best.A}</div></div>
                  <div><div className="product-name">{productNames['1'].K}</div><div className="product-count">{result1.best.K}</div></div>
                  <div><div className="product-name">{productNames['1'].L}</div><div className="product-count">{result1.best.L}</div></div>
                </div>

                {renderSectionWithImage('🔹 필요 정수', [
                  { name: '수호', value: ceilToTwo(result1.essNeedTotal.guard), icon: '/img/ocean/essence_guard.png' },
                  { name: '파동', value: ceilToTwo(result1.essNeedTotal.wave), icon: '/img/ocean/essence_wave.png' },
                  { name: '혼란', value: ceilToTwo(result1.essNeedTotal.chaos), icon: '/img/ocean/essence_chaos.png' },
                  { name: '생명', value: ceilToTwo(result1.essNeedTotal.life), icon: '/img/ocean/essence_life.png' },
                  { name: '부식', value: ceilToTwo(result1.essNeedTotal.decay), icon: '/img/ocean/essence_decay.png' }
                ])}
                {renderSectionWithImage('🔹 필요 핵', [
                  { name: '파동수호', value: result1.coreNeed.WG, icon: '/img/ocean/core_wg.png' },
                  { name: '파동생명', value: result1.coreNeed.WP, icon: '/img/ocean/core_wp.png' },
                  { name: '혼란부식', value: result1.coreNeed.OD, icon: '/img/ocean/core_od.png' },
                  { name: '생명부식', value: result1.coreNeed.VD, icon: '/img/ocean/core_vd.png' },
                  { name: '침식방어', value: result1.coreNeed.ED, icon: '/img/ocean/core_ed.png' }
                ])}
                {renderSection('🔹 필요 블록', [
                  { name: '점토', value: result1.blockNeedTotal.clay },
                  { name: '모래', value: result1.blockNeedTotal.sand },
                  { name: '흙', value: result1.blockNeedTotal.dirt },
                  { name: '자갈', value: result1.blockNeedTotal.gravel },
                  { name: '화강암', value: result1.blockNeedTotal.granite }
                ])}
                {renderSection('🔹 필요 물고기', [
                  { name: '새우', value: result1.fishNeedTotal.shrimp },
                  { name: '도미', value: result1.fishNeedTotal.domi },
                  { name: '청어', value: result1.fishNeedTotal.herring },
                  { name: '금붕어', value: result1.fishNeedTotal.goldfish },
                  { name: '농어', value: result1.fishNeedTotal.bass }
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
                  <h4>📊 최적 조합 결과{resultAll ? ' (희석액 포함)' : ''}</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor((resultAll ? resultAll.summary.star2Gold : result2.best.gold) * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                <div className="gold-result-products">
                  <div><div className="product-name">{productNames['2'].A}</div><div className="product-count">{result2.best.CORE}</div></div>
                  <div><div className="product-name">{productNames['2'].K}</div><div className="product-count">{result2.best.POTION}</div></div>
                  <div><div className="product-name">{productNames['2'].L}</div><div className="product-count">{result2.best.WING}</div></div>
                </div>

                {renderSectionWithImage('🔹 필요 에센스', [
                  { name: '수호', value: ceilToTwo(result2.essNeedTotal.guard), icon: '/img/ocean/essence_guard_2.png' },
                  { name: '파동', value: ceilToTwo(result2.essNeedTotal.wave), icon: '/img/ocean/essence_wave_2.png' },
                  { name: '혼란', value: ceilToTwo(result2.essNeedTotal.chaos), icon: '/img/ocean/essence_chaos_2.png' },
                  { name: '생명', value: ceilToTwo(result2.essNeedTotal.life), icon: '/img/ocean/essence_life_2.png' },
                  { name: '부식', value: ceilToTwo(result2.essNeedTotal.decay), icon: '/img/ocean/essence_decay_2.png' }
                ])}
                {renderSectionWithImage('🔹 필요 결정', [
                  { name: '활기보존', value: result2.crystalNeed.vital, icon: '/img/ocean/crystal_vital.png' },
                  { name: '파도침식', value: result2.crystalNeed.erosion, icon: '/img/ocean/crystal_erosion.png' },
                  { name: '방어오염', value: result2.crystalNeed.defense, icon: '/img/ocean/crystal_defense.png' },
                  { name: '격류재생', value: result2.crystalNeed.regen, icon: '/img/ocean/crystal_regen.png' },
                  { name: '맹독혼란', value: result2.crystalNeed.poison, icon: '/img/ocean/crystal_poison.png' }
                ])}
                {renderSection('🔹 필요 재료', [
                  { name: '해초', value: result2.materialNeedTotal.seaweed },
                  { name: '켈프', value: result2.materialNeedTotal.kelp }
                ])}
                {renderSection('🔹 필요 광물', [
                  { name: '청금석 블록', value: result2.materialNeedTotal.lapisBlock },
                  { name: '레드스톤 블록', value: result2.materialNeedTotal.redstoneBlock },
                  { name: '철 주괴', value: result2.materialNeedTotal.ironIngot },
                  { name: '금 주괴', value: result2.materialNeedTotal.goldIngot },
                  { name: '다이아몬드', value: result2.materialNeedTotal.diamond }
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
                  <h4>📊 최적 조합 결과{resultAll ? ' (희석액 포함)' : ''}</h4>
                  <div className="gold-result-gold">
                    💰 {fmt(Math.floor((resultAll ? resultAll.summary.star3Gold : result3.best.gold) * (1 + getPremiumRate())))}
                    {getPremiumRate() > 0 && <small>+{Math.round(getPremiumRate() * 100)}%</small>}
                  </div>
                </div>

                <div className="gold-result-products">
                  <div><div className="product-name">{productNames['3'].A}</div><div className="product-count">{result3.best.AQUA}</div></div>
                  <div><div className="product-name">{productNames['3'].K}</div><div className="product-count">{result3.best.NAUTILUS}</div></div>
                  <div><div className="product-name">{productNames['3'].L}</div><div className="product-count">{result3.best.SPINE}</div></div>
                </div>

                {renderSectionWithImage('🔹 필요 엘릭서', [
                  { name: '수호', value: ceilToTwo(result3.elixNeedTotal.guard), icon: '/img/ocean/elixir-guard.png' },
                  { name: '파동', value: ceilToTwo(result3.elixNeedTotal.wave), icon: '/img/ocean/elixir-wave.png' },
                  { name: '혼란', value: ceilToTwo(result3.elixNeedTotal.chaos), icon: '/img/ocean/elixir-chaos.png' },
                  { name: '생명', value: ceilToTwo(result3.elixNeedTotal.life), icon: '/img/ocean/elixir-life.png' },
                  { name: '부식', value: ceilToTwo(result3.elixNeedTotal.decay), icon: '/img/ocean/elixir-decay.png' }
                ])}
                {renderSectionWithImage('🔹 필요 영약', [
                  { name: '불멸재생', value: result3.potionNeed.immortal, icon: '/img/ocean/potion-immortal.png' },
                  { name: '파동장벽', value: result3.potionNeed.barrier, icon: '/img/ocean/potion-barrier.png' },
                  { name: '타락침식', value: result3.potionNeed.corrupt, icon: '/img/ocean/potion-corrupt.png' },
                  { name: '생명광란', value: result3.potionNeed.frenzy, icon: '/img/ocean/potion-frenzy.png' },
                  { name: '맹독파동', value: result3.potionNeed.venom, icon: '/img/ocean/potion-venom.png' }
                ])}
                {renderSection('🔹 필요 재료', [
                  { name: '불우렁쉥이', value: result3.materialNeedTotal.seaSquirt },
                  { name: '유리병', value: result3.materialNeedTotal.glassBottle },
                  { name: '말린 켈프', value: result3.materialNeedTotal.driedKelp },
                  { name: '발광 열매', value: result3.materialNeedTotal.glowBerry }
                ])}
                {renderSection('🔹 필요 산호', [
                  { name: '죽은 관 산호', value: result3.deadCoralNeedTotal.deadTubeCoral },
                  { name: '죽은 사방산호', value: result3.deadCoralNeedTotal.deadBrainCoral },
                  { name: '죽은 거품 산호', value: result3.deadCoralNeedTotal.deadBubbleCoral },
                  { name: '죽은 불 산호', value: result3.deadCoralNeedTotal.deadFireCoral },
                  { name: '죽은 뇌 산호', value: result3.deadCoralNeedTotal.deadHornCoral }
                ])}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}