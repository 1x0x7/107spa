'use client'

import { useState, useMemo } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { COOKING_RECIPES } from '@/data/farming'

// 각 요리에 필요한 베이스 수
const RECIPE_BASE_COST: Record<string, { tomato: number; onion: number; garlic: number }> = {
  "토마토 스파게티": { tomato: 1, onion: 0, garlic: 0 },
  "어니언 링": { tomato: 0, onion: 2, garlic: 0 },
  "갈릭 케이크": { tomato: 0, onion: 0, garlic: 1 },
  "삼겹살 토마토 찌개": { tomato: 2, onion: 0, garlic: 0 },
  "삼색 아이스크림": { tomato: 0, onion: 2, garlic: 0 },
  "마늘 양갈비 핫도그": { tomato: 0, onion: 0, garlic: 2 },
  "달콤 시리얼": { tomato: 2, onion: 0, garlic: 0 },
  "로스트 치킨 파이": { tomato: 0, onion: 0, garlic: 2 },
  "스윗 치킨 햄버거": { tomato: 1, onion: 1, garlic: 0 },
  "토마토 파인애플 피자": { tomato: 2, onion: 0, garlic: 2 },
  "양파 수프": { tomato: 0, onion: 2, garlic: 1 },
  "허브 삼겹살 찜": { tomato: 0, onion: 1, garlic: 2 },
  "토마토 라자냐": { tomato: 1, onion: 1, garlic: 1 },
  "딥 크림 빠네": { tomato: 1, onion: 1, garlic: 1 },
  "트리플 소갈비 꼬치": { tomato: 1, onion: 1, garlic: 1 },
}

export default function FarmingEfficiencyPage() {
  const { farming } = useExpert()
  const [stamina, setStamina] = useState(3300)
  const [selectedRecipe, setSelectedRecipe] = useState(COOKING_RECIPES[0].name)
  const [pricePercent, setPricePercent] = useState(50)

  // 돈 좀 벌어볼까 보너스
  const moneyBonus = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.10, 0.15, 0.30, 0.50][farming.money] || 0

  // 선택된 요리의 현재가 계산
  const getPrice = (recipe: typeof COOKING_RECIPES[0], percent: number) => {
    const base = recipe.minPrice + (recipe.maxPrice - recipe.minPrice) * (percent / 100)
    return Math.floor(base * (1 + moneyBonus))
  }

  // 효율 계산
  const calculateEfficiency = (recipe: typeof COOKING_RECIPES[0]) => {
    const baseCost = RECIPE_BASE_COST[recipe.name]
    if (!baseCost) return { count: 0, profit: 0, efficiency: 0 }

    const totalBase = baseCost.tomato + baseCost.onion + baseCost.garlic
    if (totalBase === 0) return { count: 0, profit: 0, efficiency: 0 }

    // 스태미나로 캘 수 있는 작물 수 (10 스태미나당 1회 수확)
    const harvestCount = Math.floor(stamina / 10)
    const cropsPerHarvest = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 10][farming.hoeLevel - 1] || 2
    const totalCrops = harvestCount * cropsPerHarvest
    
    // 작물 → 베이스 (8개당 1베이스)
    const totalBases = Math.floor(totalCrops / 8)
    
    // 만들 수 있는 요리 수 (베이스 기준)
    const count = Math.floor(totalBases / totalBase)
    
    const price = getPrice(recipe, pricePercent)
    const profit = count * price
    const efficiency = stamina > 0 ? profit / stamina : 0

    return { count, profit, efficiency }
  }

  // 전체 순위
  const rankings = useMemo(() => {
    return COOKING_RECIPES.map(recipe => ({
      ...recipe,
      ...calculateEfficiency(recipe),
      currentPrice: getPrice(recipe, pricePercent)
    })).sort((a, b) => b.efficiency - a.efficiency)
  }, [stamina, pricePercent, farming.hoeLevel, farming.money])

  const selected = COOKING_RECIPES.find(r => r.name === selectedRecipe)!
  const selectedStats = calculateEfficiency(selected)

  const fmt = (n: number) => n.toLocaleString()

  return (
    <section className="content-area">
      <h2 className="content-title">요리 효율 계산</h2>

      {/* 상단 설정 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24, padding: 16, background: 'var(--color-bg)', borderRadius: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>스태미나</span>
          <input
            type="number"
            value={stamina}
            onChange={(e) => setStamina(parseInt(e.target.value) || 0)}
            style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 6, width: 120 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>시세 ({pricePercent}%)</span>
          <input
            type="range"
            min={0}
            max={100}
            value={pricePercent}
            onChange={(e) => setPricePercent(parseInt(e.target.value))}
            style={{ width: 150 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>요리 선택</span>
          <select
            value={selectedRecipe}
            onChange={(e) => setSelectedRecipe(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 6 }}
          >
            {COOKING_RECIPES.map(r => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 선택된 요리 상세 */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <h3 style={{ marginBottom: 16 }}>{selectedRecipe}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>현재 시세</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary)' }}>{fmt(getPrice(selected, pricePercent))} G</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>제작 가능</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{fmt(selectedStats.count)}개</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>예상 수익</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#059669' }}>{fmt(selectedStats.profit)} G</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>효율</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{selectedStats.efficiency.toFixed(2)} G/스태</div>
            </div>
          </div>
        </div>
      </div>

      {/* 전체 순위 */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 전체 요리 효율 순위</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="recipe-table-compact">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>요리명</th>
                  <th style={{ textAlign: 'right' }}>현재가</th>
                  <th style={{ textAlign: 'right' }}>효율</th>
                  <th style={{ textAlign: 'right' }}>제작수</th>
                  <th style={{ textAlign: 'right' }}>총수익</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, i) => (
                  <tr key={r.name} style={{ background: r.name === selectedRecipe ? 'var(--color-bg)' : undefined }}>
                    <td style={{ fontWeight: 600 }}>{i + 1}</td>
                    <td className="recipe-name">{r.name}</td>
                    <td style={{ textAlign: 'right' }}>{fmt(r.currentPrice)} G</td>
                    <td style={{ textAlign: 'right', color: 'var(--color-primary)', fontWeight: 600 }}>{r.efficiency.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>{fmt(r.count)}개</td>
                    <td style={{ textAlign: 'right', color: '#059669' }}>{fmt(r.profit)} G</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
