'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UPDATE_HISTORY, 
  PRICE_DATES,
  ENCHANT_PRICES,
  ENGRAVE_PRICES,
  SOUL_CONTRACTS
} from '@/data/updates'
import { getTopEfficiency } from '@/utils/cooking-efficiency'

export default function HomePage() {
  const [selectedUpdate, setSelectedUpdate] = useState<string | null>(null)

  const latestUpdate = UPDATE_HISTORY.find(u => u.isLatest)
  const pastUpdates = UPDATE_HISTORY.filter(u => !u.isLatest)

  // 효율 Top 3 자동 계산 (기본 스펙 기준)
  const topCooking = getTopEfficiency()

  const fmt = (n: number) => n.toLocaleString()

  const handleUpdateClick = (id: string) => {
    setSelectedUpdate(selectedUpdate === id ? null : id)
  }

  const getSelectedUpdateData = () => {
    if (!selectedUpdate) return null
    if (selectedUpdate === 'latest') return latestUpdate
    const idx = parseInt(selectedUpdate.replace('update-', ''))
    return pastUpdates[idx]
  }

  const selectedUpdateData = getSelectedUpdateData()

  return (
    <>
      {/* 사용법 */}
      <section className="content-block usage-warning">
        정보 탭에 본인 스펙 입력 후, 계산기 활용
      </section>

      {/* 메인 2단 레이아웃 */}
      <section className="home-main-grid">
        {/* 왼쪽: 업데이트 통합 블록 */}
        <div className="home-update-block">
          {/* 기본 상태 */}
          <div className={`home-update-default ${selectedUpdate ? 'hidden' : ''}`}>
            {/* 최신 업데이트 */}
            {latestUpdate && (
              <div 
                className="home-latest-update"
                onClick={() => handleUpdateClick('latest')}
              >
                <div className="home-update-header">
                  <span className="home-update-badge">최신 업데이트</span>
                  <span className="home-update-hint">클릭하여 자세히 ▼</span>
                </div>
                
                <div className="home-update-title">{latestUpdate.title}</div>
                
                {latestUpdate.desc && (
                  <div className="home-update-desc">{latestUpdate.desc}</div>
                )}
                
                <div className="home-update-date">{latestUpdate.date}</div>
              </div>
            )}

            {/* 업데이트 내역 */}
            <div className="home-update-history">
              <span className="home-history-title">업데이트 내역</span>
              <div className="home-history-list">
                {pastUpdates.slice(0, 4).map((item, idx) => (
                  <div 
                    key={idx}
                    className="home-history-item"
                    onClick={() => handleUpdateClick(`update-${idx}`)}
                  >
                    <span className="home-history-name">{item.title}</span>
                    <span className="home-history-date">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상세보기 상태 */}
          <div className={`home-update-detail ${selectedUpdate ? 'visible' : ''}`}>
            {selectedUpdateData && (
              <>
                <div className="home-detail-header">
                  <span className="home-detail-badge">
                    {selectedUpdate === 'latest' ? '최신 업데이트 상세' : '업데이트 상세'}
                  </span>
                  <button 
                    className="home-detail-close"
                    onClick={() => setSelectedUpdate(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="home-detail-title">{selectedUpdateData.title}</div>
                <div className="home-detail-date">{selectedUpdateData.date}</div>

                {selectedUpdateData.desc && (
                  <div className="home-detail-desc">{selectedUpdateData.desc}</div>
                )}

                {selectedUpdateData.details?.changes && selectedUpdateData.details.changes.length > 0 && (
                  <div className="home-detail-section">
                    <div className="home-detail-section-title">변경사항</div>
                    <ul className="home-detail-list">
                      {selectedUpdateData.details.changes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUpdateData.details?.fixes && selectedUpdateData.details.fixes.length > 0 && (
                  <div className="home-detail-section">
                    <div className="home-detail-section-title">버그 수정</div>
                    <ul className="home-detail-list">
                      {selectedUpdateData.details.fixes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUpdateData.details?.notes && selectedUpdateData.details.notes.length > 0 && (
                  <div className="home-detail-section">
                    <div className="home-detail-section-title">예정</div>
                    <ul className="home-detail-list">
                      {selectedUpdateData.details.notes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 오른쪽: 카드 3개 */}
        <div className="home-cards">
          {/* 요리 순위 카드 */}
          <Link href="/farming/efficiency" className="home-card">
            <div className="home-card-header">
              <span className="home-card-title">요리 순위</span>
              <span className="home-card-date">{PRICE_DATES.cooking}</span>
            </div>
            <div className="home-card-body">
              {topCooking.map((item) => (
                <div key={item.rank} className="home-rank-item">
                  <span className="home-rank-number">{item.rank}.</span>
                  <img loading="eager" src={item.img} alt={item.name} className="home-rank-img" />
                  <span className={`home-rank-name rank-${item.rank}`}>{item.name}</span>
                  <span className={`home-rank-percent ${item.rank === 1 ? 'top' : ''}`}>
                    {item.percent}%
                  </span>
                  <span className="home-rank-price">{fmt(item.price)}G</span>
                </div>
              ))}
            </div>
          </Link>

          {/* 해양 공예품 카드 */}
          <div className="home-card disabled">
            <div className="home-card-header">
              <span className="home-card-title">해양 공예품</span>
              <span className="home-card-date">{PRICE_DATES.system}</span>
            </div>
            <div className="home-card-body empty">
              <span className="home-card-empty-text">준비중</span>
            </div>
          </div>

          {/* 시스템 시세 카드 */}
          <Link href="/system/enchant" className="home-card">
            <div className="home-card-header">
              <span className="home-card-title">시스템 시세</span>
              <span className="home-card-date">{PRICE_DATES.system}</span>
            </div>
            <div className="home-card-body two-col">
              {/* 라이프스톤 */}
              <div className="home-price-section lifestone">
                <div className="home-price-title">라이프스톤</div>
                <div className="home-price-row">
                  <span className="home-price-label">하급</span>
                  <span className="home-price-value">{fmt(ENCHANT_PRICES.lowStone)}</span>
                </div>
                <div className="home-price-row">
                  <span className="home-price-label">중급</span>
                  <span className="home-price-value">{fmt(ENCHANT_PRICES.midStone)}</span>
                </div>
                <div className="home-price-row">
                  <span className="home-price-label">상급</span>
                  <span className="home-price-value">{fmt(ENCHANT_PRICES.highStone)}</span>
                </div>
              </div>
              
              {/* 영혼 계약서 - 2x2 그리드 */}
              <div className="home-price-section contract">
                <div className="home-price-title">영혼 계약서</div>
                <div className="home-price-grid">
                  {SOUL_CONTRACTS.map((contract) => (
                    <div key={contract.key} className="home-price-row">
                      <img loading="eager" src={contract.img} alt={contract.name} className="home-price-img" />
                      <span className="home-price-label">{contract.name}</span>
                      <span className="home-price-value">{fmt(ENGRAVE_PRICES[contract.key as keyof typeof ENGRAVE_PRICES])}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}
