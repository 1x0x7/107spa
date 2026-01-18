'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { MINING_STAMINA_PER_MINE, PICKAXE_STATS, EXPERT_COBI, EXPERT_LUCKY, EXPERT_FIRE_PICK, EXPERT_GEM_START, ORE_DATA } from '@/data/mining'

type OreType = keyof typeof ORE_DATA

interface Input { id: number; stamina: string; oreType: OreType }
interface Result {
  oreName: string; gemName: string; baseOre: number; luckyOre: number; totalOre: number;
  totalIngot: number; totalGem: number; relicProcs: number; cobiProcs: number; total: number; mineCount: number;
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

      const stats = PICKAXE_STATS[mining.pickaxeLevel] || PICKAXE_STATS[1]
      const mineCount = Math.floor(stamina / MINING_STAMINA_PER_MINE)
      const baseOre = mineCount * stats.drops

      const lucky = EXPERT_LUCKY[mining.lucky] || { rate: 0, count: 0 }
      const luckyOre = Math.floor(mineCount * lucky.rate) * lucky.count

      const fire = EXPERT_FIRE_PICK[mining.firePick] || { rate: 0, count: 0 }
      const totalIngot = Math.floor(mineCount * fire.rate) * fire.count

      const gem = EXPERT_GEM_START[mining.gemStart] || { rate: 0, count: 0 }
      const totalGem = Math.floor(mineCount * gem.rate) * gem.count

      const relicProcs = Math.floor(mineCount * stats.relic)
      const cobiRate = stats.cobi + (EXPERT_COBI[mining.cobi] || 0)
      const cobiProcs = Math.floor(mineCount * cobiRate)

      const totalOre = baseOre + luckyOre
      const itemTotal = totalOre + totalIngot + totalGem
      total += itemTotal

      const ore = ORE_DATA[input.oreType]
      newResults.push({
        oreName: ore.name, gemName: ore.gemName, baseOre, luckyOre, totalOre,
        totalIngot, totalGem, relicProcs, cobiProcs, total: itemTotal, mineCount
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  const fmt = (n: number) => n.toLocaleString()

  return (
    <section className="content-area">
      <h2 className="content-title">스태미나 계산</h2>

      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              곡괭이 {mining.pickaxeLevel}강 · 코비타임 LV{mining.cobi} · 럭키 히트 LV{mining.lucky} · 불붙은 곡괭이 LV{mining.firePick}
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
              <span>⛏️ 예상 획득량</span>
              <span>총 {fmt(grandTotal)}개</span>
            </div>
            <div className="result-body">
              <div className="result-grid">
                {results.map((r, i) => (
                  <div key={i} className="result-section">
                    <div className="result-section-header">
                      {r.oreName}
                      <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 400, color: 'var(--color-text-muted)' }}>{r.mineCount}회 채광</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">광물</span>
                      <span className="result-value">{fmt(r.baseOre)}{r.luckyOre > 0 && <span className="result-detail bonus">+{r.luckyOre}</span>}</span>
                    </div>
                    {r.totalIngot > 0 && (
                      <div className="result-row">
                        <span className="result-label">주괴</span>
                        <span className="result-value primary">{fmt(r.totalIngot)}</span>
                      </div>
                    )}
                    <div className="result-row">
                      <span className="result-label">{r.gemName}</span>
                      <span className="result-value" style={{ color: '#9b59b6' }}>{fmt(r.totalGem)}</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">유물</span>
                      <span className="result-value" style={{ color: '#e67e22' }}>{fmt(r.relicProcs)}</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">코비</span>
                      <span className="result-value" style={{ color: '#f39c12' }}>{fmt(r.cobiProcs)}</span>
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
            </div>
          </div>
        )}
      </div>
    </section>
  )
}