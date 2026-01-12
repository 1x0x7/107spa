'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { FARMING_STAMINA_PER_HARVEST, HOE_STATS, EXPERT_GIFT, EXPERT_HARVEST, EXPERT_FIRE_HOE, CROP_DATA } from '@/data/farming'

interface Input { id: number; stamina: string; cropType: string }
interface Result {
  cropName: string; baseCrop: number; harvestBonus: number; giftSeeds: number; fireBase: number; total: number; harvestCount: number;
}

export default function FarmingStaminaPage() {
  const { farming } = useExpert()
  const [inputs, setInputs] = useState<Input[]>([{ id: 1, stamina: '', cropType: 'tomato' }])
  const [results, setResults] = useState<Result[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const addInput = () => setInputs([...inputs, { id: Date.now(), stamina: '', cropType: 'tomato' }])
  const removeInput = (id: number) => inputs.length > 1 && setInputs(inputs.filter(i => i.id !== id))
  const updateInput = (id: number, field: 'stamina' | 'cropType', value: string) => {
    setInputs(inputs.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const calculate = () => {
    const newResults: Result[] = []
    let total = 0

    for (const input of inputs) {
      const stamina = parseInt(input.stamina)
      if (!stamina || stamina <= 0) continue

      const stats = HOE_STATS[farming.hoeLevel] || HOE_STATS[1]
      const harvestCount = Math.floor(stamina / FARMING_STAMINA_PER_HARVEST)
      const baseCrop = harvestCount * stats.drops

      const harvest = EXPERT_HARVEST[farming.harvest] || { rate: 0, count: 0 }
      const harvestBonus = Math.floor(harvestCount * harvest.rate) * harvest.count

      const gift = EXPERT_GIFT[farming.gift] || { rate: 0, count: 0 }
      const giftSeeds = Math.floor(harvestCount * gift.rate) * gift.count

      const fire = EXPERT_FIRE_HOE[farming.fire] || { rate: 0, count: 0 }
      const fireBase = Math.floor(harvestCount * fire.rate) * fire.count

      const itemTotal = baseCrop + harvestBonus + giftSeeds + fireBase
      total += itemTotal

      const crop = CROP_DATA[input.cropType]
      newResults.push({
        cropName: crop.name, baseCrop, harvestBonus, giftSeeds, fireBase, total: itemTotal, harvestCount
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
              괭이 {farming.hoeLevel}강 · 자연이 주는 선물 LV{farming.gift} · 오늘도 풍년이다 LV{farming.harvest} · 불붙은 괭이 LV{farming.fire}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <div key={input.id} className="stamina-input-row">
                  <div className="stamina-input-group">
                    <span className="stamina-label">스태미나</span>
                    <input type="number" className="stamina-input" placeholder="3300" value={input.stamina}
                      onChange={(e) => updateInput(input.id, 'stamina', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && calculate()} />
                    <span className="stamina-label">작물</span>
                    <select className="stamina-select" value={input.cropType}
                      onChange={(e) => updateInput(input.id, 'cropType', e.target.value)}>
                      <option value="tomato">토마토</option>
                      <option value="onion">양파</option>
                      <option value="garlic">마늘</option>
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
              <span>🌾 예상 획득량</span>
              <span>총 {fmt(grandTotal)}개</span>
            </div>
            <div className="result-body">
              <div className="result-grid">
                {results.map((r, i) => (
                  <div key={i} className="result-section">
                    <div className="result-section-header">
                      {r.cropName}
                      <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 400, color: 'var(--color-text-muted)' }}>{r.harvestCount}회 수확</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">작물</span>
                      <span className="result-value">{fmt(r.baseCrop)}{r.harvestBonus > 0 && <span className="result-detail bonus">+{r.harvestBonus}</span>}</span>
                    </div>
                    {r.giftSeeds > 0 && (
                      <div className="result-row">
                        <span className="result-label">추가 씨앗</span>
                        <span className="result-value">{fmt(r.giftSeeds)}<span className="result-detail">선물</span></span>
                      </div>
                    )}
                    {r.fireBase > 0 && (
                      <div className="result-row">
                        <span className="result-label">베이스</span>
                        <span className="result-value primary">{fmt(r.fireBase)}<span className="result-detail">불괭이</span></span>
                      </div>
                    )}
                    <div className="result-row total">
                      <span className="result-label">합계</span>
                      <span className="result-value primary">{fmt(r.total)}</span>
                    </div>
                    <div className="result-row" style={{ fontSize: 11, marginTop: 4 }}>
                      <span className="result-label" style={{ color: 'var(--color-text-muted)' }}>베이스 환산</span>
                      <span className="result-value" style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{fmt(Math.floor(r.baseCrop / 8))}개</span>
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
