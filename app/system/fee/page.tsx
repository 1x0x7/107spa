'use client'

import { useState, useMemo } from 'react'
import { FeeType, FEE_INFO, calculateFee } from './fee-calculator'
import './fee.css'

export default function FeePage() {
  const [amountStr, setAmountStr] = useState('')
  const [selectedType, setSelectedType] = useState<FeeType>('shop')
  const [showSummary, setShowSummary] = useState(false)

  const fmt = (n: number) => n.toLocaleString()

  const amount = useMemo(() => {
    const num = Number(amountStr.replace(/,/g, ''))
    return isNaN(num) ? 0 : num
  }, [amountStr])

  const result = useMemo(() => {
    if (amount <= 0) return null
    return calculateFee(amount, selectedType)
  }, [amount, selectedType])

  const feeTypes: { key: FeeType; label: string }[] = [
    { key: 'shop', label: '유저상점/플리마켓' },
    { key: 'transfer', label: '송금' },
    { key: 'bank', label: '은행' },
  ]

  // 리플 효과 핸들러
  const handleTypeClick = (e: React.MouseEvent<HTMLButtonElement>, key: FeeType) => {
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
    setSelectedType(key)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmountStr(value)
  }

  return (
    <div className="fee-container">
      {/* 수수료 요약 (토글) */}
      <div className="fee-card summary-card">
        <button 
          className={`summary-toggle ${showSummary ? 'open' : ''}`}
          onClick={() => setShowSummary(!showSummary)}
        >
          <span>수수료 요약</span>
          <span className="toggle-icon">{showSummary ? '▼' : 'ㅡ'}</span>
        </button>
        <div className={`summary-table-wrapper ${showSummary ? 'open' : ''}`}>
          <table className="summary-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>수수료</th>
                <th>부담</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>유저상점/플리마켓</td>
                <td className="center">5%</td>
                <td className="center">판매자</td>
              </tr>
              <tr>
                <td>송금</td>
                <td className="center">5%</td>
                <td className="center">송금자</td>
              </tr>
              <tr>
                <td>은행</td>
                <td className="center">5%</td>
                <td className="center">입금자</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 금액 입력 */}
      <div className="fee-card">
        <div className="fee-card-header">금액 입력</div>
        <div className="fee-card-body">
          <div className="amount-input-row">
            <input
              type="text"
              inputMode="numeric"
              className="amount-input"
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="10,000"
            />
            <span className="amount-unit">G</span>
          </div>
        </div>
      </div>

      {/* 수수료 종류 선택 */}
      <div className="type-selector">
        {feeTypes.map(({ key, label }) => (
          <button
            key={key}
            className={`type-btn ${selectedType === key ? 'active' : ''}`}
            onClick={(e) => handleTypeClick(e, key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 설명 */}
      <div className="fee-description">
        <div className="fee-usecase">{FEE_INFO[selectedType].useCase}</div>
        <div className="fee-formula">{FEE_INFO[selectedType].description}</div>
      </div>

      {/* 결과 */}
      {result && amount > 0 ? (
        <div className="fee-card">
          <div className="result-header">
            <span className="result-title">
              {FEE_INFO[selectedType].name}
              <span className="result-badge">수수료 {result.feeRate}%</span>
            </span>
          </div>
          <div className="result-body">
            <div className="result-row">
              <span className="result-label">
                {selectedType === 'transfer' ? '송금액' : 
                 selectedType === 'bank' ? '입금액' : '판매액'}
              </span>
              <span className="result-value">{fmt(result.inputAmount)} G</span>
            </div>
            
            <div className="result-row fee">
              <span className="result-label">수수료</span>
              <span className="result-value">
                {selectedType === 'transfer' ? '+' : '-'} {fmt(result.feeAmount)} G
              </span>
            </div>
            
            <div className="result-row total">
              <span className="result-label">
                {selectedType === 'transfer' ? '실제 차감액' : 
                 selectedType === 'bank' ? '실제 저장액' : '실수령액'}
              </span>
              <span className="result-value highlight">
                💰 {fmt(result.resultAmount)} G
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="fee-card">
          <div className="result-empty">
            금액을 입력하세요
          </div>
        </div>
      )}
    </div>
  )
}