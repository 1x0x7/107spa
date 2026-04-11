'use client'

import { useState } from 'react'
import { fmt } from '@/utils/format'
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
import { StaminaInputRow } from '@/components/StaminaInputRow'
import { BonusSummary } from '@/components/BonusSummary'

const ANIMAL_OPTIONS = [
  { value: 'deer', label: '사슴' },
  { value: 'meerkat', label: '미어캣' },
  { value: 'giraffe', label: '기린' },
  { value: 'elephant', label: '코끼리' },
  { value: 'hippo', label: '하마' },
  { value: 'flamingo', label: '플라밍고' },
  { value: 'turkey', label: '칠면조' },
  { value: 'bear', label: '곰' },
]

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

  const isComboActive = hunting.allTheWay > 0
  const maxCombo = EXPERT_ALL_THE_WAY[hunting.allTheWay] || 0

  const addInput = () => setInputs(prev => [...prev, { id: Date.now(), stamina: '', animalType: 'deer' }])
  const removeInput = (id: number) => setInputs(prev => prev.filter(i => i.id !== id))
  const updateStamina = (id: number, value: string) =>
    setInputs(prev => prev.map(i => i.id === id ? { ...i, stamina: value } : i))
  const updateAnimalType = (id: number, value: string) =>
    setInputs(prev => prev.map(i => i.id === id ? { ...i, animalType: value as AnimalType } : i))

  const calculate = () => {
    const newResults: Result[] = []
    let total = 0

    for (const input of inputs) {
      const stamina = parseInt(input.stamina)
      if (!stamina || stamina <= 0) continue

      const swordStats = SWORD_STATS[hunting.swordLevel] || SWORD_STATS[1]
      const killCount = Math.floor(stamina / HUNTING_STAMINA_PER_HUNT)
      const baseLoot = killCount * swordStats.drops

      // 추가 손질
      const extraData = EXPERT_EXTRA_PROCESSING[hunting.extraProcessing] || { rate: 0, count: 0 }
      const extraLoot = Math.floor(killCount * extraData.rate) * extraData.count

      // 콤보 보너스
      let comboLoot = 0, comboBaseRate = 0, comboDifferentRate = 0, comboTotalRate = 0
      if (isComboActive) {
        comboBaseRate = COMBO_DROP_RATE[maxCombo] || 0
        comboDifferentRate = EXPERT_DIFFERENT[hunting.differentFromOthers] || 0
        comboTotalRate = comboBaseRate + comboDifferentRate
        comboLoot = Math.floor(killCount * comboTotalRate)
      }

      const totalLoot = baseLoot + extraLoot + comboLoot

      // 변종 개체 (영혼)
      const mutantData = EXPERT_MUTANT[hunting.mutantSpecies] || { rate: 0, count: 0 }
      const totalSoul = Math.floor(killCount * mutantData.rate) * mutantData.count

      // 각인석 조각
      const relicCount = Math.floor(killCount * swordStats.relicChance)

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
        relicCount,
        total: itemTotal,
        extraRate: Math.round(extraData.rate * 100),
        comboBaseRate: Math.round(comboBaseRate * 100),
        comboDifferentRate: Math.round(comboDifferentRate * 100),
        comboTotalRate: Math.round(comboTotalRate * 100),
        maxCombo,
        mutantRate: Math.round(mutantData.rate * 100),
        relicRate: Math.round(swordStats.relicChance * 100),
      })
    }

    if (newResults.length === 0) { alert('스태미나를 입력해주세요.'); return }
    setResults(newResults)
    setGrandTotal(total)
    setShowResult(true)
  }

  const r0 = results[0]

  return (
    <section className="hunting-page">
      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              대검 {hunting.swordLevel}강 · 추가 손질 LV{hunting.extraProcessing} · 변종 개체 LV{hunting.mutantSpecies}
              {isComboActive && (
                <> · 끝까지 간다! LV{hunting.allTheWay} ({maxCombo}콤보) · 남들과는 다르게 LV{hunting.differentFromOthers}
                  <span className="combo-active-notice"> (항상 콤보 적용 기준)</span>
                </>
              )}
            </div>

            <div className="stamina-inputs-container">
              {inputs.map(input => (
                <StaminaInputRow
                  key={input.id}
                  id={input.id}
                  stamina={input.stamina}
                  selectedType={input.animalType}
                  typeLabel="동물"
                  options={ANIMAL_OPTIONS}
                  showRemove={inputs.length > 1}
                  staminaPlaceholder="3300"
                  onStaminaChange={(v) => updateStamina(input.id, v)}
                  onTypeChange={(v) => updateAnimalType(input.id, v)}
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
                      <img src={HUNTING_IMAGES[r.animalType]} alt={r.animalName} className="result-icon" />
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

              {r0 && (
                <BonusSummary
                  items={[
                    r0.extraRate > 0 && { label: '전리품 추가', before: 0, after: r0.extraRate, source: `추가 손질 +${r0.extraRate}%` },
                    r0.comboTotalRate > 0 && {
                      label: '콤보 보너스',
                      before: 0,
                      after: r0.comboTotalRate,
                      source: `${r0.maxCombo}콤보 +${r0.comboBaseRate}%${r0.comboDifferentRate > 0 ? `, 남들과는 다르게 +${r0.comboDifferentRate}%` : ''}`,
                    },
                    r0.mutantRate > 0 && { label: '영혼 추가', before: 0, after: r0.mutantRate, source: `변종 개체 +${r0.mutantRate}%` },
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
