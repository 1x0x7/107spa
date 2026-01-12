'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { MINING_EXPERT_DESC, MINING_PROCESS_RECIPES, MINING_CRAFT_RECIPES } from '@/data/mining'

type RecipeTab = 'process' | 'craft'

export default function MiningInfoPage() {
  const { mining, updateMining } = useExpert()
  const [activeTab, setActiveTab] = useState<RecipeTab>('process')
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null)

  const skills = [
    { key: 'cobi', name: '💫 코비타임', max: 7, desc: MINING_EXPERT_DESC.cobi },
    { key: 'ingot', name: '🔩 주괴 좀 사주괴', max: 6, desc: MINING_EXPERT_DESC.ingot },
    { key: 'gemStart', name: '💎 반짝임의 시작', max: 3, desc: MINING_EXPERT_DESC.gemStart },
    { key: 'gemShine', name: '💎 반짝반짝 눈이 부셔', max: 6, desc: MINING_EXPERT_DESC.gemShine },
    { key: 'lucky', name: '🍀 럭키 히트', max: 10, desc: MINING_EXPERT_DESC.lucky },
    { key: 'firePick', name: '🐦‍🔥 불붙은 곡괭이', max: 10, desc: MINING_EXPERT_DESC.firePick },
  ]

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
                <span className="setting-label tool-spec-label">곡괭이 스펙</span>
                <input
                  type="number"
                  className="setting-input"
                  min={1}
                  max={15}
                  value={mining.pickaxeLevel}
                  onChange={(e) => updateMining('pickaxeLevel', Math.min(15, Math.max(1, +e.target.value || 1)))}
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
                      value={mining[skill.key as keyof typeof mining] || ''}
                      onChange={(e) => updateMining(skill.key as keyof typeof mining, Math.min(skill.max, Math.max(0, +e.target.value || 0)))}
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
              <button className={`recipe-tab ${activeTab === 'process' ? 'active' : ''}`} onClick={() => setActiveTab('process')}>채광물 가공</button>
              <button className={`recipe-tab ${activeTab === 'craft' ? 'active' : ''}`} onClick={() => setActiveTab('craft')}>강화 제작</button>
            </div>
            <div className="recipe-content-inner">
              <div className="table-wrapper-compact">
                <table className="recipe-table-compact">
                  <thead>
                    <tr><th>결과물</th><th>재료</th></tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'process' ? MINING_PROCESS_RECIPES : MINING_CRAFT_RECIPES).map((r, i) => (
                      <tr key={i}>
                        <td className="recipe-name">{r.name}</td>
                        <td className="recipe-ingredients">{r.ingredients}</td>
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
