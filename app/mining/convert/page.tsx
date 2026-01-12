'use client'

import { useState } from 'react'

const ITEMS = [
  { value: 'ability', name: '어빌리티스톤', materials: { corumSlice: 4, liftonSlice: 4, serentSlice: 4 } },
  { value: 'life-low', name: '하급 라이프스톤', materials: { corumIngot: 2, liftonIngot: 2, serentIngot: 2 } },
  { value: 'life-mid', name: '중급 라이프스톤', materials: { lifeLow: 3, corumIngot: 4, liftonIngot: 4, serentIngot: 4 } },
  { value: 'life-high', name: '상급 라이프스톤', materials: { lifeMid: 3, corumIngot: 6, liftonIngot: 6, serentIngot: 6 } },
]

const MATERIAL_NAMES: Record<string, string> = {
  corumSlice: '코룸 조각', liftonSlice: '리프톤 조각', serentSlice: '세렌트 조각',
  corumIngot: '코룸 주괴', liftonIngot: '리프톤 주괴', serentIngot: '세렌트 주괴',
  corumOre: '코룸 광석', liftonOre: '리프톤 광석', serentOre: '세렌트 광석',
  lifeLow: '하급 라이프스톤', lifeMid: '중급 라이프스톤'
}

interface ConvertRow { id: number; item: string; quantity: number }

export default function MiningConvertPage() {
  const [rows, setRows] = useState<ConvertRow[]>([{ id: 1, item: '', quantity: 1 }])
  const [showSet, setShowSet] = useState(false)

  const addRow = () => setRows([...rows, { id: Date.now(), item: '', quantity: 1 }])
  const removeRow = (id: number) => rows.length > 1 && setRows(rows.filter(r => r.id !== id))
  const updateRow = (id: number, field: 'item' | 'quantity', value: string | number) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  // 재료 계산
  const calculateMaterials = () => {
    const materials: Record<string, number> = {}
    
    for (const row of rows) {
      const item = ITEMS.find(i => i.value === row.item)
      if (!item) continue
      
      for (const [mat, count] of Object.entries(item.materials)) {
        materials[mat] = (materials[mat] || 0) + count * row.quantity
      }
    }

    // 하위 재료로 분해
    const expanded: Record<string, number> = { ...materials }
    
    // 중급 라이프스톤 → 하급 + 주괴
    if (expanded.lifeMid) {
      const count = expanded.lifeMid
      expanded.lifeLow = (expanded.lifeLow || 0) + count * 3
      expanded.corumIngot = (expanded.corumIngot || 0) + count * 4
      expanded.liftonIngot = (expanded.liftonIngot || 0) + count * 4
      expanded.serentIngot = (expanded.serentIngot || 0) + count * 4
      delete expanded.lifeMid
    }

    // 하급 라이프스톤 → 주괴
    if (expanded.lifeLow) {
      const count = expanded.lifeLow
      expanded.corumIngot = (expanded.corumIngot || 0) + count * 2
      expanded.liftonIngot = (expanded.liftonIngot || 0) + count * 2
      expanded.serentIngot = (expanded.serentIngot || 0) + count * 2
      delete expanded.lifeLow
    }

    // 세트 표시 (주괴/조각 → 광석)
    if (showSet) {
      if (expanded.corumIngot) {
        expanded.corumOre = (expanded.corumOre || 0) + expanded.corumIngot * 16
        delete expanded.corumIngot
      }
      if (expanded.liftonIngot) {
        expanded.liftonOre = (expanded.liftonOre || 0) + expanded.liftonIngot * 16
        delete expanded.liftonIngot
      }
      if (expanded.serentIngot) {
        expanded.serentOre = (expanded.serentOre || 0) + expanded.serentIngot * 16
        delete expanded.serentIngot
      }
      if (expanded.corumSlice) {
        expanded.corumOre = (expanded.corumOre || 0) + expanded.corumSlice * 16
        delete expanded.corumSlice
      }
      if (expanded.liftonSlice) {
        expanded.liftonOre = (expanded.liftonOre || 0) + expanded.liftonSlice * 16
        delete expanded.liftonSlice
      }
      if (expanded.serentSlice) {
        expanded.serentOre = (expanded.serentOre || 0) + expanded.serentSlice * 16
        delete expanded.serentSlice
      }
    }

    return expanded
  }

  const materials = calculateMaterials()
  const hasResult = Object.keys(materials).length > 0

  return (
    <section className="content-area">
      <h2 className="content-title">변환</h2>

      <div style={{ maxWidth: 600 }}>
        <div className="card">
          <div className="card-body">
            <div className="stamina-inputs-container">
              {rows.map(row => (
                <div key={row.id} className="stamina-input-row">
                  <div className="stamina-input-group">
                    <label className="stamina-label">
                      제작
                      <select 
                        className="stamina-select" 
                        value={row.item}
                        onChange={(e) => updateRow(row.id, 'item', e.target.value)}
                      >
                        <option value="">선택</option>
                        {ITEMS.map(item => (
                          <option key={item.value} value={item.value}>{item.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="stamina-label">
                      수량
                      <input 
                        type="number" 
                        className="stamina-input" 
                        min={1}
                        value={row.quantity}
                        onChange={(e) => updateRow(row.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: 80 }}
                      />
                    </label>
                  </div>
                  {rows.length > 1 && (
                    <button className="btn-remove" onClick={() => removeRow(row.id)}>×</button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <span style={{ fontSize: '0.85rem' }}>세트 표시 (광석으로 환산)</span>
              <label style={{ position: 'relative', width: 44, height: 24 }}>
                <input 
                  type="checkbox" 
                  checked={showSet}
                  onChange={(e) => setShowSet(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                  background: showSet ? 'var(--color-primary)' : '#ccc',
                  borderRadius: 24, transition: '0.3s'
                }}>
                  <span style={{
                    position: 'absolute', height: 18, width: 18, left: showSet ? 23 : 3, bottom: 3,
                    background: 'white', borderRadius: '50%', transition: '0.3s'
                  }} />
                </span>
              </label>
            </div>

            <div className="stamina-actions">
              <button className="btn-add" onClick={addRow}>+ 추가</button>
            </div>

            {/* 결과 */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>📦 필요 재료</h4>
              {hasResult ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {Object.entries(materials).map(([key, count]) => (
                    <div key={key} style={{
                      background: 'var(--color-bg)',
                      padding: '10px 16px',
                      borderRadius: 8,
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{MATERIAL_NAMES[key] || key}</span>
                      <span style={{ marginLeft: 8, fontWeight: 600, color: 'var(--color-primary)' }}>
                        {count.toLocaleString()}개
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  제작할 아이템을 선택하세요
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
