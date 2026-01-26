'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useExpert } from '@/hooks/useExpert'
import { 
  FARMING_STAMINA_PER_HARVEST, 
  HOE_DROPS,
  EXPERT_GIFT, 
  EXPERT_FIRE_HOE, 
  CROP_DATA 
} from '@/data/farming'

const CROP_IMAGES: Record<string, string> = {
  tomato: '/img/farming/tomato_seed.png',
  onion: '/img/farming/onion_seed.png',
  garlic: '/img/farming/garlic_seed.png'
}

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
  giftCount: number
  fireRate: number
  fireCount: number
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
    if (field === 'cropType') {
      setInputs(inputs.map(i => i.id === id ? { ...i, cropType: value as CropType } : i))
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

      // 채집 횟수
      const gatherCount = Math.floor(stamina / FARMING_STAMINA_PER_HARVEST)
      
      // 괭이 레벨별 기본 씨앗 드롭
      const dropsPerGather = HOE_DROPS[farming.hoeLevel] || 1
      const baseSeeds = gatherCount * dropsPerGather

      // 자연이 주는 선물 (씨앗 추가)
      const giftData = EXPERT_GIFT[farming.gift] || { rate: 0, count: 0 }
      const giftProcs = Math.floor(gatherCount * giftData.rate)
      const giftSeeds = giftProcs * giftData.count
      
      const totalSeeds = baseSeeds + giftSeeds

      // 불붙은 괭이 (베이스 추가)
      const fireData = EXPERT_FIRE_HOE[farming.fire] || { rate: 0, count: 0 }
      const fireProcs = Math.floor(gatherCount * fireData.rate)
      const totalBase = fireProcs * fireData.count

      // 총합 = 씨앗 + 베이스
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
        giftCount: giftData.count,
        fireRate: Math.round(fireData.rate * 100),
        fireCount: fireData.count
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  const fmt = (n: number) => n.toLocaleString()

  return (
    <section className="farming-area">
      <h2 className="content-title">스태미나 계산</h2>

      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              괭이 {farming.hoeLevel}강 · 자연이 주는 선물 LV{farming.gift} · 불붙은 괭이 LV{farming.fire}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <div key={input.id} className="stamina-input-row">
                  <div className="stamina-input-group">
                    <span className="stamina-label">스태미나</span>
                    <input type="number" className="stamina-input" placeholder="3000" value={input.stamina}
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
              <span>예상 획득량</span>
              <span>총 {fmt(grandTotal)}개</span>
            </div>
            <div className="result-body">
              <div className="result-grid">
                {results.map((r, i) => (
                  <div key={i} className="result-section">
                    <div className="result-section-header">
                      <Image
                        src={CROP_IMAGES[r.cropType]}
                        alt={r.cropName}
                        width={20}
                        height={20}
                        style={{ marginRight: '6px' }}
                      />
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
              
              {/* 보너스 요약 */}
              {results[0] && (results[0].giftRate > 0 || results[0].fireRate > 0) && (
                <div className="bonus-summary">
                  <div className="bonus-summary-title">적용 전문가</div>
                  {results[0].giftRate > 0 && (
                    <>씨앗 추가 0% → <strong>{results[0].giftRate}%</strong> (자연이 주는 선물 +{results[0].giftRate}%)</>
                  )}
                  {results[0].giftRate > 0 && results[0].fireRate > 0 && ' · '}
                  {results[0].fireRate > 0 && (
                    <>베이스 드롭 0% → <strong>{results[0].fireRate}%</strong> (불붙은 괭이 +{results[0].fireRate}%)</>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}