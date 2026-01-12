'use client'

import { useState, useEffect } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { HOE_STATS, EXPERT_HARVEST, EXPERT_FIRE_HOE } from '@/data/farming'

interface SeedInput { tomato: number; onion: number; garlic: number }
interface BaseInput { tomato: number; onion: number; garlic: number }

export default function FarmingHarvestPage() {
  const { farming } = useExpert()
  const [seeds, setSeeds] = useState<SeedInput>({ tomato: 0, onion: 0, garlic: 0 })
  const [bases, setBases] = useState<BaseInput>({ tomato: 0, onion: 0, garlic: 0 })
  const [result, setResult] = useState<{ tomato: number; onion: number; garlic: number } | null>(null)

  const calculate = () => {
    const stats = HOE_STATS[farming.hoeLevel] || HOE_STATS[1]
    const harvest = EXPERT_HARVEST[farming.harvest] || { rate: 0, count: 0 }
    const fire = EXPERT_FIRE_HOE[farming.fire] || { rate: 0, count: 0 }

    const calcForCrop = (seedCount: number, existingBase: number) => {
      if (seedCount <= 0) return existingBase

      // 기본 수확량 (씨앗 1개 = 작물 N개)
      const baseCrop = seedCount * stats.drops

      // 풍년 보너스
      const harvestBonus = Math.floor(seedCount * harvest.rate) * harvest.count

      // 불붙은 괭이 보너스 (씨앗 → 베이스)
      const fireBonus = Math.floor(seedCount * fire.rate) * fire.count

      // 총 작물
      const totalCrop = baseCrop + harvestBonus

      // 작물 → 베이스 (8개당 1베이스)
      const newBase = Math.floor(totalCrop / 8)

      return existingBase + newBase + fireBonus
    }

    setResult({
      tomato: calcForCrop(seeds.tomato, bases.tomato),
      onion: calcForCrop(seeds.onion, bases.onion),
      garlic: calcForCrop(seeds.garlic, bases.garlic)
    })
  }

  // 입력 변경 시 자동 계산
  useEffect(() => {
    calculate()
  }, [seeds, bases, farming])

  const reset = () => {
    setSeeds({ tomato: 0, onion: 0, garlic: 0 })
    setBases({ tomato: 0, onion: 0, garlic: 0 })
  }

  const totalBase = result ? result.tomato + result.onion + result.garlic : 0

  return (
    <section className="content-area">
      <h2 className="content-title">수확</h2>

      <div className="expert-info-bar">
        괭이 {farming.hoeLevel}강 · 오늘도 풍년이다! LV{farming.harvest} · 불붙은 괭이 LV{farming.fire}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* 씨앗 입력 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">심을 씨앗</h3>
          </div>
          <div className="card-body">
            {(['tomato', 'onion', 'garlic'] as const).map(crop => (
              <div key={crop} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span>{{ tomato: '🍅 토마토', onion: '🧅 양파', garlic: '🧄 마늘' }[crop]}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    min={0}
                    value={seeds[crop] || ''}
                    onChange={(e) => setSeeds({ ...seeds, [crop]: parseInt(e.target.value) || 0 })}
                    style={{ width: 80, padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: 6, textAlign: 'center' }}
                  />
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>개</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 보유 베이스 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">보유 베이스 (선택)</h3>
          </div>
          <div className="card-body">
            {(['tomato', 'onion', 'garlic'] as const).map(crop => (
              <div key={crop} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span>{{ tomato: '토마토 베이스', onion: '양파 베이스', garlic: '마늘 베이스' }[crop]}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    min={0}
                    value={bases[crop] || ''}
                    onChange={(e) => setBases({ ...bases, [crop]: parseInt(e.target.value) || 0 })}
                    style={{ width: 80, padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: 6, textAlign: 'center' }}
                  />
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>개</span>
                </div>
              </div>
            ))}
            <button onClick={reset} style={{ marginTop: 12, padding: '8px 16px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 6, cursor: 'pointer' }}>
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="result-card">
          <div className="result-section-title">
            <span>🌾 예상 베이스 획득량</span>
            <span>총 {totalBase}개</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {(['tomato', 'onion', 'garlic'] as const).map(crop => (
              <div key={crop} style={{ textAlign: 'center', padding: 20, background: 'var(--color-bg)', borderRadius: 10, minWidth: 120 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{{ tomato: '🍅', onion: '🧅', garlic: '🧄' }[crop]}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                  {{ tomato: '토마토 베이스', onion: '양파 베이스', garlic: '마늘 베이스' }[crop]}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{result[crop]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
