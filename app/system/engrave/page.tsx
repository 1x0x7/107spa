'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ENGRAVING_DATA, CONTRACT_TYPES, DEFAULT_PRICES, ENGRAVE_OPTIONS } from '@/data/engrave-data'
import { 
  TierType, 
  calculateEngraving
} from './engrave'
import '@/app/styles/enchant-engrave.css'

type ContractType = 'prosperity' | 'crushing' | 'tide' | 'conquest'
type StoneType = 'rough' | 'neat' | 'precise'

export default function EngravingPage() {
  const [targetLevel, setTargetLevel] = useState(1)
  const [selectedContract, setSelectedContract] = useState<ContractType>('prosperity')
  const [selectedStone, setSelectedStone] = useState<StoneType>('rough')
  const [selectedTier, setSelectedTier] = useState<TierType>('expected')
  const [prices, setPrices] = useState(DEFAULT_PRICES)
  const [showGuide, setShowGuide] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const fmt = (n: number) => n.toLocaleString()

  // 선택된 레벨로 시작레벨 자동 계산 (targetLevel - 1 → targetLevel)
  const startLevel = Math.max(0, targetLevel - 1)

  // 선택된 단계들의 데이터
  const selectedStages = useMemo(() => {
    if (targetLevel === 0) return []
    return ENGRAVING_DATA.slice(startLevel, targetLevel)
  }, [startLevel, targetLevel])

  // 각인석 확률
  const stoneProbability = selectedStone === 'rough' ? 5 : selectedStone === 'neat' ? 10 : 15

  // 결과 계산
  const result = useMemo(() => {
    if (selectedStages.length === 0) return null
    return calculateEngraving(selectedStages, selectedStone, selectedTier, prices, selectedContract)
  }, [selectedStages, selectedStone, selectedTier, prices, selectedContract])

  // 선택된 도구의 각인 옵션
  const currentOptions = ENGRAVE_OPTIONS[selectedContract]

  const tierOptions: { key: TierType; label: string }[] = [
    { key: 'lucky', label: '상위 25%' },
    { key: 'median', label: '중앙값' },
    { key: 'expected', label: '평균' },
    { key: 'unlucky', label: '하위 25%' },
  ]

  // 리플 효과 핸들러
  const handleTierClick = (e: React.MouseEvent<HTMLButtonElement>, key: TierType) => {
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

  // 계약서 이미지 맵핑
  const contractImages: Record<ContractType, string> = {
    prosperity: '/img/engrave/farming.png',
    crushing: '/img/engrave/mining.png',
    tide: '/img/engrave/ocean.png',
    conquest: '/img/engrave/hunting.png'
  }

  return (
    <div className="engrave-page-wrapper">
      {/* 기존 메인 컨텐츠 (변경 없음) */}
      <div className="enchant-container">
        {/* 왼쪽 사이드 패널 - 각인 옵션 (추가) */}
        <div className="side-panel-left">
          <div className="enchant-card data-card">
            <button 
              className={`data-toggle ${showOptions ? 'open' : ''}`}
              onClick={() => setShowOptions(!showOptions)}
            >
              <span>{currentOptions.tool} 각인 옵션</span>
              <span className="toggle-icon">{showOptions ? '▼' : 'ㅡ'}</span>
            </button>
            <div className={`data-table-wrapper ${showOptions ? 'open' : ''}`}>
              <div className="guide-content">
                {currentOptions.options.map((option, idx) => (
                  <div key={idx} className="guide-section">
                    <h4>{option.name}</h4>
                    <ul>
                      {option.levels.map((level, levelIdx) => (
                        <li key={levelIdx}>{level}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 각인 가이드 (토글) */}
        <div className="enchant-card data-card">
          <button 
            className={`data-toggle ${showGuide ? 'open' : ''}`}
            onClick={() => setShowGuide(!showGuide)}
          >
            <span>각인 가이드</span>
            <span className="toggle-icon">{showGuide ? '▼' : 'ㅡ'}</span>
          </button>
          <div className={`data-table-wrapper ${showGuide ? 'open' : ''}`}>
            <div className="guide-content">
              <div className="guide-section">
                <h4>영혼 계약서</h4>
                <p>각인 진행 시 소모되는 보조 재료입니다. 동물의 영혼 + 영혼 불꽃 제작을 통해 얻을 수 있습니다.</p>
                <ul>
                  <li>Lv 1 = 3장 / Lv 2 = 6장 / Lv 3 = 9장 / Lv 4 = 12장</li>
                </ul>
              </div>
              <div className="guide-section">
                <h4>각인석</h4>
                <p>도구에 각인 효과를 부여하는 핵심 아이템입니다. 사냥 전문가 활동으로 얻을 수 있습니다.</p>
                <ul>
                  <li>투박한: 5% (200,000G, 10R)</li>
                  <li>단정한: 10% (400,000G, 20R)</li>
                  <li>정교한: 15% (600,000G, 30R)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 입력 영역 2열 */}
        <div className="enchant-input-grid">
          {/* 1. 영혼 계약서 시세 */}
          <div className="enchant-card">
            <div className="enchant-card-header">
              영혼 계약서 시세
              <span className="price-date">02.11 기준</span>
            </div>
            <div className="enchant-card-body">
              <div className="price-input-row">
                <span className="price-label">
                  <Image src="/img/engrave/farming.png" alt="번영" width={20} height={20} />
                  번영
                </span>
                <input
                  type="number"
                  className="price-input"
                  value={prices.prosperity}
                  onChange={(e) => setPrices({ ...prices, prosperity: Number(e.target.value) })}
                />
                <span className="price-unit">G</span>
              </div>
              <div className="price-input-row">
                <span className="price-label">
                  <Image src="/img/engrave/mining.png" alt="파쇄" width={20} height={20} />
                  파쇄
                </span>
                <input
                  type="number"
                  className="price-input"
                  value={prices.crushing}
                  onChange={(e) => setPrices({ ...prices, crushing: Number(e.target.value) })}
                />
                <span className="price-unit">G</span>
              </div>
              <div className="price-input-row">
                <span className="price-label">
                  <Image src="/img/engrave/ocean.png" alt="만조" width={20} height={20} />
                  만조
                </span>
                <input
                  type="number"
                  className="price-input"
                  value={prices.tide}
                  onChange={(e) => setPrices({ ...prices, tide: Number(e.target.value) })}
                />
                <span className="price-unit">G</span>
              </div>
              <div className="price-input-row">
                <span className="price-label">
                  <Image src="/img/engrave/hunting.png" alt="정복" width={20} height={20} />
                  정복
                </span>
                <input
                  type="number"
                  className="price-input"
                  value={prices.conquest}
                  onChange={(e) => setPrices({ ...prices, conquest: Number(e.target.value) })}
                />
                <span className="price-unit">G</span>
              </div>
            </div>
          </div>

          {/* 2. 각인석 시세 */}
          <div className="enchant-card">
            <div className="enchant-card-header">각인석 시세</div>
            <div className="enchant-card-body">
              <div className="price-input-row">
                <span className="price-label">투박한</span>
                <input
                  type="number"
                  className="price-input"
                  value={prices.rough}
                  onChange={(e) => setPrices({ ...prices, rough: Number(e.target.value) })}
                />
                <span className="price-unit">G</span>
              </div>
              <div className="price-input-row">
                <span className="price-label">단정한</span>
                <input
                  type="number"
                  className="price-input"
                  value={prices.neat}
                  onChange={(e) => setPrices({ ...prices, neat: Number(e.target.value) })}
                />
                <span className="price-unit">G</span>
              </div>
              <div className="price-input-row">
                <span className="price-label">정교한</span>
                <input
                  type="number"
                  className="price-input"
                  value={prices.precise}
                  onChange={(e) => setPrices({ ...prices, precise: Number(e.target.value) })}
                />
                <span className="price-unit">G</span>
              </div>
            </div>
          </div>
        </div>

        {/* 각인 설정 */}
        <div className="enchant-input-grid">
          {/* 각인 단계 */}
          <div className="enchant-card">
            <div className="enchant-card-header">각인 단계</div>
            <div className="enchant-card-body">
              <div className="level-select-row">
                <span className="level-label">목표</span>
                <select
                  className="level-select"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                >
                  {[...Array(4)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Lv{i} → Lv{i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 계약서 & 각인석 선택 */}
          <div className="enchant-card">
            <div className="enchant-card-header">사용 재료</div>
            <div className="enchant-card-body">
              <div className="level-select-row">
                <span className="level-label">계약서</span>
                <select
                  className="level-select"
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value as ContractType)}
                >
                  <option value="prosperity">번영 (괭이)</option>
                  <option value="crushing">파쇄 (곡괭이)</option>
                  <option value="tide">만조 (낚싯대)</option>
                  <option value="conquest">정복 (대검)</option>
                </select>
              </div>
              <div className="level-select-row">
                <span className="level-label">각인석</span>
                <select
                  className="level-select"
                  value={selectedStone}
                  onChange={(e) => setSelectedStone(e.target.value as StoneType)}
                >
                  <option value="rough">투박한 (5%)</option>
                  <option value="neat">단정한 (10%)</option>
                  <option value="precise">정교한 (15%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 확률 구간 선택 */}
        <div className="tier-selector">
          {tierOptions.map(({ key, label }) => {
            return (
              <button
                key={key}
                className={`tier-btn ${selectedTier === key ? 'active' : ''}`}
                onClick={(e) => handleTierClick(e, key)}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* 예상 시도 횟수 */}
        {result && (
          <div className="stats-box">
            <div className="stat-item">
              <span className="stat-label">예상 시도 횟수</span>
              <span className="stat-value">{fmt(result.totalTrials)}회</span>
            </div>
          </div>
        )}

        {/* 결과 카드 */}
        {result ? (
          <div className="enchant-card">
            <div className="result-header">
              <span className="result-title">
                Lv.{startLevel} → Lv.{targetLevel}
                <span className="result-tier-badge">
                  {tierOptions.find(t => t.key === selectedTier)?.label}
                </span>
              </span>
              <span className="result-total">💰 {fmt(result.totalCost)}</span>
            </div>

            <div className="result-body">
              <div className="result-grid">
                {/* 필요 재료 */}
                <div className="result-section">
                  <div className="result-section-header">필요 재료</div>
                  
                  <div className="result-row">
                    <span className="result-row-label">
                      <Image src={contractImages[selectedContract]} alt={CONTRACT_TYPES[selectedContract].name} width={18} height={18} />
                      {CONTRACT_TYPES[selectedContract].name}
                    </span>
                    <span className="result-row-value">
                      <span className="result-row-count">{fmt(result.totalContracts)}장</span>
                      <span className="result-row-cost">{fmt(result.totalContracts * prices[selectedContract])} G</span>
                    </span>
                  </div>
                  
                  <div className="result-row">
                    <span className="result-row-label">
                      {selectedStone === 'rough' ? '투박한' : selectedStone === 'neat' ? '단정한' : '정교한'} 각인석
                    </span>
                    <span className="result-row-value">
                      <span className="result-row-count">{fmt(result.totalTrials)}개</span>
                      <span className="result-row-cost">{fmt(result.totalStoneCost)} G</span>
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
                  
                  <div className="result-row total">
                    <span className="result-row-label">재료 합계</span>
                    <span className="result-row-value">
                      {fmt(result.totalContracts * prices[selectedContract] + result.totalStoneCost)} G
                    </span>
                  </div>
                </div>

                {/* 필요 재화 */}
                <div className="result-section">
                  <div className="result-section-header">필요 재화</div>
                  
                  <div className="result-row">
                    <span className="result-row-label">각인 비용</span>
                    <span className="result-row-value">
                      <span className="result-row-count">{fmt(result.totalGold)} G</span>
                    </span>
                  </div>
                  
                  <div className="result-row">
                    <span className="result-row-label">재료 비용</span>
                    <span className="result-row-value">
                      <span className="result-row-count">
                        {fmt(result.totalContracts * prices[selectedContract] + result.totalStoneCost)} G
                      </span>
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
              각인 단계를 선택하세요
            </div>
          </div>
        )}
      </div>
    </div>
  )
}