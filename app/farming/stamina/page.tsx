'use client'

import { useState } from 'react'
import { fmt } from '@/utils/format'
import { useExpert } from '@/hooks/useExpert'
import {
  FARMING_STAMINA_PER_HARVEST,
  HOE_DROPS,
  EXPERT_GIFT,
  EXPERT_FIRE_HOE,
  CROP_DATA
} from '@/data/farming'
import { StaminaInputRow } from '@/components/StaminaInputRow'
import { BonusSummary } from '@/components/BonusSummary'

const CROP_IMAGES: Record<string, string> = {
  tomato: '/img/farming/tomato_seed.png',
  onion: '/img/farming/onion_seed.png',
  garlic: '/img/farming/garlic_seed.png',
}

const CROP_OPTIONS = [
  { value: 'tomato', label: '토마토' },
  { value: 'onion', label: '양파' },
  { value: 'garlic', label: '마늘' },
]

type CropType = keyof typeof CROP_DATA

interface Input { id: number; stamina: string; cropType: CropType }
interface Result {
  cropType: string
  cropName: string
  gatherCount: number
  baseSeeds: number
  giftSeeds: number
  totalSeeds: number
  totalBase: number
  giftRate: number
  fireRate: number
}

export default function FarmingStaminaPage() {
  const { farming } = useExpert()
  const [inputs, setInputs] = useState<Input[]>([{ id: 1, stamina: '', cropType: 'tomato' }])
  const [results, setResults] = useState<Result[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const addInput = () => setInputs(prev => [...prev, { id: Date.now(), stamina: '', cropType: 'tomato' }])
  const removeInput = (id: number) => setInputs(prev => prev.filter(i => i.id !== id))
  const updateStamina = (id: number, value: string) =>
    setInputs(prev => prev.map(i => i.id === id ? { ...i, stamina: value } : i))
  const updateCropType = (id: number, value: string) =>
    setInputs(prev => prev.map(i => i.id === id ? { ...i, cropType: value as CropType } : i))

  const calculate = () => {
    const newResults: Result[] = []
    let total = 0

    for (const input of inputs) {
      const stamina = parseInt(input.stamina)
      if (!stamina || stamina <= 0) continue

      const gatherCount = Math.floor(stamina / FARMING_STAMINA_PER_HARVEST)
      const dropsPerGather = HOE_DROPS[farming.hoeLevel] || 1
      const baseSeeds = gatherCount * dropsPerGather

      // 자연이 주는 선물 (씨앗 추가)
      const giftData = EXPERT_GIFT[farming.gift] || { rate: 0, count: 0 }
      const giftSeeds = Math.floor(gatherCount * giftData.rate) * giftData.count
      const totalSeeds = baseSeeds + giftSeeds

      // 불붙은 괭이 (베이스 추가)
      const fireData = EXPERT_FIRE_HOE[farming.fire] || { rate: 0, count: 0 }
      const totalBase = Math.floor(gatherCount * fireData.rate) * fireData.count

      total += totalSeeds + totalBase

      const crop = CROP_DATA[input.cropType]
      newResults.push({
        cropType: input.cropType,
        cropName: crop.name,
        gatherCount,
        baseSeeds,
        giftSeeds,
        totalSeeds,
        totalBase,
        giftRate: Math.round(giftData.rate * 100),
        fireRate: Math.round(fireData.rate * 100),
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  const r0 = results[0]

  return (
    <section className="farming-area">
      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              괭이 {farming.hoeLevel}강 · 자연이 주는 선물 LV{farming.gift} · 불붙은 괭이 LV{farming.fire}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <StaminaInputRow
                  key={input.id}
                  id={input.id}
                  stamina={input.stamina}
                  selectedType={input.cropType}
                  typeLabel="작물"
                  options={CROP_OPTIONS}
                  showRemove={inputs.length > 1}
                  onStaminaChange={(v) => updateStamina(input.id, v)}
                  onTypeChange={(v) => updateCropType(input.id, v)}
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
                      <img src={CROP_IMAGES[r.cropType]} alt={r.cropName} className="result-icon" />
                      {r.cropName}
                    </div>
                    <div className="result-row">
                      <span className="result-label">씨앗</span>
                      <span className="result-value">
                        {fmt(r.baseSeeds)}
                        {r.giftSeeds > 0 && <span className="result-detail bonus">+{r.giftSeeds}</span>}
                      </span>
                    </div>
                    {r.totalBase > 0 && (
                      <div className="result-row">
                        <span className="result-label">베이스</span>
                        <span className="result-value primary">
                          {fmt(r.totalBase)}
                          <span className="result-detail">+{r.fireRate}%</span>
                        </span>
                      </div>
                    )}
                    <div className="result-row total">
                      <span className="result-label">합계</span>
                      <span className="result-value primary">{fmt(r.totalSeeds + r.totalBase)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {r0 && (
                <BonusSummary
                  title="적용 전문가"
                  items={[
                    r0.giftRate > 0 && { label: '씨앗 추가', before: 0, after: r0.giftRate, source: `자연이 주는 선물 +${r0.giftRate}%` },
                    r0.fireRate > 0 && { label: '베이스 드롭', before: 0, after: r0.fireRate, source: `불붙은 괭이 +${r0.fireRate}%` },
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
