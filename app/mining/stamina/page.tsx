'use client'

import { useState } from 'react'
import { fmt } from '@/utils/format'
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
import { StaminaInputRow } from '@/components/StaminaInputRow'
import { BonusSummary } from '@/components/BonusSummary'

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
  luckyRate: number
  fireRate: number
  gemRate: number
  cobiBaseRate: number
  cobiExpertRate: number
  relicRate: number
}

const ORE_OPTIONS = [
  { value: 'corum', label: '코룸' },
  { value: 'lifton', label: '리프톤' },
  { value: 'serent', label: '세렌트' },
]

export default function MiningStaminaPage() {
  const { mining } = useExpert()
  const [inputs, setInputs] = useState<Input[]>([{ id: 1, stamina: '', oreType: 'corum' }])
  const [results, setResults] = useState<Result[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const addInput = () => setInputs(prev => [...prev, { id: Date.now(), stamina: '', oreType: 'corum' }])
  const removeInput = (id: number) => setInputs(prev => prev.filter(i => i.id !== id))
  const updateStamina = (id: number, value: string) =>
    setInputs(prev => prev.map(i => i.id === id ? { ...i, stamina: value } : i))
  const updateOreType = (id: number, value: string) =>
    setInputs(prev => prev.map(i => i.id === id ? { ...i, oreType: value as OreType } : i))

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
      const luckyOre = Math.floor(mineCount * luckyData.rate) * luckyData.count
      const totalOre = baseOre + luckyOre

      // 불붙은 곡괭이 (주괴 드롭)
      const fireData = EXPERT_FIRE_PICK[mining.firePick] || { rate: 0, count: 0 }
      const totalIngot = Math.floor(mineCount * fireData.rate) * fireData.count

      // 반짝임의 시작 (보석 드롭)
      const gemData = EXPERT_GEM_START[mining.gemStart] || { rate: 0, count: 0 }
      const totalGem = Math.floor(mineCount * gemData.rate) * gemData.count

      // 유물 / 코비
      const relicProcs = Math.floor(mineCount * pickaxeStats.relic)
      const cobiBaseRate = pickaxeStats.cobi
      const cobiExpertRate = EXPERT_COBI[mining.cobi] || 0
      const cobiProcs = Math.floor(mineCount * (cobiBaseRate + cobiExpertRate))

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
        relicRate: Math.round(pickaxeStats.relic * 100),
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  const r0 = results[0]

  return (
    <section className="mining-page">
      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              곡괭이 {mining.pickaxeLevel}강 · 코비타임 LV{mining.cobi} · 럭키 히트 LV{mining.lucky} · 불붙은 곡괭이 LV{mining.firePick} · 반짝임의 시작 LV{mining.gemStart}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <StaminaInputRow
                  key={input.id}
                  id={input.id}
                  stamina={input.stamina}
                  selectedType={input.oreType}
                  typeLabel="광물"
                  options={ORE_OPTIONS}
                  showRemove={inputs.length > 1}
                  staminaPlaceholder="3300"
                  onStaminaChange={(v) => updateStamina(input.id, v)}
                  onTypeChange={(v) => updateOreType(input.id, v)}
                  onRemove={() => removeInput(input.id)}
                  onEnter={calculate}
                />
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
                      <img src={MINING_IMAGES[r.oreType]} alt={r.oreName} className="result-icon" />
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
                        {(r.cobiBaseRate + r.cobiExpertRate) > 0 && (
                          <span className="result-detail">+{r.cobiBaseRate + r.cobiExpertRate}%</span>
                        )}
                      </span>
                    </div>
                    <div className="result-row total">
                      <span className="result-label">합계</span>
                      <span className="result-value primary">{fmt(r.total)}</span>
                    </div>
                    <div className="result-row result-row-small result-row-top">
                      <span className="result-label text-muted">주괴 환산</span>
                      <span className="result-value text-muted">{fmt(Math.floor(r.totalOre / 16))}개</span>
                    </div>
                  </div>
                ))}
              </div>

              {r0 && (
                <BonusSummary
                  items={[
                    r0.luckyRate > 0 && { label: '광물 추가', before: 0, after: r0.luckyRate, source: `럭키 히트 +${r0.luckyRate}%` },
                    r0.fireRate > 0 && { label: '주괴 추가', before: 0, after: r0.fireRate, source: `불붙은 곡괭이 +${r0.fireRate}%` },
                    r0.gemRate > 0 && { label: '보석 추가', before: 0, after: r0.gemRate, source: `반짝임의 시작 +${r0.gemRate}%` },
                    r0.cobiExpertRate > 0 && { label: '코비 확률', before: r0.cobiBaseRate, after: r0.cobiBaseRate + r0.cobiExpertRate, source: `코비타임 +${r0.cobiExpertRate}%` },
                  ]}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
