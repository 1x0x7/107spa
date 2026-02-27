'use client'

import { useState, useMemo, useCallback, Fragment } from 'react'
import Image from 'next/image'
import { useExpert } from '@/hooks/useExpert'
import {
  EFFICIENCY_RECIPES,
  DEFAULT_PRICES,
  HOE_DROPS,
  CROP_DROP_RATE,
  KING_CROP_BASE_CHANCE,
  KING_CROP_MULTIPLIER,
  EXPERT_HARVEST_DATA,
  EXPERT_KING_DATA,
  EXPERT_MONEY_DATA,
  SEED_IMAGES,
  SEED_NAMES,
} from '@/data/farming'
import '@/app/styles/efficiency.css'

// 결과 타입 정의
interface EfficiencyResult {
  name: string
  img: string
  ingredients: string
  currentPrice: number
  pricePercent: number
  sellPrice: number
  staminaPerOne: number
  efficiency: number
  maxCount: number
  totalProfit: number
  totalSeeds: { tomato: number; onion: number; garlic: number }
}

// 숫자 포맷
function formatNum(n: number): string {
  return Math.floor(n).toLocaleString()
}

// 안전하게 전문가 데이터 가져오기
function getExpertKingData(level: number) {
  const maxLevel = EXPERT_KING_DATA.length - 1
  const safeLevel = Math.min(Math.max(0, level), maxLevel)
  return EXPERT_KING_DATA[safeLevel]
}

function getExpertHarvestData(level: number) {
  const maxLevel = EXPERT_HARVEST_DATA.length - 1
  const safeLevel = Math.min(Math.max(0, level), maxLevel)
  return EXPERT_HARVEST_DATA[safeLevel]
}

function getExpertMoneyData(level: number) {
  const maxLevel = EXPERT_MONEY_DATA.length - 1
  const safeLevel = Math.min(Math.max(0, level), maxLevel)
  return EXPERT_MONEY_DATA[safeLevel]
}

export default function EfficiencyPage() {
  const { farming } = useExpert()
  
  // 상태
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const initialPrices: Record<string, number> = {}
    EFFICIENCY_RECIPES.forEach(r => {
      initialPrices[r.name] = DEFAULT_PRICES[r.name] || Math.floor((r.minPrice + r.maxPrice) / 2)
    })
    return initialPrices
  })
  const [stamina, setStamina] = useState(3000)
  const [mode, setMode] = useState<'efficiency' | 'profit'>('efficiency')
  const [selectedRecipe, setSelectedRecipe] = useState('')
  const [priceEditOpen, setPriceEditOpen] = useState(false)
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)

  // 전문가 설정에서 값 가져오기
  const hoeLevel = farming.hoeLevel
  const harvestLevel = farming.harvest
  const kingLevel = farming.king
  const moneyLevel = farming.money

  // 효율 계산
  const results = useMemo<EfficiencyResult[]>(() => {
    const hoeDrop = HOE_DROPS[hoeLevel] || HOE_DROPS[0] || 1
    const kingData = getExpertKingData(kingLevel)
    const kingBonus = KING_CROP_BASE_CHANCE + kingData.bonus
    const kingMult = 1 + (kingBonus * (KING_CROP_MULTIPLIER - 1))
    const harvestData = getExpertHarvestData(harvestLevel)
    const harvestBonus = harvestData.rate * harvestData.count
    const moneyData = getExpertMoneyData(moneyLevel)
    const moneyBonus = moneyData.bonus

    const calculated = EFFICIENCY_RECIPES.map(recipe => {
      let totalSeeds = 0
      const seedsPerCrop: Record<string, number> = {}

      ;(['tomato', 'onion', 'garlic'] as const).forEach(crop => {
        const baseNeeded = recipe.bases[crop] || 0
        if (baseNeeded > 0) {
          const effectiveRate = CROP_DROP_RATE[crop] * kingMult + harvestBonus
          const seeds = (baseNeeded * 8) / effectiveRate
          seedsPerCrop[crop] = seeds
          totalSeeds += seeds
        }
      })

      const gatherCount = totalSeeds / hoeDrop
      const staminaPerOne = gatherCount * 7
      const sellPrice = prices[recipe.name] * (1 + moneyBonus)
      const efficiency = staminaPerOne > 0 ? sellPrice / staminaPerOne : 0
      const maxCount = staminaPerOne > 0 ? Math.floor(stamina / staminaPerOne) : 0
      const totalProfit = maxCount * sellPrice
      const pricePercent = Math.floor((prices[recipe.name] / recipe.maxPrice) * 100)

      return {
        name: recipe.name,
        img: recipe.img,
        ingredients: recipe.ingredients,
        currentPrice: prices[recipe.name],
        pricePercent,
        sellPrice: Math.floor(sellPrice),
        staminaPerOne,
        efficiency,
        maxCount,
        totalProfit,
        totalSeeds: {
          tomato: Math.ceil((seedsPerCrop.tomato || 0) * maxCount),
          onion: Math.ceil((seedsPerCrop.onion || 0) * maxCount),
          garlic: Math.ceil((seedsPerCrop.garlic || 0) * maxCount)
        }
      }
    })

    // 정렬
    if (mode === 'efficiency') {
      calculated.sort((a, b) => b.efficiency - a.efficiency)
    } else {
      calculated.sort((a, b) => b.totalProfit - a.totalProfit)
    }

    return calculated
  }, [prices, stamina, hoeLevel, harvestLevel, kingLevel, moneyLevel, mode])

  // 선택된 레시피 (가이드용)
  const selectedItem = useMemo(() => {
    if (selectedRecipe) {
      return results.find(r => r.name === selectedRecipe) || results[0]
    }
    return results[0]
  }, [results, selectedRecipe])

  // 가격 변경 핸들러
  const handlePriceChange = useCallback((recipeName: string, value: number) => {
    setPrices(prev => ({ ...prev, [recipeName]: value }))
  }, [])

  // 가격 리셋
  const handleResetPrices = useCallback(() => {
    const resetPrices: Record<string, number> = {}
    EFFICIENCY_RECIPES.forEach(r => {
      resetPrices[r.name] = DEFAULT_PRICES[r.name] || Math.floor((r.minPrice + r.maxPrice) / 2)
    })
    setPrices(resetPrices)
  }, [])

  // 조합법 토글
  const toggleRecipeDetail = useCallback((recipeName: string) => {
    setExpandedRecipe(prev => prev === recipeName ? null : recipeName)
  }, [])

  // 전문가 정보
  const hoeDrop = HOE_DROPS[hoeLevel] || 1
  const harvestData = getExpertHarvestData(harvestLevel)
  const kingData = getExpertKingData(kingLevel)
  const moneyData = getExpertMoneyData(moneyLevel)
  const moneyPercent = Math.round(moneyData.bonus * 100)

  return (
    <section className="efficiency-area">
      {/* 전문가 설정 요약 + 시세 버튼 */}
      <div className="efficiency-header-row">
        <div className="expert-tags">
          <span className="expert-tag">
            괭이 {hoeLevel}강
            <span className="tooltip">드롭 {hoeDrop}개</span>
          </span>
          <span className="expert-tag">
            풍년 {harvestLevel}
            <span className="tooltip">{harvestData.desc}</span>
          </span>
          <span className="expert-tag">
            대왕 {kingLevel}
            <span className="tooltip">등장 확률 {kingData.desc}</span>
          </span>
          <span className="expert-tag">
            판매 {moneyLevel}
            <span className="tooltip">판매가 {moneyData.desc}</span>
          </span>
        </div>
        <button
          className={`btn-price-edit ${priceEditOpen ? 'active' : ''}`}
          onClick={() => setPriceEditOpen(!priceEditOpen)}
        >
          시세 수정
        </button>
      </div>

      {/* 시세 수정 패널 */}
      <div className={`price-edit-panel ${priceEditOpen ? 'show' : ''}`}>
        <div className="price-edit-header">
          <h3>
            시세 수정
            <span className="price-date">02.27 ~ 02.28</span>
          </h3>
          <button className="btn-reset-price" onClick={handleResetPrices}>
            초기화
          </button>
        </div>
        <div className="price-edit-grid">
          {EFFICIENCY_RECIPES.map(r => {
            const percent = Math.floor((prices[r.name] / r.maxPrice) * 100)
            const pClass = percent >= 80 ? 'high' : percent >= 50 ? 'mid' : 'low'
            return (
              <div key={r.name} className="price-edit-item">
                <div className="item-header">
                  <Image
                    src={`/img/farming/${r.img}`}
                    alt={r.name}
                    width={20}
                    height={20}
                    className="recipe-img"
                  />
                  <span className="recipe-name">{r.name}</span>
                </div>
                <input
                  type="number"
                  value={prices[r.name]}
                  onChange={(e) => handlePriceChange(r.name, parseInt(e.target.value) || 0)}
                />
                <div className={`price-percent ${pClass}`}>{percent}%</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 스태미나 입력 바 */}
      <div className="efficiency-input-bar">
        <label>보유 스태미나</label>
        <input
          type="number"
          value={stamina}
          onChange={(e) => setStamina(parseInt(e.target.value) || 0)}
        />
        <div className="spacer" />
        <div className="mode-buttons">
          <button
            className={`btn-mode ${mode === 'efficiency' ? 'active' : ''}`}
            onClick={() => setMode('efficiency')}
          >
            효율순
          </button>
          <button
            className={`btn-mode ${mode === 'profit' ? 'active' : ''}`}
            onClick={() => setMode('profit')}
          >
            수익순
          </button>
        </div>
      </div>

      {/* TOP 3 카드 */}
      <div className="top3-grid">
        {results.slice(0, 3).map((item, i) => (
          <div key={item.name} className={`top3-card ${i === 0 ? 'rank-1' : ''}`}>
            <div className="rank-badge">{i + 1}</div>
            <div className="recipe-info">
              <Image
                src={`/img/farming/${item.img}`}
                alt={item.name}
                width={28}
                height={28}
                className="recipe-img"
              />
              <span className="recipe-name">{item.name}</span>
            </div>
            <div className="price-info">
              현재가 {formatNum(item.currentPrice)}G (최고가의 {item.pricePercent}%)
            </div>

            <div className="metric-box">
              <div className="metric-label">
                {mode === 'efficiency' ? '스태미나 효율' : '예상 총수익'}
              </div>
              <div className="metric-value">
                {mode === 'efficiency'
                  ? `${item.efficiency.toFixed(1)} G`
                  : `${formatNum(item.totalProfit)} G`
                }
              </div>
              <div className="metric-unit">
                {mode === 'efficiency'
                  ? '/스태미나'
                  : `(${formatNum(item.maxCount)}개 제작)`
                }
              </div>
            </div>

            <div className="detail-list">
              <div className="detail-row">
                <span>제작 가능</span>
                <span className="detail-value">{formatNum(item.maxCount)}개</span>
              </div>
              <div className="detail-row">
                <span>개당 스태미나</span>
                <span className="detail-value">약 {item.staminaPerOne.toFixed(1)}</span>
              </div>
              <div className="detail-row">
                <span>판매가(+{moneyPercent}%)</span>
                <span className="detail-value">{formatNum(item.sellPrice)}G</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 파밍 가이드 */}
      {selectedItem && (
        <div className="farming-guide">
          <div className="farming-guide-header">
            <h3>파밍 가이드</h3>
            <select
              value={selectedItem.name}
              onChange={(e) => setSelectedRecipe(e.target.value)}
            >
              {results.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
            <span className="current-price">
              현재가 {formatNum(selectedItem.currentPrice)}G (최고가의 {selectedItem.pricePercent}%)
            </span>
          </div>

          <div className="guide-stats">
            <div className="guide-stat stamina">
              <div className="stat-label">보유 스태미나</div>
              <div className="stat-value">{formatNum(stamina)}</div>
            </div>
            <div className="guide-stat count">
              <div className="stat-label">제작 가능</div>
              <div className="stat-value">{formatNum(selectedItem.maxCount)}개</div>
            </div>
            <div className="guide-stat profit">
              <div className="stat-label">예상 수익</div>
              <div className="stat-value">{formatNum(selectedItem.totalProfit)}G</div>
            </div>
            <div className="guide-stat efficiency">
              <div className="stat-label">스태미나 효율</div>
              <div className="stat-value">{selectedItem.efficiency.toFixed(1)}</div>
              <div className="stat-unit">G/스태미나</div>
            </div>
          </div>

          <div className="seeds-needed">
            <div className="seeds-title">필요 씨앗 (괭이 {hoeLevel}강 기준)</div>
            <div className="seeds-list">
              {(['tomato', 'onion', 'garlic'] as const).map(crop => {
                if (selectedItem.totalSeeds[crop] > 0) {
                  const gatherCount = Math.ceil(selectedItem.totalSeeds[crop] / hoeDrop)
                  const staminaNeeded = gatherCount * 7
                  return (
                    <div key={crop} className="seed-item">
                      <Image
                        src={SEED_IMAGES[crop]}
                        alt={SEED_NAMES[crop]}
                        width={26}
                        height={26}
                        className="seed-img"
                      />
                      <div className="seed-info">
                        <div className="seed-count">약 {formatNum(selectedItem.totalSeeds[crop])}개</div>
                        <div className="seed-name">{SEED_NAMES[crop]}</div>
                        <div className="seed-stamina">{formatNum(staminaNeeded)} 스태미나</div>
                      </div>
                    </div>
                  )
                }
                return null
              })}
              {selectedItem.totalSeeds.tomato === 0 &&
               selectedItem.totalSeeds.onion === 0 &&
               selectedItem.totalSeeds.garlic === 0 && (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>필요한 씨앗이 없습니다</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 전체 순위 테이블 */}
      <div className="ranking-table-container">
        <h3>📊 전체 요리 {mode === 'efficiency' ? '효율' : '수익'} 순위</h3>
        <table className="ranking-table">
          <thead>
            <tr>
              <th className="col-rank">순위</th>
              <th className="col-recipe">요리</th>
              <th className="col-price text-right">현재가</th>
              <th className="col-percent text-right">시세</th>
              <th className="col-efficiency text-right">효율</th>
              <th className="col-count text-right">제작</th>
              <th className="col-profit text-right">총수익</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, i) => {
              const pClass = item.pricePercent >= 80 ? 'high' : item.pricePercent >= 50 ? 'mid' : 'low'
              const isExpanded = expandedRecipe === item.name
              return (
                <Fragment key={item.name}>
                  <tr
                    className={`${i < 3 ? 'top3-row' : ''} ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleRecipeDetail(item.name)}
                  >
                    <td className="col-rank">
                      <span className={`rank-num ${i < 3 ? 'top' : ''}`}>{i + 1}</span>
                    </td>
                    <td className="col-recipe">
                      <div className="table-recipe">
                        <Image
                          src={`/img/farming/${item.img}`}
                          alt={item.name}
                          width={22}
                          height={22}
                          className="table-recipe-img"
                        />
                        <span className="table-recipe-name">{item.name}</span>
                      </div>
                    </td>
                    <td className="col-price text-right">{formatNum(item.currentPrice)}G</td>
                    <td className="col-percent text-right">
                      <span className={`percent-badge ${pClass}`}>{item.pricePercent}%</span>
                    </td>
                    <td className="col-efficiency text-right efficiency-val">{item.efficiency.toFixed(1)}</td>
                    <td className="col-count text-right">{formatNum(item.maxCount)}개</td>
                    <td className="col-profit text-right profit-val">{formatNum(item.totalProfit)}G</td>
                  </tr>
                  {isExpanded && (
                    <tr className="recipe-detail-row">
                      <td colSpan={7}>
                        <div className="recipe-detail-content">
                          <span className="recipe-detail-label">조합법</span>
                          <span className="recipe-detail-ingredients">{item.ingredients}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}