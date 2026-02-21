'use client'

import { useState, useMemo } from 'react'

const GoldIcon = () => (
  <img 
    src="/img/gold.png" 
    alt="골드" 
    style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }} 
  />
)
import { ENCHANT_DATA, DEFAULT_PRICES } from '@/data/enchant-data'
import { 
  TierType, 
  calculateEnchant, 
  calculateConsecutiveChance,
  formatChance 
} from './enchant-calculator'
import '@/app/styles/enchant-engrave.css'
import Image from 'next/image'

export default function EnchantPage() {
  const [startLevel, setStartLevel] = useState(0)
  const [targetLevel, setTargetLevel] = useState(10)
  const [selectedTier, setSelectedTier] = useState<TierType>('expected')
  const [prices, setPrices] = useState(DEFAULT_PRICES)
  const [showData, setShowData] = useState(false) // 단계별 데이터 토글

  const fmt = (n: number) => n.toLocaleString()

  // 선택된 단계들의 데이터
  const selectedStages = useMemo(() => {
    if (startLevel >= targetLevel) return []
    return ENCHANT_DATA.slice(startLevel, targetLevel)
  }, [startLevel, targetLevel])

  // 확률 구간 선택 가능 여부
  const hasVariableChance = useMemo(() => {
    return selectedStages.some(s => s.chance < 100)
  }, [selectedStages])

  // 연속 성공 확률
  const consecutiveChance = useMemo(() => {
    return calculateConsecutiveChance(selectedStages)
  }, [selectedStages])

  // 결과 계산
  const result = useMemo(() => {
    return calculateEnchant(selectedStages, selectedTier, prices)
  }, [selectedStages, selectedTier, prices])

  const tierOptions: { key: TierType; label: string }[] = [
    { key: 'lucky', label: '상위 25%' },
    { key: 'median', label: '중앙값' },
    { key: 'expected', label: '평균' },
    { key: 'unlucky', label: '하위 25%' },
  ]

  // 리플 효과 핸들러
  const handleTierClick = (e: React.MouseEvent<HTMLButtonElement>, key: TierType) => {
    if (!hasVariableChance && key !== 'expected') return
    
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ripple = document.createElement('span')
    ripple.className = 'ripple-fade'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    button.appendChild(ripple)
    
    setTimeout(() => ripple.remove(), 500)
    setSelectedTier(key)
  }

  return (
    <div className="enchant-container">
      {/* 단계별 데이터 (토글) */}
      <div className="enchant-card data-card">
        <button 
          className={`data-toggle ${showData ? 'open' : ''}`}
          onClick={() => setShowData(!showData)}
        >
          <span>단계별 데이터</span>
          <span className="toggle-icon">{showData ? '▼' : 'ㅡ'}</span>
        </button>
        <div className={`data-table-wrapper ${showData ? 'open' : ''}`}>
            {selectedStages.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>단계</th>
                    <th>확률</th>
                    <th>골드</th>
                    <th>스톤 (하/중/상)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStages.map((stage) => (
                    <tr key={stage.level}>
                      <td className="center level">{stage.level}강</td>
                      <td className={`center ${
                        stage.chance === 100 ? 'chance-100' : 
                        stage.chance >= 50 ? 'chance-high' : 'chance-low'
                      }`}>
                        {stage.chance}%
                      </td>
                      <td className="center">{fmt(stage.gold)}</td>
                      <td className="center stone-info">
                        {stage.lowStone}/{stage.midStone}/{stage.highStone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="data-empty">단계를 선택하세요</div>
            )}
          </div>
      </div>

      {/* 입력 영역 2열 */}
      <div className="enchant-input-grid">
        {/* 1. 라이프스톤 시세 */}
        <div className="enchant-card">
          <div className="enchant-card-header">
            라이프스톤 시세
            <span className="price-date">02.21 기준</span>
          </div>
          <div className="enchant-card-body">
            <div className="price-input-row">
              <span className="price-label">
                <Image src="/img/mining/low.png" alt="하급" width={20} height={20} />
                하급
              </span>
              <input
                type="number"
                className="price-input"
                value={prices.lowStone}
                onChange={(e) => setPrices({ ...prices, lowStone: Number(e.target.value) })}
              />
              <span className="price-unit">G</span>
            </div>
            <div className="price-input-row">
              <span className="price-label">
                <Image src="/img/mining/mid.png" alt="중급" width={20} height={20} />
                중급
              </span>
              <input
                type="number"
                className="price-input"
                value={prices.midStone}
                onChange={(e) => setPrices({ ...prices, midStone: Number(e.target.value) })}
              />
              <span className="price-unit">G</span>
            </div>
            <div className="price-input-row">
              <span className="price-label">
                <Image src="/img/mining/high.png" alt="상급" width={20} height={20} />
                상급
              </span>
              <input
                type="number"
                className="price-input"
                value={prices.highStone}
                onChange={(e) => setPrices({ ...prices, highStone: Number(e.target.value) })}
              />
              <span className="price-unit">G</span>
            </div>
          </div>
        </div>

        {/* 2. 강화 단계 */}
        <div className="enchant-card">
          <div className="enchant-card-header">강화 단계</div>
          <div className="enchant-card-body">
            <div className="level-select-row">
              <span className="level-label">시작</span>
              <select
                className="level-select"
                value={startLevel}
                onChange={(e) => setStartLevel(Number(e.target.value))}
              >
                {[...Array(15)].map((_, i) => (
                  <option key={i} value={i}>{i}강</option>
                ))}
              </select>
            </div>
            <div className="level-select-row">
              <span className="level-label">목표</span>
              <select
                className="level-select"
                value={targetLevel}
                onChange={(e) => setTargetLevel(Number(e.target.value))}
              >
                {[...Array(15)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}강</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 확률 구간 선택 */}
      <div className="tier-selector">
        {tierOptions.map(({ key, label }) => {
          const isDisabled = startLevel >= targetLevel || (!hasVariableChance && key !== 'expected')
          return (
            <button
              key={key}
              className={`tier-btn ${selectedTier === key ? 'active' : ''}`}
              onClick={(e) => handleTierClick(e, key)}
              disabled={isDisabled}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* 예상 시도 횟수 & 연속 성공 확률 (합쳐진 블록) */}
      {result && startLevel < targetLevel && (
        <div className="stats-box">
          <div className="stat-item">
            <span className="stat-label">예상 시도 횟수</span>
            <span className="stat-value">{fmt(result.totalTrials)}회</span>
          </div>
          {consecutiveChance !== null && (
            <>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-label">연속 성공 확률</span>
                <span className="stat-value">{formatChance(consecutiveChance)}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 결과 카드 */}
      {result && startLevel < targetLevel ? (
        <div className="enchant-card">
          <div className="result-header">
            <span className="result-title">
              {startLevel}강 → {targetLevel}강 견적
              <span className="result-tier-badge">
                {hasVariableChance ? tierOptions.find(t => t.key === selectedTier)?.label : '확정'}
              </span>
            </span>
            <span className="result-total"><GoldIcon /> {fmt(result.totalCost)}</span>
          </div>

          <div className="result-body">
            <div className="result-grid">
              {/* 필요 라이프스톤 */}
              <div className="result-section">
                <div className="result-section-header">필요 라이프스톤</div>
                
                <div className="result-row">
                  <span className="result-row-label stone">
                    <img src="/img/mining/low.png" alt="하급" />
                    하급
                  </span>
                  <span className="result-row-value">
                    <span className="result-row-count">{fmt(result.totalLowStone)}개</span>
                    <span className="result-row-cost">{fmt(result.totalLowStone * prices.lowStone)} G</span>
                  </span>
                </div>
                
                <div className="result-row">
                  <span className="result-row-label stone">
                    <img src="/img/mining/mid.png" alt="중급" />
                    중급
                  </span>
                  <span className="result-row-value">
                    <span className="result-row-count">{fmt(result.totalMidStone)}개</span>
                    <span className="result-row-cost">{fmt(result.totalMidStone * prices.midStone)} G</span>
                  </span>
                </div>
                
                <div className="result-row">
                  <span className="result-row-label stone">
                    <img src="/img/mining/high.png" alt="상급" />
                    상급
                  </span>
                  <span className="result-row-value">
                    <span className="result-row-count">{fmt(result.totalHighStone)}개</span>
                    <span className="result-row-cost">{fmt(result.totalHighStone * prices.highStone)} G</span>
                  </span>
                </div>
                
                <div className="result-row total">
                  <span className="result-row-label">라이프스톤 합계</span>
                  <span className="result-row-value">{fmt(result.stoneGoldCost)} G</span>
                </div>
              </div>

              {/* 필요 재화 */}
              <div className="result-section">
                <div className="result-section-header">필요 재화</div>
                
                <div className="result-row">
                  <span className="result-row-label">강화 비용</span>
                  <span className="result-row-value">
                    <span className="result-row-count">{fmt(result.totalGold)} G</span>
                  </span>
                </div>
                
                <div className="result-row">
                  <span className="result-row-label">라이프스톤 비용</span>
                  <span className="result-row-value">
                    <span className="result-row-count">{fmt(result.stoneGoldCost)} G</span>
                  </span>
                </div>
                
                {result.totalRuby > 0 && (
                  <div className="result-row">
                    <span className="result-row-label">루비</span>
                    <span className="result-row-value">
                      <span className="result-row-count ruby">{fmt(result.totalRuby)}개</span>
                    </span>
                  </div>
                )}
                
                <div className="result-row total grand-total">
                  <span className="result-row-label">총 비용</span>
                  <span className="result-row-value">{fmt(result.totalCost)} G</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="enchant-card">
          <div className="result-empty">
            {startLevel >= targetLevel 
              ? '다시 선택해 주세요'
              : '강화 단계를 선택하세요'
            }
          </div>
        </div>
      )}
    </div>
  )
}