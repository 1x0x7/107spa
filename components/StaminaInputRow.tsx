'use client'

// =========================
// 스태미나 계산기 공통 입력 행 컴포넌트
// mining / farming / ocean / hunting 스태미나 페이지 공용
// =========================

interface Option {
  value: string
  label: string
}

interface StaminaInputRowProps {
  id: number
  stamina: string
  selectedType: string
  typeLabel: string
  options: Option[]
  showRemove: boolean
  onStaminaChange: (value: string) => void
  onTypeChange: (value: string) => void
  onRemove: () => void
  onEnter: () => void
  staminaPlaceholder?: string
}

export function StaminaInputRow({
  id,
  stamina,
  selectedType,
  typeLabel,
  options,
  showRemove,
  onStaminaChange,
  onTypeChange,
  onRemove,
  onEnter,
  staminaPlaceholder = '3000',
}: StaminaInputRowProps) {
  return (
    <div className="stamina-input-row">
      <div className="stamina-input-group">
        <span className="stamina-label">스태미나</span>
        <input
          type="number"
          className="stamina-input"
          placeholder={staminaPlaceholder}
          value={stamina}
          onChange={(e) => onStaminaChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter()}
        />
        <span className="stamina-label">{typeLabel}</span>
        <select
          className="stamina-select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {showRemove && (
        <button className="btn-remove" onClick={onRemove}>
          ×
        </button>
      )}
    </div>
  )
}
