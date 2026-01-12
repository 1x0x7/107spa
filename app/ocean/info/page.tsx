'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { OCEAN_EXPERT_DESC, RECIPES_1STAR, RECIPES_2STAR, RECIPES_3STAR, RECIPES_CRAFT } from '@/data/ocean'

type RecipeTab = '1star' | '2star' | '3star' | 'craft'

export default function OceanInfoPage() {
  const { ocean, updateOcean } = useExpert()
  const [activeTab, setActiveTab] = useState<RecipeTab>('1star')
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null)

  const skills = [
    { key: 'clamSell', name: '🐚 조개 좀 사조개', max: 8, desc: OCEAN_EXPERT_DESC.clamSell },
    { key: 'premiumPrice', name: '💎 프리미엄 한정가', max: 8, desc: OCEAN_EXPERT_DESC.premium },
    { key: 'deepSea', name: '🌊 심해 채집꾼', max: 5, desc: OCEAN_EXPERT_DESC.deepSea },
    { key: 'star', name: '⭐ 별별별', max: 6, desc: OCEAN_EXPERT_DESC.star },
    { key: 'clamRefill', name: '🔄 조개 무한리필', max: 10, desc: OCEAN_EXPERT_DESC.clamRefill },
  ]

  const getRecipes = () => {
    switch (activeTab) {
      case '1star': return RECIPES_1STAR
      case '2star': return RECIPES_2STAR
      case '3star': return RECIPES_3STAR
      case 'craft': return RECIPES_CRAFT
    }
  }

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
                <span className="setting-label tool-spec-label">낚싯대 스펙</span>
                
                <input
                  type="number"
                  className="setting-input"
                  min={1}
                  max={15}
                  value={ocean.rodLevel}
                  onChange={(e) => updateOcean('rodLevel', Math.min(15, Math.max(1, +e.target.value || 1)))}
                />
              </div>

              {skills.map((skill, idx) => (
                <div key={skill.key}>
                  <div className="setting-row">
                    <span className="setting-label">
                      <span className="skill-name">{skill.name}</span>
                      <button
                        type="button"
                        className="info-btn-inline"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setExpandedDesc(expandedDesc === skill.key ? null : skill.key);
                        }}
                      >
                        ⓘ
                      </button>
                    </span>

                    <input
                      type="number"
                      className="setting-input"
                      min={0}
                      max={skill.max}
                      value={ocean[skill.key as keyof typeof ocean] || ''}
                      onChange={(e) =>
                        updateOcean(
                          skill.key as keyof typeof ocean,
                          Math.min(skill.max, Math.max(0, +e.target.value || 0))
                        )
                      }
                    />
                  </div>

                  {/* 🔽 여기 추가 */}
                  {idx !== skills.length - 1 && <div className="skill-divider" />}

                  {expandedDesc === skill.key && (
                    <div className="expert-desc">
                      {skill.desc.map((d, i) => (
                        <div key={i}>
                          <strong>LV {i + 1}</strong> – {d}
                        </div>
                      ))}
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
              <button className={`recipe-tab ${activeTab === '1star' ? 'active' : ''}`} onClick={() => setActiveTab('1star')}>1성</button>
              <button className={`recipe-tab ${activeTab === '2star' ? 'active' : ''}`} onClick={() => setActiveTab('2star')}>2성</button>
              <button className={`recipe-tab ${activeTab === '3star' ? 'active' : ''}`} onClick={() => setActiveTab('3star')}>3성</button>
              <button className={`recipe-tab ${activeTab === 'craft' ? 'active' : ''}`} onClick={() => setActiveTab('craft')}>공예품</button>
            </div>

            <div className="recipe-content-inner">
              <div className="table-wrapper-compact">
                <table className="recipe-table-compact">
                  <thead>
                    <tr>
                      <th>결과물</th>
                      <th>재료</th>
                      {activeTab === 'craft' ? (
                        <>
                          <th>최소가</th>
                          <th>최고가</th>
                        </>
                      ) : (
                        <th>가격</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getRecipes().map((r, i) => (
                      <tr key={i}>
                        <td className="recipe-name">{r.name}</td>
                        <td className="recipe-ingredients">{r.ingredients}</td>
                        {activeTab === 'craft' && 'minPrice' in r ? (
                          <>
                            <td className="price-value">{r.minPrice}</td>
                            <td style={{ textAlign: 'right', color: '#ef4444', fontWeight: 600 }}>
                              {r.maxPrice}
                            </td>
                          </>
                        ) : 'price' in r ? (
                          <td className="price-value">{r.price}</td>
                        ) : null}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
