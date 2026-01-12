'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { FARMING_EXPERT_DESC, COOKING_RECIPES, PROCESSING_RECIPES } from '@/data/farming'

type RecipeTab = 'cooking' | 'processing'

export default function FarmingInfoPage() {
  const { farming, updateFarming } = useExpert()
  const [activeTab, setActiveTab] = useState<RecipeTab>('cooking')
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name')

  const skills = [
    { key: 'gift', name: '☘️ 자연이 주는 선물', max: 10, desc: FARMING_EXPERT_DESC.gift },
    { key: 'harvest', name: '🌾 오늘도 풍년이다!', max: 7, desc: FARMING_EXPERT_DESC.harvest },
    { key: 'pot', name: '🥘 한 솥 가득', max: 5, desc: FARMING_EXPERT_DESC.pot },
    { key: 'money', name: '💰 돈 좀 벌어볼까?', max: 10, desc: FARMING_EXPERT_DESC.money },
    { key: 'king', name: '👑 왕 크니까 왕 좋아', max: 4, desc: FARMING_EXPERT_DESC.king },
    { key: 'seedBonus', name: '🌱 씨앗은 덤이야', max: 10, desc: FARMING_EXPERT_DESC.seedBonus },
    { key: 'fire', name: '🐦‍🔥 불붙은 괭이', max: 10, desc: FARMING_EXPERT_DESC.fire },
  ]

  const fmt = (n: number) => n.toLocaleString()

  // 요리 필터/정렬
  let filteredRecipes = COOKING_RECIPES.filter(r => 
    r.name.includes(searchTerm) || r.ingredients.includes(searchTerm)
  )
  if (sortBy === 'price-low') filteredRecipes = [...filteredRecipes].sort((a, b) => a.minPrice - b.minPrice)
  else if (sortBy === 'price-high') filteredRecipes = [...filteredRecipes].sort((a, b) => b.maxPrice - a.maxPrice)

  return (
    <section className="content-area">
      <h2 className="content-title">정보</h2>

      <div className="info-grid">
        {/* 왼쪽: 전문가 세팅 */}
        <div className="info-left">
          <div className="card compact-card">
            <div className="card-header">
              <h3 className="card-title">현재 전문가 세팅</h3>
            </div>
            <div className="card-body">
              <div className="setting-row tool-spec-row">
                <span className="setting-label tool-spec-label">괭이 스펙</span>
                <input
                  type="number"
                  className="setting-input"
                  min={1}
                  max={15}
                  value={farming.hoeLevel}
                  onChange={(e) => updateFarming('hoeLevel', Math.min(15, Math.max(1, +e.target.value || 1)))}
                />
              </div>

              {skills.map(skill => (
                <div key={skill.key}>
                  <div className="setting-row">
                    <span className="setting-label">
                      <span className="skill-name">{skill.name}</span>
                      <button className="info-btn-inline" onClick={() => setExpandedDesc(expandedDesc === skill.key ? null : skill.key)}>ⓘ</button>
                    </span>
                    <input
                      type="number"
                      className="setting-input"
                      min={0}
                      max={skill.max}
                      value={farming[skill.key as keyof typeof farming] || ''}
                      onChange={(e) => updateFarming(skill.key as keyof typeof farming, Math.min(skill.max, Math.max(0, +e.target.value || 0)))}
                    />
                  </div>
                  {expandedDesc === skill.key && (
                    <div className="expert-desc">
                      {skill.desc.map((d, i) => <div key={i}><strong>LV {i + 1}</strong> – {d}</div>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 조합법 */}
        <div className="info-right">
          <div className="card" style={{ padding: 0 }}>
            <div className="recipe-tabs">
              <button className={`recipe-tab ${activeTab === 'cooking' ? 'active' : ''}`} onClick={() => setActiveTab('cooking')}>요리</button>
              <button className={`recipe-tab ${activeTab === 'processing' ? 'active' : ''}`} onClick={() => setActiveTab('processing')}>가공</button>
            </div>

            {activeTab === 'cooking' && (
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                <div className="table-controls-compact">
                  <input
                    type="text"
                    className="search-input-compact"
                    placeholder="요리 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="sort-select-compact"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  >
                    <option value="name">이름순</option>
                    <option value="price-low">최저가↑</option>
                    <option value="price-high">최고가↓</option>
                  </select>
                </div>
              </div>
            )}

            <div className="recipe-content-inner">
              <div className="table-wrapper-compact">
                {activeTab === 'cooking' ? (
                  <table className="recipe-table-compact">
                    <thead>
                      <tr><th>요리명</th><th>재료</th><th>최저가</th><th>최고가</th></tr>
                    </thead>
                    <tbody>
                      {filteredRecipes.map((r, i) => (
                        <tr key={i}>
                          <td className="recipe-name">{r.name}</td>
                          <td className="recipe-ingredients">{r.ingredients}</td>
                          <td className="price-value">{fmt(r.minPrice)} G</td>
                          <td style={{ textAlign: 'right', color: '#ef4444', fontWeight: 600 }}>{fmt(r.maxPrice)} G</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="recipe-table-compact">
                    <thead>
                      <tr><th>결과물</th><th>재료</th></tr>
                    </thead>
                    <tbody>
                      {PROCESSING_RECIPES.map((r, i) => (
                        <tr key={i}>
                          <td className="recipe-name">{r.name}</td>
                          <td className="recipe-ingredients">{r.materials}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
