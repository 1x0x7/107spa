'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { EFFICIENCY_RECIPES } from '@/data/farming'

interface IngredientRequirement {
  name: string
  amount: number
  img?: string
}

interface RecipeData {
  name: string
  img: string
  ingredients: IngredientRequirement[]
}

// 재료 이미지 매핑
const INGREDIENT_IMAGES: Record<string, string> = {
  // 베이스
  '토마토 베이스': '/img/farming/tomato_base.png',
  '양파 베이스': '/img/farming/onion_base.png',
  '마늘 베이스': '/img/farming/garlic_base.png',
  // 묶음
  '호박 묶음': '/img/farming/pumpkin.png',
  '당근 묶음': '/img/farming/carrot.png',
  '비트 묶음': '/img/farming/beat.png',
  '수박 묶음': '/img/farming/watermelon.png',
  '감자 묶음': '/img/farming/potato.png',
  '달콤한 열매 묶음': '/img/farming/sweet.png',
  // 가공품
  '요리용 소금': '/img/farming/salt2.png',
  '설탕 큐브': '/img/farming/sugar.png',
  '밀가루 반죽': '/img/farming/kneading.png',
  '버터 조각': '/img/farming/butter.png',
  '치즈 조각': '/img/farming/chesse.png',
  '오일': '/img/farming/oil.png',
  '요리용 우유': '/img/farming/milk.png',
  '요리용 달걀': '/img/farming/egg.png',
  // 기타 재료
  '파인애플': '/img/farming/pineapple.png',
  '코코넛': '/img/farming/coconut.png',
  '스테이크': '/img/farming/Steak.png',
  // 익힌 고기류
  '익힌 소 갈비살': '/img/farming/Cooked_Beef_Short_Ribs.png',
  '익힌 소 등심': '/img/farming/Cooked_Beef_Sirloin.png',
  '익힌 돼지고기': '/img/farming/Cooked_Porkchop.png',
  '익힌 돼지 삼겹살': '/img/farming/Cooked_Pork_Belly.png',
  '익힌 돼지 앞다리살': '/img/farming/Cooked_Pork_Shoulder.png',
  '익힌 양고기': '/img/farming/Cooked_Mutton.png',
  '익힌 양 갈비살': '/img/farming/Cooked_Lamb_Ribs.png',
  '익힌 양 다리살': '/img/farming/Cooked_Lamb_Leg.png',
  '익힌 닭고기': '/img/farming/Cooked_Chicken.png',
  '익힌 닭 가슴살': '/img/farming/Cooked_Chicken_Breast.png',
  '익힌 닭 다리살': '/img/farming/Cooked_Chicken_Leg.png',
}

// 재료 파싱 함수 (이미지 포함)
function parseIngredients(ingredientStr: string): IngredientRequirement[] {
  const parts = ingredientStr.split(' + ')
  return parts.map(part => {
    const match = part.match(/(.+?)\s*(\d+)개?$/)
    if (match) {
      const name = match[1].trim()
      return { 
        name, 
        amount: parseInt(match[2]),
        img: INGREDIENT_IMAGES[name]
      }
    }
    const name = part.trim()
    return { name, amount: 1, img: INGREDIENT_IMAGES[name] }
  })
}

// 요리 레시피만 사용
const COOKING_RECIPES: RecipeData[] = EFFICIENCY_RECIPES.map(r => ({
  name: r.name,
  img: `/img/farming/${r.img}`,
  ingredients: parseIngredients(r.ingredients)
}))

// 세트 환산 함수 (64개 = 1세트)
function formatWithSet(amount: number): { main: string; sub?: string } {
  const sets = Math.floor(amount / 64)
  const remainder = amount % 64
  if (sets === 0) return { main: `${amount}개` }
  if (remainder === 0) return { main: `${sets}세트`, sub: `${amount}개` }
  return { main: `${sets}세트 ${remainder}개`, sub: `${amount}개` }
}

export default function FarmingCalculatorPage() {
  const [searchText, setSearchText] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeData | null>(null)
  const [quantity, setQuantity] = useState<string>('1')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 검색어 필터링
  const filteredRecipes = useMemo(() => {
    if (!searchText.trim()) return COOKING_RECIPES
    return COOKING_RECIPES.filter(r => 
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
    <section className="farming-area">
      <h2 className="content-title">계산</h2>

      <div className="stamina-container">
        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              만들고 싶은 요리와 수량을 입력하면 필요한 재료를 계산합니다
            </div>

            <div className="stamina-inputs-container">
              <div className="stamina-input-row">
                <div className="stamina-input-group">
                  <span className="stamina-label">요리</span>
                  <div className="autocomplete-wrapper">
                    <input
                      ref={inputRef}
                      type="text"
                      className="stamina-input autocomplete-input"
                      placeholder="요리 검색..."
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
                            <Image src={recipe.img} alt={recipe.name} width={24} height={24} />
                            <span>{recipe.name}</span>
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
                <Image src={selectedRecipe.img} alt={selectedRecipe.name} width={24} height={24} />
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
                      {ing.img ? (
                        <Image src={ing.img} alt={ing.name} width={24} height={24} className="compact-icon" />
                      ) : (
                        <div className="compact-icon-placeholder" />
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
