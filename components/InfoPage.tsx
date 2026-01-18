'use client'

import { useState, ReactNode } from 'react'

// ==================== 타입 정의 ====================
export interface Skill {
  key: string
  name: string
  max: number
  desc: readonly string[]
}

export interface RecipeTab {
  id: string
  label: string
  columns: string[]
  data: Record<string, string | number>[]
}

export interface InfoPageProps {
  // 기본 정보
  title?: string
  toolName: string
  toolKey: string
  toolMin?: number
  toolMax?: number
  toolValue: number
  onToolChange: (value: number) => void
  
  // 스킬 목록
  skills: Skill[]
  skillValues: Record<string, number>
  onSkillChange: (key: string, value: number) => void
  
  // 조합법 탭
  recipeTabs: RecipeTab[]
  
  // 검색/정렬 (선택)
  showSearch?: boolean
  searchPlaceholder?: string
  sortOptions?: { value: string; label: string }[]
  
  // 추가 콘텐츠 (선택)
  extraContent?: ReactNode
}

// ==================== 메인 컴포넌트 ====================
export default function InfoPage({
  title = '정보',
  toolName,
  toolKey,
  toolMin = 1,
  toolMax = 15,
  toolValue,
  onToolChange,
  skills,
  skillValues,
  onSkillChange,
  recipeTabs,
  showSearch = false,
  searchPlaceholder = '검색...',
  sortOptions,
  extraContent
}: InfoPageProps) {
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(recipeTabs[0]?.id || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState(sortOptions?.[0]?.value || '')

  // 현재 탭 데이터
  const currentTab = recipeTabs.find(t => t.id === activeTab)
  
  // 검색 필터링
  const filteredData = currentTab?.data.filter(row => {
    if (!searchTerm) return true
    return Object.values(row).some(v => 
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }) || []

  // 정렬
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortBy.includes('high') ? bVal - aVal : aVal - bVal
    }
    return String(aVal).localeCompare(String(bVal))
  })

  return (
    <>
      <h2 className="content-title">{title}</h2>

      <div className="info-grid">
        {/* ========== 왼쪽: 전문가 세팅 ========== */}
        <div className="info-left">
          <div className="card compact-card">
            <div className="card-header">
              <h3 className="card-title">현재 전문가 세팅</h3>
            </div>
            <div className="card-body">
              {/* 도구 스펙 */}
              <div className="setting-row tool-spec-row">
                <span className="setting-label tool-spec-label">{toolName} 스펙</span>
                <input
                  type="number"
                  className="setting-input"
                  min={toolMin}
                  max={toolMax}
                  value={toolValue}
                  onChange={(e) => onToolChange(
                    Math.min(toolMax, Math.max(toolMin, +e.target.value || toolMin))
                  )}
                />
              </div>

              {/* 스킬 목록 */}
              {skills.map(skill => (
                <div key={skill.key}>
                  <div className="setting-row">
                    <span className="setting-label">
                      <span className="skill-name">{skill.name}</span>
                      <button
                        type="button"
                        className="info-btn-inline"
                        tabIndex={-1}
                        onClick={() =>
                          setExpandedDesc(expandedDesc === skill.key ? null : skill.key)
                        }
                      >
                        ⓘ
                      </button>
                    </span>
                    <input
                      type="number"
                      className="setting-input"
                      min={0}
                      max={skill.max}
                      value={skillValues[skill.key] ?? 0}
                      onChange={(e) => onSkillChange(
                        skill.key,
                        Math.min(skill.max, Math.max(0, +e.target.value || 0))
                      )}
                    />
                  </div>
                  {expandedDesc === skill.key && (
                    <div className="expert-desc">
                      {skill.desc.map((d, i) => (
                        <div key={i}><strong>LV {i + 1}</strong> - {d}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 추가 콘텐츠 (선택) */}
          {extraContent}
        </div>

        {/* ========== 오른쪽: 조합법 ========== */}
        <div className="info-right">
          <div className="card" style={{ padding: 0 }}>
            {/* 탭 버튼 */}
            <div className="recipe-tabs">
              {recipeTabs.map(tab => (
                <button
                  key={tab.id}
                  className={`recipe-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 검색/정렬 (선택) */}
            {showSearch && (
              <div className="table-controls-compact">
                <input
                  type="text"
                  className="search-input-compact"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {sortOptions && (
                  <select
                    className="sort-select-compact"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* 테이블 */}
            <div className="recipe-content-inner">
              <div className="table-wrapper-compact">
                {currentTab && (
                  <table className="recipe-table-compact">
                    <thead>
                      <tr>
                        {currentTab.columns.map(col => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedData.map((row, i) => (
                        <tr key={i}>
                          {currentTab.columns.map(col => (
                            <td key={col} className={col === '요리명' || col === '결과물' ? 'recipe-name' : ''}>
                              {row[col] ?? ''}
                            </td>
                          ))}
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
    </>
  )
}