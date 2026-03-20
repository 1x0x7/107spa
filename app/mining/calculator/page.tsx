'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { MINING_PROCESS_RECIPES, MINING_CRAFT_RECIPES } from '@/data/mining'
import { MINING_IMAGES_BASE64 } from '@/data/mining-images'

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

// 재료 이미지 매핑 (Base64)
const INGREDIENT_IMAGES: Record<string, string> = {
  // 광석
  '코룸': MINING_IMAGES_BASE64['corum'],
  '리프톤': MINING_IMAGES_BASE64['lifton'],
  '세렌트': MINING_IMAGES_BASE64['serent'],
  // 가공품
  '강화 횃불': MINING_IMAGES_BASE64['toach'],
  '코룸 주괴': MINING_IMAGES_BASE64['corum2'],
  '리프톤 주괴': MINING_IMAGES_BASE64['lifton2'],
  '세렌트 주괴': MINING_IMAGES_BASE64['serent2'],
  // 뭉치
  '조약돌': MINING_IMAGES_BASE64['cobblestone'],
  '심층암 조약돌': MINING_IMAGES_BASE64['cobbled_deepslate'],
  '조약돌 뭉치': MINING_IMAGES_BASE64['stone1'],
  '심층암 조약돌 뭉치': MINING_IMAGES_BASE64['stone2'],
  // 블록
  '구리 블록': MINING_IMAGES_BASE64['copper_block'],
  '철 블록': MINING_IMAGES_BASE64['iron_block'],
  '금 블록': MINING_IMAGES_BASE64['gold_block'],
  '다이아몬드 블록': MINING_IMAGES_BASE64['diamond_block'],
  '청금석 블록': MINING_IMAGES_BASE64['lapis_block'],
  '레드스톤 블록': MINING_IMAGES_BASE64['redstone_block'],
  '자수정 블록': MINING_IMAGES_BASE64['amethyst_block'],
}

// 레시피 이미지 이름에서 Base64 가져오기
function getRecipeImg(imgName: string): string {
  const key = imgName.replace('.png', '').replace('.webp', '')
  return MINING_IMAGES_BASE64[key] || `/img/mining/${imgName}`
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

// 모든 레시피 합치기
const ALL_RECIPES: RecipeData[] = [
  ...MINING_PROCESS_RECIPES.map(r => ({
    name: r.name,
    img: getRecipeImg(r.img),
    ingredients: parseIngredients(r.ingredients),
    category: '가공'
  })),
  ...MINING_CRAFT_RECIPES.map(r => ({
    name: r.name,
    img: getRecipeImg(r.img),
    ingredients: parseIngredients(r.ingredients),
    category: '제작'
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

export default function MiningCalculatorPage() {
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
    <section className="mining-area">
      <h2 className="content-title">계산</h2>

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
                            <img 
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
                <img 
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
                      {ing.img ? (
                        <img src={ing.img} alt={ing.name} width={24} height={24} className="compact-icon" />
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
