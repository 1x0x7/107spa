'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { 
  HUNTING_STAMINA_PER_HUNT, 
  SWORD_STATS, 
  COMBO_DROP_RATE,
  EXPERT_ALL_THE_WAY,
  EXPERT_EXTRA_PROCESSING,
  EXPERT_DIFFERENT,
  EXPERT_MUTANT,
  ANIMAL_DATA,
  HUNTING_IMAGES
} from '@/data/hunting'

type AnimalType = keyof typeof ANIMAL_DATA

interface Input { id: number; stamina: string; animalType: AnimalType }
interface Result {
  animalType: AnimalType
  animalName: string
  lootName: string
  soulName: string
  killCount: number
  baseLoot: number
  extraLoot: number
  comboLoot: number
  totalLoot: number
  totalSoul: number
  relicCount: number
  total: number
  // 보너스 정보
  extraRate: number
  comboBaseRate: number
  comboDifferentRate: number
  comboTotalRate: number
  maxCombo: number
  mutantRate: number
  relicRate: number
}

export default function HuntingStaminaPage() {
  const { hunting } = useExpert()
  const [inputs, setInputs] = useState<Input[]>([{ id: 1, stamina: '', animalType: 'deer' }])
  const [results, setResults] = useState<Result[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)

  // 콤보 활성화 여부 (끝까지 간다! 1레벨 이상)
  const isComboActive = hunting.allTheWay > 0
  const maxCombo = EXPERT_ALL_THE_WAY[hunting.allTheWay] || 0

  const addInput = () => setInputs([...inputs, { id: Date.now(), stamina: '', animalType: 'deer' }])
  const removeInput = (id: number) => inputs.length > 1 && setInputs(inputs.filter(i => i.id !== id))
  const updateInput = (id: number, field: 'stamina' | 'animalType', value: string) => {
    if (field === 'animalType') {
      setInputs(inputs.map(i => i.id === id ? { ...i, animalType: value as AnimalType } : i))
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

      const swordStats = SWORD_STATS[hunting.swordLevel] || SWORD_STATS[1]
      
      // 사냥 1회 = 스태미나 10 소모
      const killCount = Math.floor(stamina / HUNTING_STAMINA_PER_HUNT)
      
      // 기본 전리품 드롭
      const baseLoot = killCount * swordStats.drops

      // 추가 손질 (extraProcessing)
      const extraData = EXPERT_EXTRA_PROCESSING[hunting.extraProcessing] || { rate: 0, count: 0 }
      const extraProcs = Math.floor(killCount * extraData.rate)
      const extraLoot = extraProcs * extraData.count

      // 콤보 보너스 계산
      let comboLoot = 0
      let comboBaseRate = 0
      let comboDifferentRate = 0
      let comboTotalRate = 0

      if (isComboActive) {
        // 최대 콤보에 해당하는 기본 드롭 확률
        comboBaseRate = COMBO_DROP_RATE[maxCombo] || 0
        // 남들과는 다르게 추가 확률
        comboDifferentRate = EXPERT_DIFFERENT[hunting.differentFromOthers] || 0
        // 총 콤보 드롭 확률
        comboTotalRate = comboBaseRate + comboDifferentRate
        // 콤보로 인한 추가 전리품 (킬 수 * 확률 * 1개)
        comboLoot = Math.floor(killCount * comboTotalRate)
      }

      const totalLoot = baseLoot + extraLoot + comboLoot

      // 변종 개체 (영혼 드롭)
      const mutantData = EXPERT_MUTANT[hunting.mutantSpecies] || { rate: 0, count: 0 }
      const mutantProcs = Math.floor(killCount * mutantData.rate)
      const totalSoul = mutantProcs * mutantData.count

      // 각인석 조각 (대검 기본 확률)
      const relicProcs = Math.floor(killCount * swordStats.relicChance)

      // 총합 (전리품 + 영혼)
      const itemTotal = totalLoot + totalSoul
      total += itemTotal

      const animal = ANIMAL_DATA[input.animalType]
      newResults.push({
        animalType: input.animalType,
        animalName: animal.name,
        lootName: animal.lootName,
        soulName: animal.soulName,
        killCount,
        baseLoot,
        extraLoot,
        comboLoot,
        totalLoot,
        totalSoul,
        relicCount: relicProcs,
        total: itemTotal,
        extraRate: Math.round(extraData.rate * 100),
        comboBaseRate: Math.round(comboBaseRate * 100),
        comboDifferentRate: Math.round(comboDifferentRate * 100),
        comboTotalRate: Math.round(comboTotalRate * 100),
        maxCombo,
        mutantRate: Math.round(mutantData.rate * 100),
        relicRate: Math.round(swordStats.relicChance * 100)
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
              대검 {hunting.swordLevel}강 · 
              추가 손질 LV{hunting.extraProcessing} · 
              변종 개체 LV{hunting.mutantSpecies}
              {isComboActive && (
                <>
                  {' · '}끝까지 간다! LV{hunting.allTheWay} ({maxCombo}콤보) · 
                  남들과는 다르게 LV{hunting.differentFromOthers}
                  <span className="combo-active-notice">(항상 콤보 적용 기준)</span>
                </>
              )}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <div key={input.id} className="stamina-input-row">
                  <div className="stamina-input-group">
                    <span className="stamina-label">스태미나</span>
                    <input type="number" className="stamina-input" placeholder="3300" value={input.stamina}
                      onChange={(e) => updateInput(input.id, 'stamina', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && calculate()} />
                    <span className="stamina-label">동물</span>
                    <select className="stamina-select" value={input.animalType}
                      onChange={(e) => updateInput(input.id, 'animalType', e.target.value)}>
                      <option value="deer">사슴</option>
                      <option value="meerkat">미어캣</option>
                      <option value="giraffe">기린</option>
                      <option value="elephant">코끼리</option>
                      <option value="hippo">하마</option>
                      <option value="flamingo">플라밍고</option>
                      <option value="turkey">칠면조</option>
                      <option value="bear">곰</option>
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
                        src={HUNTING_IMAGES[r.animalType]}
                        alt={r.animalName}
                        className="result-icon"
                      />
                      {r.animalName}
                    </div>
                    <div className="result-row">
                      <span className="result-label">{r.lootName}</span>
                      <span className="result-value">
                        {fmt(r.baseLoot)}
                        {r.extraLoot > 0 && <span className="result-detail bonus">+{r.extraLoot}</span>}
                        {r.comboLoot > 0 && <span className="result-detail bonus">+{r.comboLoot}</span>}
                      </span>
                    </div>
                    {r.totalSoul > 0 && (
                      <div className="result-row">
                        <span className="result-label">{r.soulName}</span>
                        <span className="result-value primary">
                          {fmt(r.totalSoul)}
                          {r.mutantRate > 0 && <span className="result-detail">+{r.mutantRate}%</span>}
                        </span>
                      </div>
                    )}
                    <div className="result-row">
                      <span className="result-label">각인석 조각</span>
                      <span className="result-value">
                        {fmt(r.relicCount)}
                        {r.relicRate > 0 && <span className="result-detail">+{r.relicRate}%</span>}
                      </span>
                    </div>
                    <div className="result-row total">
                      <span className="result-label">전리품 합계</span>
                      <span className="result-value primary">{fmt(r.totalLoot)}</span>
                    </div>
                    <div className="result-row result-row-small result-row-top">
                      <span className="result-label text-muted">영혼 환산</span>
                      <span className="result-value text-muted">{fmt(Math.floor(r.totalLoot / 8))}개</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 보너스 요약 */}
              {results[0] && (results[0].extraRate > 0 || results[0].comboTotalRate > 0 || results[0].mutantRate > 0) && (
                <div className="bonus-summary">
                  <div className="bonus-summary-title">적용 보너스</div>
                  {[
                    results[0].extraRate > 0 && `전리품 추가 0% → <strong>${results[0].extraRate}%</strong> (추가 손질 +${results[0].extraRate}%)`,
                    results[0].comboTotalRate > 0 && `콤보 보너스 0% → <strong>${results[0].comboTotalRate}%</strong> (${results[0].maxCombo}콤보 +${results[0].comboBaseRate}%${results[0].comboDifferentRate > 0 ? `, 남들과는 다르게 +${results[0].comboDifferentRate}%` : ''})`,
                    results[0].mutantRate > 0 && `영혼 추가 0% → <strong>${results[0].mutantRate}%</strong> (변종 개체 +${results[0].mutantRate}%)`
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