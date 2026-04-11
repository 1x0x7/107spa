'use client'

// =========================
// 보너스 요약 표시 컴포넌트
// dangerouslySetInnerHTML 없이 JSX로 보너스 항목을 표시
// =========================

interface BonusItem {
  label: string          // 설명 텍스트 (예: "광물 추가 0% →")
  before?: number        // 적용 전 수치 (%)
  after: number          // 적용 후 수치 (%)
  source: string         // 출처 (예: "럭키 히트 +15%")
}

interface BonusSummaryProps {
  title?: string
  items: (BonusItem | false | null | undefined)[]
}

export function BonusSummary({ title = '적용 보너스', items }: BonusSummaryProps) {
  const validItems = items.filter(Boolean) as BonusItem[]
  if (validItems.length === 0) return null

  return (
    <div className="bonus-summary">
      <div className="bonus-summary-title">{title}</div>
      {validItems.map((item, i) => (
        <span key={i}>
          {item.label} {item.before !== undefined ? `${item.before}% → ` : ''}
          <strong>{item.after}%</strong> ({item.source})
          {i < validItems.length - 1 && ' · '}
        </span>
      ))}
    </div>
  )
}
