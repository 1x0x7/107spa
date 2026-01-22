'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { 
  MINING_STAMINA_PER_MINE, 
  PICKAXE_STATS, 
  EXPERT_COBI, 
  EXPERT_LUCKY, 
  EXPERT_FIRE_PICK, 
  EXPERT_GEM_START, 
  ORE_DATA,
  MINING_IMAGES
} from '@/data/mining'

type OreType = keyof typeof ORE_DATA

interface Input { id: number; stamina: string; oreType: OreType }
interface Result {
  oreType: OreType
  oreName: string
  gemName: string
  mineCount: number
  baseOre: number
  luckyOre: number
  totalOre: number
  totalIngot: number
  totalGem: number
  relicProcs: number
  cobiProcs: number
  total: number
  // 보너스 정보
  luckyRate: number
  fireRate: number
  gemRate: number
  cobiBaseRate: number
  cobiExpertRate: number
  relicRate: number
}

export default function MiningStaminaPage() {
  const { mining } = useExpert()
  const [inputs, setInputs] = useState<Input[]>([{ id: 1, stamina: '', oreType: 'corum' }])
  const [results, setResults] = useState<Result[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const addInput = () => setInputs([...inputs, { id: Date.now(), stamina: '', oreType: 'corum' }])
  const removeInput = (id: number) => inputs.length > 1 && setInputs(inputs.filter(i => i.id !== id))
  const updateInput = (id: number, field: 'stamina' | 'oreType', value: string) => {
    if (field === 'oreType') {
      setInputs(inputs.map(i => i.id === id ? { ...i, oreType: value as OreType } : i))
    } else {
      setInputs(inputs.map(i => i.id === id ? { ...i, [field]: value } : i))
    }
  }

  const calculate = () => {
    const newResults: Result[] = []
    let total = 0

    for (const input of inputs) {
      const stamina = parseInt(input.stamina)
      if (!stamina || stamina <= 0) continue

      const pickaxeStats = PICKAXE_STATS[mining.pickaxeLevel] || PICKAXE_STATS[1]
      const mineCount = Math.floor(stamina / MINING_STAMINA_PER_MINE)
      
      // 기본 광물 드롭
      const baseOre = mineCount * pickaxeStats.drops

      // 럭키 히트 (광석 추가)
      const luckyData = EXPERT_LUCKY[mining.lucky] || { rate: 0, count: 0 }
      const luckyProcs = Math.floor(mineCount * luckyData.rate)
      const luckyOre = luckyProcs * luckyData.count
      const totalOre = baseOre + luckyOre

      // 불붙은 곡괭이 (주괴 드롭)
      const fireData = EXPERT_FIRE_PICK[mining.firePick] || { rate: 0, count: 0 }
      const fireProcs = Math.floor(mineCount * fireData.rate)
      const totalIngot = fireProcs * fireData.count

      // 반짝임의 시작 (보석 드롭)
      const gemData = EXPERT_GEM_START[mining.gemStart] || { rate: 0, count: 0 }
      const gemProcs = Math.floor(mineCount * gemData.rate)
      const totalGem = gemProcs * gemData.count

      // 유물 (곡괭이 기본 확률)
      const relicProcs = Math.floor(mineCount * pickaxeStats.relic)

      // 코비 (곡괭이 기본 + 코비타임)
      const cobiBaseRate = pickaxeStats.cobi
      const cobiExpertRate = EXPERT_COBI[mining.cobi] || 0
      const totalCobiRate = cobiBaseRate + cobiExpertRate
      const cobiProcs = Math.floor(mineCount * totalCobiRate)

      // 총합 (광물 + 주괴 + 보석)
      const itemTotal = totalOre + totalIngot + totalGem
      total += itemTotal

      const ore = ORE_DATA[input.oreType]
      newResults.push({
        oreType: input.oreType,
        oreName: ore.name,
        gemName: ore.gemName,
        mineCount,
        baseOre,
        luckyOre,
        totalOre,
        totalIngot,
        totalGem,
        relicProcs,
        cobiProcs,
        total: itemTotal,
        luckyRate: Math.round(luckyData.rate * 100),
        fireRate: Math.round(fireData.rate * 100),
        gemRate: Math.round(gemData.rate * 100),
        cobiBaseRate: Math.round(cobiBaseRate * 100),
        cobiExpertRate: Math.round(cobiExpertRate * 100),
        relicRate: Math.round(pickaxeStats.relic * 100)
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  const fmt = (n: number) => n.toLocaleString()

  return (
    <section className="mining-page">
      <h2 className="content-title">스태미나 계산</h2>

      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              곡괭이 {mining.pickaxeLevel}강 · 코비타임 LV{mining.cobi} · 럭키 히트 LV{mining.lucky} · 불붙은 곡괭이 LV{mining.firePick} · 반짝임의 시작 LV{mining.gemStart}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <div key={input.id} className="stamina-input-row">
                  <div className="stamina-input-group">
                    <span className="stamina-label">스태미나</span>
                    <input type="number" className="stamina-input" placeholder="3300" value={input.stamina}
                      onChange={(e) => updateInput(input.id, 'stamina', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && calculate()} />
                    <span className="stamina-label">광물</span>
                    <select className="stamina-select" value={input.oreType}
                      onChange={(e) => updateInput(input.id, 'oreType', e.target.value)}>
                      <option value="corum">코룸</option>
                      <option value="lifton">리프톤</option>
                      <option value="serent">세렌트</option>
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
                        src={MINING_IMAGES[r.oreType]}
                        alt={r.oreName}
                        style={{ width: 22, height: 22, objectFit: 'contain' }}
                      />
                      {r.oreName}
                    </div>
                    <div className="result-row">
                      <span className="result-label">광물</span>
                      <span className="result-value">
                        {fmt(r.baseOre)}
                        {r.luckyOre > 0 && <span className="result-detail bonus">+{r.luckyOre}</span>}
                      </span>
                    </div>
                    {r.totalIngot > 0 && (
                      <div className="result-row">
                        <span className="result-label">주괴</span>
                        <span className="result-value primary">
                          {fmt(r.totalIngot)}
                          <span className="result-detail">+{r.fireRate}%</span>
                        </span>
                      </div>
                    )}
                    <div className="result-row">
                      <span className="result-label">{r.gemName}</span>
                      <span className="result-value">
                        {fmt(r.totalGem)}
                        {r.gemRate > 0 && <span className="result-detail">+{r.gemRate}%</span>}
                      </span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">유물</span>
                      <span className="result-value">
                        {fmt(r.relicProcs)}
                        {r.relicRate > 0 && <span className="result-detail">+{r.relicRate}%</span>}
                      </span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">코비</span>
                      <span className="result-value">
                        {fmt(r.cobiProcs)}
                        {(r.cobiBaseRate + r.cobiExpertRate) > 0 && <span className="result-detail">+{r.cobiBaseRate + r.cobiExpertRate}%</span>}
                      </span>
                    </div>
                    <div className="result-row total">
                      <span className="result-label">합계</span>
                      <span className="result-value primary">{fmt(r.total)}</span>
                    </div>
                    <div className="result-row" style={{ fontSize: 11, marginTop: 4 }}>
                      <span className="result-label" style={{ color: 'var(--color-text-muted)' }}>주괴 환산</span>
                      <span className="result-value" style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{fmt(Math.floor(r.totalOre / 16))}개</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 보너스 요약 */}
              {results[0] && (results[0].luckyRate > 0 || results[0].fireRate > 0 || results[0].gemRate > 0 || results[0].cobiExpertRate > 0) && (
                <div className="bonus-summary">
                  <div className="bonus-summary-title">적용 보너스</div>
                  {[
                    results[0].luckyRate > 0 && `광물 추가 0% → <strong>${results[0].luckyRate}%</strong> (럭키 히트 +${results[0].luckyRate}%)`,
                    results[0].fireRate > 0 && `주괴 추가 0% → <strong>${results[0].fireRate}%</strong> (불붙은 곡괭이 +${results[0].fireRate}%)`,
                    results[0].gemRate > 0 && `보석 추가 0% → <strong>${results[0].gemRate}%</strong> (반짝임의 시작 +${results[0].gemRate}%)`,
                    results[0].cobiExpertRate > 0 && `코비 확률 ${results[0].cobiBaseRate}% → <strong>${results[0].cobiBaseRate + results[0].cobiExpertRate}%</strong> (코비타임 +${results[0].cobiExpertRate}%)`
                  ].filter(Boolean).map((text, i, arr) => (
                    <span key={i} dangerouslySetInnerHTML={{ __html: text + (i < arr.length - 1 ? ' · ' : '') }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}