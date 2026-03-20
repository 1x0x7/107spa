'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { SOUL_PROCESSING, SOUL_CONTRACTS } from '@/data/hunting'

interface IngredientRequirement {
  name: string
  amount: number
  img?: string
}

interface RecipeData {
  name: string
  img: string
  ingredients: IngredientRequirement[]
  category: string
}

// 재료 파싱 함수
function parseIngredients(ingredientStr: string): IngredientRequirement[] {
  const parts = ingredientStr.split(' + ')
  return parts.map(part => {
    const match = part.match(/(.+?)\s*(\d+)개?$/)
    if (match) {
      return { name: match[1].trim(), amount: parseInt(match[2]) }
    }
    return { name: part.trim(), amount: 1 }
  })
}

// 모든 레시피 합치기
const ALL_RECIPES: RecipeData[] = [
  ...SOUL_PROCESSING.map(r => ({
    name: r.name,
    img: `/img/hunting/${r.img}`,
    ingredients: parseIngredients(r.ingredients),
    category: '영혼 가공'
  })),
  ...SOUL_CONTRACTS.map(r => ({
    name: r.name,
    img: `/img/hunting/${r.img}`,
    ingredients: parseIngredients(r.ingredients),
    category: '계약서'
  }))
]

// 세트 환산 함수 (64개 = 1세트)
function formatWithSet(amount: number): { main: string; sub?: string } {
  const sets = Math.floor(amount / 64)
  const remainder = amount % 64
  if (sets === 0) return { main: `${amount}개` }
  if (remainder === 0) return { main: `${sets}세트`, sub: `${amount}개` }
  return { main: `${sets}세트 ${remainder}개`, sub: `${amount}개` }
}

export default function HuntingCalculatorPage() {
  const [searchText, setSearchText] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeData | null>(null)
  const [quantity, setQuantity] = useState<string>('1')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 검색어 필터링
  const filteredRecipes = useMemo(() => {
    if (!searchText.trim()) return ALL_RECIPES
    return ALL_RECIPES.filter(r => 
      r.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [searchText])

  // 자동 계산 결과
  const results = useMemo(() => {
    const qty = parseInt(quantity)
    if (!selectedRecipe || !qty || qty <= 0) return []
    
    return selectedRecipe.ingredients.map(ing => ({
      ...ing,
      amount: ing.amount * qty
    }))
  }, [selectedRecipe, quantity])

  // 레시피 선택
  const handleSelectRecipe = (recipe: RecipeData) => {
    setSelectedRecipe(recipe)
    setSearchText(recipe.name)
    setShowDropdown(false)
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fmt = (n: number) => n.toLocaleString()

  return (
    <section className="hunting-area">
      <h2 className="content-title">역계산기</h2>

      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              만들고 싶은 아이템과 수량을 입력하면 필요한 재료를 계산합니다
            </div>

            <div className="stamina-inputs-container">
              <div className="stamina-input-row">
                <div className="stamina-input-group">
                  <span className="stamina-label">아이템</span>
                  <div className="autocomplete-wrapper">
                    <input
                      ref={inputRef}
                      type="text"
                      className="stamina-input autocomplete-input"
                      placeholder="아이템 검색..."
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value)
                        setShowDropdown(true)
                        if (!e.target.value) setSelectedRecipe(null)
                      }}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && filteredRecipes.length > 0 && (
                      <div ref={dropdownRef} className="autocomplete-dropdown">
                        {filteredRecipes.map(recipe => (
                          <div
                            key={recipe.name}
                            className={`autocomplete-item ${selectedRecipe?.name === recipe.name ? 'selected' : ''}`}
                            onClick={() => handleSelectRecipe(recipe)}
                          >
                            <Image priority 
                              src={recipe.img} 
                              alt={recipe.name} 
                              width={24} 
                              height={24}
                              className="autocomplete-img"
                            />
                            <span>{recipe.name}</span>
                            <span className="autocomplete-category">{recipe.category}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <span className="stamina-label">수량</span>
                  <input
                    type="number"
                    className="stamina-input"
                    placeholder="10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 결과 */}
        {selectedRecipe && results.length > 0 && (
          <div className="result-card">
            <div className="result-section-title">
              <div className="result-title-left">
                <Image priority 
                  src={selectedRecipe.img} 
                  alt={selectedRecipe.name} 
                  width={24} 
                  height={24}
                  className="result-title-img"
                />
                <span>{selectedRecipe.name}</span>
              </div>
              <span>{fmt(parseInt(quantity) || 0)}개 제작</span>
            </div>
            <div className="result-body">
              <div className="compact-list">
                {results.map((ing, i) => {
                  const formatted = formatWithSet(ing.amount)
                  return (
                    <div key={i} className="compact-item">
                      {ing.img && (
                        <Image priority src={ing.img} alt={ing.name} width={24} height={24} className="compact-icon" />
                      )}
                      <span className="compact-name">{ing.name}</span>
                      <div className="compact-amount-wrap">
                        <span className="compact-amount">{formatted.main}</span>
                        {formatted.sub && <span className="compact-amount-sub">{formatted.sub}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
