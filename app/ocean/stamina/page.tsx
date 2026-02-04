'use client'

import { useState, useEffect } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { 
  OCEAN_STAMINA_PER_GATHER, 
  ROD_DATA,
  EXPERT_DEEP_SEA, 
  EXPERT_STAR, 
  EXPERT_CLAM_REFILL, 
  FISH_DATA, 
  FISH_IMAGES 
} from '@/data/ocean'
import { 
  optimizeAllocation, 
  getEmptyInventory,
  type Inventory,
  type OptimizeResult 
} from './stamina-optimizer'

type FishType = keyof typeof FISH_DATA
type Mode = 'basic' | 'optimize'

interface Input { id: number; stamina: string; fishType: FishType }
interface Result {
  fishType: FishType
  fishName: string
  gatherCount: number
  star1: number
  star2: number
  star3: number
  clamCount: number
  totalDrops: number
  starBonus: number
  clamBonusPercent: number
  deepSeaBonusPercent: number
  baseClamRate: number
}

// localStorage 키
const GOLD_STORAGE_KEY = 'ocean-gold-data'
const STAMINA_STORAGE_KEY = 'ocean-stamina-data'

// 등급별 분배 함수
function distributeByRarity(totalDrops: number, starLevel: number) {
  const starBonus = EXPERT_STAR[starLevel] || 0
  const base1 = 60, base2 = 30, base3 = 10
  const bonusWeight = starBonus * 100
  const weight1 = base1, weight2 = base2, weight3 = base3 + bonusWeight
  const totalWeight = weight1 + weight2 + weight3
  const rate1 = weight1 / totalWeight, rate2 = weight2 / totalWeight, rate3 = weight3 / totalWeight

  let count1 = Math.floor(totalDrops * rate1)
  let count2 = Math.floor(totalDrops * rate2)
  let count3 = Math.floor(totalDrops * rate3)

  let remainder = totalDrops - (count1 + count2 + count3)
  const fracs = [
    { key: 'count3', frac: (totalDrops * rate3) % 1 },
    { key: 'count2', frac: (totalDrops * rate2) % 1 },
    { key: 'count1', frac: (totalDrops * rate1) % 1 },
  ].sort((a, b) => b.frac - a.frac)

  const counts: Record<string, number> = { count1, count2, count3 }
  for (let i = 0; i < remainder; i++) {
    counts[fracs[i % 3].key]++
  }

  return {
    count1: counts.count1,
    count2: counts.count2,
    count3: counts.count3,
    starBonus: Math.round(starBonus * 100),
  }
}

export default function OceanStaminaPage() {
  const { ocean } = useExpert()
  const [isLoaded, setIsLoaded] = useState(false)
  const [mode, setMode] = useState<Mode>('basic')
  
  // 기본 계산 상태
  const [inputs, setInputs] = useState<Input[]>([{ id: 1, stamina: '', fishType: 'oyster' }])
  const [results, setResults] = useState<Result[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  // 최적화 모드 상태
  const [optimizeStamina, setOptimizeStamina] = useState('')
  const [inventory, setInventory] = useState<Inventory>(getEmptyInventory())
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResult | null>(null)
  const [hasInventory, setHasInventory] = useState(false)

  // localStorage에서 스태미나 탭 상태 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STAMINA_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.mode) setMode(parsed.mode)
        if (parsed.inputs) setInputs(parsed.inputs)
        if (parsed.optimizeStamina) setOptimizeStamina(parsed.optimizeStamina)
      }
    } catch (e) {
      console.error('Failed to load stamina data:', e)
    }
    setIsLoaded(true)
  }, [])

  // 스태미나 탭 상태 저장
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STAMINA_STORAGE_KEY, JSON.stringify({
          mode,
          inputs,
          optimizeStamina
        }))
      } catch (e) {
        console.error('Failed to save stamina data:', e)
      }
    }
  }, [mode, inputs, optimizeStamina, isLoaded])

  // localStorage에서 보유량 불러오기
  useEffect(() => {
    if (!isLoaded) return
    try {
      const saved = localStorage.getItem(GOLD_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.shellfish) {
          setInventory({
            shellfish: parsed.shellfish,
            advanced1: parsed.advanced1 || getEmptyInventory().advanced1,
            advanced2: parsed.advanced2 || getEmptyInventory().advanced2,
            advanced3: parsed.advanced3 || getEmptyInventory().advanced3
          })
          // 보유량이 있는지 체크 (어패류 + 중간재료)
          const hasShellfish = Object.values(parsed.shellfish.star1).some((v: unknown) => (v as number) > 0) ||
                               Object.values(parsed.shellfish.star2).some((v: unknown) => (v as number) > 0) ||
                               Object.values(parsed.shellfish.star3).some((v: unknown) => (v as number) > 0)
          const hasAdvanced = parsed.advanced1 && Object.values(parsed.advanced1).some((v: unknown) => (v as number) > 0) ||
                              parsed.advanced2 && Object.values(parsed.advanced2).some((v: unknown) => (v as number) > 0) ||
                              parsed.advanced3 && Object.values(parsed.advanced3).some((v: unknown) => (v as number) > 0)
          setHasInventory(hasShellfish || hasAdvanced)
        }
      }
    } catch (e) {
      console.error('Failed to load inventory:', e)
    }
  }, [isLoaded, mode])

  // 기본 계산 함수들
  const addInput = () => setInputs([...inputs, { id: Date.now(), stamina: '', fishType: 'oyster' }])
  const removeInput = (id: number) => inputs.length > 1 && setInputs(inputs.filter(i => i.id !== id))
  const updateInput = (id: number, field: 'stamina' | 'fishType', value: string) => {
    if (field === 'fishType') {
      setInputs(inputs.map(i => i.id === id ? { ...i, fishType: value as FishType } : i))
    } else {
      setInputs(inputs.map(i => i.id === id ? { ...i, [field]: value } : i))
    }
  }

  const calculateBasic = () => {
    const newResults: Result[] = []
    let total = 0

    for (const input of inputs) {
      const stamina = parseInt(input.stamina)
      if (!stamina || stamina <= 0) continue

      const gatherCount = Math.floor(stamina / OCEAN_STAMINA_PER_GATHER)
      const rodStats = ROD_DATA[ocean.rodLevel] || ROD_DATA[1]
      let totalDrops = gatherCount * rodStats.drop
      
      const deepSeaBonus = EXPERT_DEEP_SEA[ocean.deepSea] || 0
      totalDrops += Math.floor(gatherCount * deepSeaBonus)
      
      const { count1, count2, count3, starBonus } = distributeByRarity(totalDrops, ocean.star)
      
      const baseClamRate = rodStats.clamRate
      const clamBonus = EXPERT_CLAM_REFILL[ocean.clamRefill] || 0
      const clamCount = Math.floor(gatherCount * (baseClamRate + clamBonus))
      
      total += totalDrops

      const fish = FISH_DATA[input.fishType]
      newResults.push({
        fishType: input.fishType, 
        fishName: fish.name,
        gatherCount,
        star1: count1, star2: count2, star3: count3,
        clamCount, totalDrops, starBonus,
        clamBonusPercent: Math.round(clamBonus * 100),
        deepSeaBonusPercent: Math.round(deepSeaBonus * 100),
        baseClamRate: Math.round(baseClamRate * 100)
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  // 최적화 계산 함수
  const calculateOptimize = () => {
    const stamina = parseInt(optimizeStamina)
    if (!stamina || stamina <= 0) {
      alert('스태미나를 입력해주세요.')
      return
    }

    const result = optimizeAllocation(stamina, inventory, {
      rodLevel: ocean.rodLevel,
      deepSea: ocean.deepSea,
      star: ocean.star,
      premiumPrice: ocean.premiumPrice
    })

    setOptimizeResult(result)
  }

  const fmt = (n: number) => n.toLocaleString()

  const getBonusTexts = (r: Result): string[] => {
    const texts: string[] = []
    if (r.starBonus > 0) texts.push(`3성 확률 10% → <strong>${10 + r.starBonus}%</strong> (별별별 +${r.starBonus}%)`)
    if (r.clamBonusPercent > 0) texts.push(`조개 확률 ${r.baseClamRate}% → <strong>${r.baseClamRate + r.clamBonusPercent}%</strong> (리필 +${r.clamBonusPercent}%)`)
    if (r.deepSeaBonusPercent > 0) texts.push(`추가 드롭 <strong>+${r.deepSeaBonusPercent}%</strong>`)
    return texts
  }

  const fishNames: Record<string, string> = {
    oyster: '굴', conch: '소라', octopus: '문어', seaweed: '미역', urchin: '성게'
  }

  return (
    <section className="ocean-page">
      <h2 className="content-title">스태미나 계산</h2>

      {!isLoaded ? (
        <div className="stamina-container">
          <div className="card">
            <div className="card-body" style={{ minHeight: '200px' }} />
          </div>
        </div>
      ) : (
      <div className="stamina-container">
        {/* 모드 토글 */}
        <div className="mode-toggle-container">
          <button 
            className={`mode-toggle-btn ${mode === 'basic' ? 'active' : ''}`}
            onClick={() => setMode('basic')}
          >
            기본 계산
          </button>
          <button 
            className={`mode-toggle-btn ${mode === 'optimize' ? 'active' : ''}`}
            onClick={() => setMode('optimize')}
          >
            최적 계산(TEST)
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              낚싯대 {ocean.rodLevel}강 · 심해 채집꾼 LV{ocean.deepSea} · 별별별 LV{ocean.star}
              {mode === 'optimize' && ` · 프리미엄 LV${ocean.premiumPrice}`}
            </div>

            {/* 기본 계산 모드 */}
            <div style={{ display: mode === 'basic' ? 'block' : 'none' }}>
              <div className="stamina-inputs-container">
                {inputs.map(input => (
                  <div key={input.id} className="stamina-input-row">
                    <div className="stamina-input-group">
                      <span className="stamina-label">스태미나</span>
                      <input type="number" className="stamina-input" placeholder="3000" value={input.stamina}
                        onChange={(e) => updateInput(input.id, 'stamina', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && calculateBasic()} />
                      <span className="stamina-label">어패류</span>
                      <select className="stamina-select" value={input.fishType}
                        onChange={(e) => updateInput(input.id, 'fishType', e.target.value)}>
                        <option value="oyster">굴</option>
                        <option value="conch">소라</option>
                        <option value="octopus">문어</option>
                        <option value="seaweed">미역</option>
                        <option value="urchin">성게</option>
                      </select>
                    </div>
                    {inputs.length > 1 && <button className="btn-remove" onClick={() => removeInput(input.id)}>×</button>}
                  </div>
                ))}
              </div>

              <div className="btn-actions">
                <button className="btn-add" onClick={addInput}>+ 추가</button>
                <button className="btn-calculate" onClick={calculateBasic}>계산하기</button>
              </div>
            </div>

            {/* 최적화 모드 */}
            <div style={{ display: mode === 'optimize' ? 'block' : 'none' }}>
              <div className="optimize-input-section">
                <div className="stamina-input-row">
                  <div className="stamina-input-group">
                    <span className="stamina-label">총 스태미나</span>
                    <input 
                      type="number" 
                      className="stamina-input optimize-stamina-input" 
                      placeholder="3000" 
                      value={optimizeStamina}
                      onChange={(e) => setOptimizeStamina(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && calculateOptimize()} 
                    />
                  </div>
                </div>

                {/* 보유량 상태 표시 */}
                <div className={`inventory-status ${hasInventory ? 'has-data' : 'no-data'}`}>
                  {hasInventory ? (
                    <>
                      <span className="status-icon">✓</span>
                      <span>연금품의 보유량이 적용됩니다</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">!</span>
                      <span>연금품이 초기화 상태입니다</span>
                    </>
                  )}
                </div>
              </div>

              <div className="btn-actions">
                <button className="btn-calculate" onClick={calculateOptimize}>최적 배분 계산</button>
              </div>
            </div>
          </div>
        </div>

        {/* 기본 계산 결과 */}
        {mode === 'basic' && showResult && results.length > 0 && (
          <div className="result-card">
            <div className="result-section-title">
              <span>예상 획득량</span>
              <span>총 {fmt(grandTotal)}개</span>
            </div>
            <div className="result-body">
              <div className="result-grid">
                {results.map((r, i) => (
                  <div key={i} className="result-section">
                    <div className="result-section-header">
                      <img src={FISH_IMAGES[r.fishType]} alt={r.fishName}
                        style={{ width: 22, height: 22, objectFit: 'contain' }}/>
                      {r.fishName}
                    </div>
                    <div className="result-row">
                      <span className="result-label">★</span>
                      <span className="result-value">{fmt(r.star1)}</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">★★</span>
                      <span className="result-value">{fmt(r.star2)}</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">★★★</span>
                      <span className="result-value primary">
                        {fmt(r.star3)}
                        {r.starBonus > 0 && <span className="result-detail">+{r.starBonus}%</span>}
                      </span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">조개</span>
                      <span className="result-value">
                        {fmt(r.clamCount)}
                        {r.clamBonusPercent > 0 && <span className="result-detail">+{r.clamBonusPercent}%</span>}
                      </span>
                    </div>
                    <div className="result-row total">
                      <span className="result-label">합계</span>
                      <span className="result-value primary">{fmt(r.totalDrops)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {results[0] && getBonusTexts(results[0]).length > 0 && (
                <div className="bonus-summary">
                  <div className="bonus-summary-title">적용 보너스</div>
                  {getBonusTexts(results[0]).map((text, i, arr) => (
                    <span key={i} dangerouslySetInnerHTML={{ __html: text + (i < arr.length - 1 ? ' · ' : '') }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 최적화 결과 */}
        {mode === 'optimize' && optimizeResult && (
          <div className="result-card optimize-result">
            <div className="result-section-title">
              <span>최적 배분 결과</span>
              <span>예상 {fmt(optimizeResult.totalGold)} G</span>
            </div>
            <div className="result-body">
              {/* 배분 권장 */}
              <div className="optimize-allocation">
                <div className="allocation-grid">
                  {(['oyster', 'conch', 'octopus', 'seaweed', 'urchin'] as const).map(fish => {
                    const stamina = optimizeResult.allocation[fish]
                    const gathers = optimizeResult.gatherCounts[fish]
                    if (stamina === 0) return null
                    return (
                      <div key={fish} className="allocation-item">
                        <img src={FISH_IMAGES[fish]} alt={fishNames[fish]}
                          style={{ width: 24, height: 24, objectFit: 'contain' }}/>
                        <div className="allocation-info">
                          <span className="allocation-name">{fishNames[fish]}</span>
                          <span className="allocation-value">{fmt(stamina)} ({gathers}회)</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 예상 드롭량 */}
              <div className="optimize-drops">
                <div className="optimize-section-title">예상 드롭량</div>
                <div className="drops-table">
                  <div className="drops-header">
                    <span></span>
                    <span>굴</span>
                    <span>소라</span>
                    <span>문어</span>
                    <span>미역</span>
                    <span>성게</span>
                  </div>
                  <div className="drops-row">
                    <span className="drops-label">★</span>
                    <span>{fmt(optimizeResult.drops.star1.guard)}</span>
                    <span>{fmt(optimizeResult.drops.star1.wave)}</span>
                    <span>{fmt(optimizeResult.drops.star1.chaos)}</span>
                    <span>{fmt(optimizeResult.drops.star1.life)}</span>
                    <span>{fmt(optimizeResult.drops.star1.decay)}</span>
                  </div>
                  <div className="drops-row">
                    <span className="drops-label">★★</span>
                    <span>{fmt(optimizeResult.drops.star2.guard)}</span>
                    <span>{fmt(optimizeResult.drops.star2.wave)}</span>
                    <span>{fmt(optimizeResult.drops.star2.chaos)}</span>
                    <span>{fmt(optimizeResult.drops.star2.life)}</span>
                    <span>{fmt(optimizeResult.drops.star2.decay)}</span>
                  </div>
                  <div className="drops-row">
                    <span className="drops-label">★★★</span>
                    <span>{fmt(optimizeResult.drops.star3.guard)}</span>
                    <span>{fmt(optimizeResult.drops.star3.wave)}</span>
                    <span>{fmt(optimizeResult.drops.star3.chaos)}</span>
                    <span>{fmt(optimizeResult.drops.star3.life)}</span>
                    <span>{fmt(optimizeResult.drops.star3.decay)}</span>
                  </div>
                </div>
              </div>

              {/* 예상 제작 & 골드 */}
              <div className="optimize-gold">
                <div className="optimize-section-title">예상 제작 + 수익</div>
                <div className="gold-breakdown">
                  {optimizeResult.productCounts.dilution > 0 && (
                    <div className="gold-row">
                      <span className="gold-label">희석액</span>
                      <span className="gold-count">{optimizeResult.productCounts.dilution}개</span>
                      <span className="gold-value">{fmt(optimizeResult.goldBreakdown.dilution)}</span>
                    </div>
                  )}
                  {(optimizeResult.productCounts.star1.A > 0 || optimizeResult.productCounts.star1.K > 0 || optimizeResult.productCounts.star1.L > 0) && (
                    <div className="gold-row">
                      <span className="gold-label">1성</span>
                      <span className="gold-count">
                        아쿠티스{optimizeResult.productCounts.star1.A} 광란체{optimizeResult.productCounts.star1.K} 깃털{optimizeResult.productCounts.star1.L}
                      </span>
                      <span className="gold-value">{fmt(optimizeResult.goldBreakdown.star1)}</span>
                    </div>
                  )}
                  {(optimizeResult.productCounts.star2.CORE > 0 || optimizeResult.productCounts.star2.POTION > 0 || optimizeResult.productCounts.star2.WING > 0) && (
                    <div className="gold-row">
                      <span className="gold-label">2성</span>
                      <span className="gold-count">
                        코어{optimizeResult.productCounts.star2.CORE} 침묵{optimizeResult.productCounts.star2.POTION} 날개{optimizeResult.productCounts.star2.WING}
                      </span>
                      <span className="gold-value">{fmt(optimizeResult.goldBreakdown.star2)}</span>
                    </div>
                  )}
                  {(optimizeResult.productCounts.star3.AQUA > 0 || optimizeResult.productCounts.star3.NAUTILUS > 0 || optimizeResult.productCounts.star3.SPINE > 0) && (
                    <div className="gold-row">
                      <span className="gold-label">3성</span>
                      <span className="gold-count">
                        파편{optimizeResult.productCounts.star3.AQUA} 손{optimizeResult.productCounts.star3.NAUTILUS} 척추{optimizeResult.productCounts.star3.SPINE}
                      </span>
                      <span className="gold-value">{fmt(optimizeResult.goldBreakdown.star3)}</span>
                    </div>
                  )}
                  <div className="gold-row total">
                    <span className="gold-label">총 수익</span>
                    <span></span>
                    <span className="gold-value primary">{fmt(optimizeResult.totalGold)} G</span>
                  </div>
                </div>
              </div>

              <div className="optimize-note">
                보유량 + 예상 드롭량을 기반으로 계산합니다
                <br/>
                확률 기반 기댓값 계산 결과이므로 실제 골드 수익은 달라질 수 있습니다
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </section>
  )
}