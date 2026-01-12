'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { OCEAN_STAMINA_PER_GATHER, ROD_DATA, EXPERT_DEEP_SEA, EXPERT_STAR, EXPERT_CLAM_REFILL, FISH_DATA, FISH_IMAGES } from '@/data/ocean'

interface Input { id: number; stamina: string; fishType: string }
interface Result {
  fishType: string
  fishName: string
  star1: number
  star2: number
  star3: number
  clam: number
  totalDrops: number
  gatherCount: number
  starBonus: number
  clamBonusPercent: number
  deepSeaBonusPercent: number
}

// 등급별 분배 함수 (기존 JS와 동일)
function distributeByRarity(totalDrops: number, starLevel: number) {
  const starBonus = EXPERT_STAR[starLevel] || 0

  // 기본 가중치
  const base1 = 60
  const base2 = 30
  const base3 = 10

  // 3성 보너스는 "가중치"로 더함
  const bonusWeight = starBonus * 100

  const weight1 = base1
  const weight2 = base2
  const weight3 = base3 + bonusWeight

  const totalWeight = weight1 + weight2 + weight3

  const rate1 = weight1 / totalWeight
  const rate2 = weight2 / totalWeight
  const rate3 = weight3 / totalWeight

  let count1 = Math.floor(totalDrops * rate1)
  let count2 = Math.floor(totalDrops * rate2)
  let count3 = Math.floor(totalDrops * rate3)

  // 소수점 나머지 분배
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
  const [inputs, setInputs] = useState<Input[]>([{ id: 1, stamina: '', fishType: 'oyster' }])
  const [results, setResults] = useState<Result[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const addInput = () => setInputs([...inputs, { id: Date.now(), stamina: '', fishType: 'oyster' }])
  const removeInput = (id: number) => inputs.length > 1 && setInputs(inputs.filter(i => i.id !== id))
  const updateInput = (id: number, field: 'stamina' | 'fishType', value: string) => {
    setInputs(inputs.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const calculate = () => {
    const newResults: Result[] = []
    let total = 0

    for (const input of inputs) {
      const stamina = parseInt(input.stamina)
      if (!stamina || stamina <= 0) continue

      const rod = ROD_DATA[ocean.rodLevel] || ROD_DATA[1]
      const gatherCount = Math.floor(stamina / OCEAN_STAMINA_PER_GATHER)
      
      // 기본 드롭
      const dropsPerGather = rod.drop
      let totalDrops = gatherCount * dropsPerGather
      
      // 심해 채집꾼 보너스 (추가 드롭)
      const deepSeaBonus = EXPERT_DEEP_SEA[ocean.deepSea] || 0
      const deepSeaDrops = Math.floor(gatherCount * deepSeaBonus)
      totalDrops += deepSeaDrops
      
      // 등급별 분배
      const { count1, count2, count3, starBonus } = distributeByRarity(totalDrops, ocean.star)
      
      // 조개 계산
      const baseClamRate = rod.clamRate
      const clamRefillBonus = EXPERT_CLAM_REFILL[ocean.clamRefill] || 0
      const totalClamRate = baseClamRate + clamRefillBonus
      const clam = Math.floor(gatherCount * totalClamRate)
      
      total += totalDrops

      const fish = FISH_DATA[input.fishType]
      newResults.push({
        fishType: input.fishType, 
        fishName: fish.name,
        star1: count1,
        star2: count2,
        star3: count3,
        clam,
        totalDrops,
        gatherCount,
        starBonus,
        clamBonusPercent: Math.round(clamRefillBonus * 100),
        deepSeaBonusPercent: Math.round(deepSeaBonus * 100)
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  const fmt = (n: number) => n.toLocaleString()
  
  // 조개 기본 확률 표시용
  const baseClamRate = Math.round((ROD_DATA[ocean.rodLevel]?.clamRate || 0.01) * 100)

  return (
    <section className="content-area">
      <h2 className="content-title">스태미나 계산</h2>

      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              낚싯대 {ocean.rodLevel}강 · 심해 채집꾼 LV{ocean.deepSea} · 별별별 LV{ocean.star} · 조개리필 LV{ocean.clamRefill}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <div key={input.id} className="stamina-input-row">
                  <div className="stamina-input-group">
                    <span className="stamina-label">스태미나</span>
                    <input type="number" className="stamina-input" placeholder="3000" value={input.stamina}
                      onChange={(e) => updateInput(input.id, 'stamina', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && calculate()} />
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
              <button className="btn-calculate" onClick={calculate}>계산하기</button>
            </div>
          </div>
        </div>

        {showResult && results.length > 0 && (
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
                      <img
                        src={FISH_IMAGES[r.fishType]}
                        alt={r.fishName}
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
                      <span className="result-value primary">{fmt(r.star3)}{r.starBonus > 0 && <span className="result-detail">+{r.starBonus}%</span>}</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">조개</span>
                      <span className="result-value">{fmt(r.clam)}{r.clamBonusPercent > 0 && <span className="result-detail">+{r.clamBonusPercent}%</span>}</span>
                    </div>
                    <div className="result-row total">
                      <span className="result-label">합계</span>
                      <span className="result-value primary">{fmt(r.totalDrops)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {results[0] && (results[0].starBonus > 0 || results[0].clamBonusPercent > 0 || results[0].deepSeaBonusPercent > 0) && (
                <div className="bonus-summary">
                  <div className="bonus-summary-title">적용 보너스</div>
                  {results[0].starBonus > 0 && <>3성 확률 10% → <strong>{10 + results[0].starBonus}%</strong> (별별별 +{results[0].starBonus}%)</>}
                  {results[0].starBonus > 0 && results[0].clamBonusPercent > 0 && ' · '}
                  {results[0].clamBonusPercent > 0 && <>조개 확률 {baseClamRate}% → <strong>{baseClamRate + results[0].clamBonusPercent}%</strong> (리필 +{results[0].clamBonusPercent}%)</>}
                  {(results[0].starBonus > 0 || results[0].clamBonusPercent > 0) && results[0].deepSeaBonusPercent > 0 && ' · '}
                  {results[0].deepSeaBonusPercent > 0 && <>추가 드롭 <strong>+{results[0].deepSeaBonusPercent}%</strong></>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}