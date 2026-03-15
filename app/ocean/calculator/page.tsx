'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { RECIPES_1STAR, RECIPES_2STAR, RECIPES_3STAR, RECIPES_CRAFT } from '@/data/ocean'

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

// 재료 이미지 매핑
const INGREDIENT_IMAGES: Record<string, string> = {
  // 1성 어획물
  '굴★': '/img/ocean/oyster.png',
  '소라★': '/img/ocean/conch.png',
  '문어★': '/img/ocean/octopus.png',
  '미역★': '/img/ocean/seaweed.png',
  '성게★': '/img/ocean/urchin.png',
  // 2성 어획물
  '굴★★': '/img/ocean/oyster.png',
  '소라★★': '/img/ocean/conch.png',
  '문어★★': '/img/ocean/octopus.png',
  '미역★★': '/img/ocean/seaweed.png',
  '성게★★': '/img/ocean/urchin.png',
  // 3성 어획물
  '굴★★★': '/img/ocean/oyster.png',
  '소라★★★': '/img/ocean/conch.png',
  '문어★★★': '/img/ocean/octopus.png',
  '미역★★★': '/img/ocean/seaweed.png',
  '성게★★★': '/img/ocean/urchin.png',
  // 1성 정수
  '수호의 정수': '/img/ocean/essence_guard.png',
  '파동의 정수': '/img/ocean/essence_wave.png',
  '혼란의 정수': '/img/ocean/essence_chaos.png',
  '생명의 정수': '/img/ocean/essence_life.png',
  '부식의 정수': '/img/ocean/essence_decay.png',
  // 1성 핵
  '물결 수호의 핵': '/img/ocean/core_wg.png',
  '파동 오염의 핵': '/img/ocean/core_wp.png',
  '질서 파괴의 핵': '/img/ocean/core_od.png',
  '활력 붕괴의 핵': '/img/ocean/core_vd.png',
  '침식 방어의 핵': '/img/ocean/core_ed.png',
  // 2성 에센스
  '수호 에센스': '/img/ocean/essence_guard_2.png',
  '파동 에센스': '/img/ocean/essence_wave_2.png',
  '혼란 에센스': '/img/ocean/essence_chaos_2.png',
  '생명 에센스': '/img/ocean/essence_life_2.png',
  '부식 에센스': '/img/ocean/essence_decay_2.png',
  // 2성 결정
  '활기 보존의 결정': '/img/ocean/crystal_vital.png',
  '파도 침식의 결정': '/img/ocean/crystal_erosion.png',
  '방어 오염의 결정': '/img/ocean/crystal_defense.png',
  '격류 재생의 결정': '/img/ocean/crystal_regen.png',
  '맹독 혼란의 결정': '/img/ocean/crystal_poison.png',
  // 3성 엘릭서
  '수호의 엘릭서': '/img/ocean/elixir-guard.png',
  '파동의 엘릭서': '/img/ocean/elixir-wave.png',
  '혼란의 엘릭서': '/img/ocean/elixir-chaos.png',
  '생명의 엘릭서': '/img/ocean/elixir-life.png',
  '부식의 엘릭서': '/img/ocean/elixir-decay.png',
  // 3성 영약
  '불멸 재생의 영약': '/img/ocean/potion-immortal.png',
  '파동 장벽의 영약': '/img/ocean/potion-barrier.png',
  '타락 침식의 영약': '/img/ocean/potion-corrupt.png',
  '생명 광란의 영약': '/img/ocean/potion-frenzy.png',
  '맹독 파동의 영약': '/img/ocean/potion-venom.png',
  // 공예품 재활용품
  '금속 재활용품': '/img/ocean/metal.png',
  '합금 재활용품': '/img/ocean/alloy.png',
  '합성수지 재활용품': '/img/ocean/resin.png',
  '플라스틱 재활용품': '/img/ocean/pt.png',
  '섬유 재활용품': '/img/ocean/fiber.png',
  // 진주
  '노란빛 진주': '/img/ocean/yellow.png',
  '푸른빛 진주': '/img/ocean/blue.png',
  '청록빛 진주': '/img/ocean/green.png',
  '분홍빛 진주': '/img/ocean/pink.png',
  '보라빛 진주': '/img/ocean/purple.png',
  '흑진주': '/img/ocean/black.png',
  // 조개
  '깨진 조개껍데기': '/img/ocean/clam.png',
}

// 레시피 맵 (이름 -> 재료) - 원재료 계산용
const RECIPE_MAP: Record<string, { ingredients: string, outputCount: number }> = {}

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

// 레시피 맵 초기화
function initRecipeMap() {
  // 1성
  RECIPES_1STAR.forEach(r => {
    const name = r.name.replace(' (2개)', '')
    const outputCount = r.name.includes('(2개)') ? 2 : 1
    RECIPE_MAP[name] = { ingredients: r.ingredients, outputCount }
  })
  // 2성
  RECIPES_2STAR.forEach(r => {
    const name = r.name.replace(' (2개)', '')
    const outputCount = r.name.includes('(2개)') ? 2 : 1
    RECIPE_MAP[name] = { ingredients: r.ingredients, outputCount }
  })
  // 3성
  RECIPES_3STAR.forEach(r => {
    const name = r.name.replace(' (2개)', '')
    const outputCount = r.name.includes('(2개)') ? 2 : 1
    RECIPE_MAP[name] = { ingredients: r.ingredients, outputCount }
  })
  // 공예품
  RECIPES_CRAFT.forEach(r => {
    const name = r.name.replace(' (2개)', '')
    const outputCount = r.name.includes('(2개)') ? 2 : 1
    RECIPE_MAP[name] = { ingredients: r.ingredients, outputCount }
  })
}
initRecipeMap()

// 원재료까지 재귀적으로 분해
function getRawMaterials(ingredients: IngredientRequirement[]): IngredientRequirement[] {
  const rawMap: Record<string, number> = {}
  
  function addToRaw(name: string, amount: number) {
    rawMap[name] = (rawMap[name] || 0) + amount
  }
  
  function decompose(name: string, amount: number) {
    const recipe = RECIPE_MAP[name]
    if (!recipe) {
      // 레시피 없음 = 원재료
      addToRaw(name, amount)
      return
    }
    
    // 레시피가 있으면 분해
    const neededCrafts = Math.ceil(amount / recipe.outputCount)
    const parsedIngredients = parseIngredients(recipe.ingredients)
    
    for (const ing of parsedIngredients) {
      decompose(ing.name, ing.amount * neededCrafts)
    }
  }
  
  for (const ing of ingredients) {
    decompose(ing.name, ing.amount)
  }
  
  // 맵을 배열로 변환
  return Object.entries(rawMap).map(([name, amount]) => ({
    name,
    amount,
    img: INGREDIENT_IMAGES[name]
  }))
}

// 1성 연금품 (추출된 제외)
const RECIPES_1STAR_DATA: RecipeData[] = RECIPES_1STAR.filter(r => !r.name.includes('추출된')).map(r => ({
  name: r.name.replace(' (2개)', ''),
  img: `/img/ocean/${r.img}`,
  ingredients: parseIngredients(r.ingredients),
  category: '1성'
}))

// 2성 연금품
const RECIPES_2STAR_DATA: RecipeData[] = RECIPES_2STAR.map(r => ({
  name: r.name.replace(' (2개)', ''),
  img: `/img/ocean/${r.img}`,
  ingredients: parseIngredients(r.ingredients),
  category: '2성'
}))

// 3성 연금품
const RECIPES_3STAR_DATA: RecipeData[] = RECIPES_3STAR.map(r => ({
  name: r.name,
  img: `/img/ocean/${r.img}`,
  ingredients: parseIngredients(r.ingredients),
  category: '3성'
}))

// 공예품
const CRAFT_DATA: RecipeData[] = RECIPES_CRAFT.map(r => ({
  name: r.name.replace(' (2개)', ''),
  img: `/img/ocean/${r.img}`,
  ingredients: parseIngredients(r.ingredients),
  category: '공예품'
}))

// 출력 개수 맵 (2개가 나오는 레시피)
const OUTPUT_MULTIPLIER: Record<string, number> = {
  '수호의 정수': 2,
  '파동의 정수': 2,
  '혼란의 정수': 2,
  '생명의 정수': 2,
  '부식의 정수': 2,
  '수호 에센스': 2,
  '파동 에센스': 2,
  '혼란 에센스': 2,
  '생명 에센스': 2,
  '부식 에센스': 2,
  '금속 재활용품': 2,
  '합금 재활용품': 2,
  '합성수지 재활용품': 2,
  '플라스틱 재활용품': 2,
  '섬유 재활용품': 2,
}

// 세트 환산 함수 (64개 = 1세트)
function formatWithSet(amount: number): { main: string; sub?: string } {
  const sets = Math.floor(amount / 64)
  const remainder = amount % 64
  if (sets === 0) return { main: `${amount}개` }
  if (remainder === 0) return { main: `${sets}세트`, sub: `${amount}개` }
  return { main: `${sets}세트 ${remainder}개`, sub: `${amount}개` }
}

type CalculatorMode = '1star' | '2star' | '3star' | 'craft'

export default function OceanCalculatorPage() {
  const [mode, setMode] = useState<CalculatorMode>('1star')
  const [searchText, setSearchText] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeData | null>(null)
  const [quantity, setQuantity] = useState<string>('1')
  const [showDropdown, setShowDropdown] = useState(false)
  const [rawExpanded, setRawExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getRecipes = () => {
    switch (mode) {
      case '1star': return RECIPES_1STAR_DATA
      case '2star': return RECIPES_2STAR_DATA
      case '3star': return RECIPES_3STAR_DATA
      case 'craft': return CRAFT_DATA
    }
  }

  const recipes = getRecipes()

  // 검색어 필터링
  const filteredRecipes = useMemo(() => {
    if (!searchText.trim()) return recipes
    return recipes.filter(r => 
      r.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [searchText, recipes])

  // 자동 계산 결과
  const results = useMemo(() => {
    const qty = parseInt(quantity)
    if (!selectedRecipe || !qty || qty <= 0) return []
    
    // 출력 배수 고려
    const outputMultiplier = OUTPUT_MULTIPLIER[selectedRecipe.name] || 1
    const actualQty = Math.ceil(qty / outputMultiplier)
    
    return selectedRecipe.ingredients.map(ing => ({
      ...ing,
      amount: ing.amount * actualQty
    }))
  }, [selectedRecipe, quantity])

  // 원재료 합산 계산
  const rawMaterials = useMemo(() => {
    if (results.length === 0) return []
    return getRawMaterials(results)
  }, [results])

  // 레시피 선택
  const handleSelectRecipe = (recipe: RecipeData) => {
    setSelectedRecipe(recipe)
    setSearchText(recipe.name)
    setShowDropdown(false)
    setRawExpanded(false)
  }

  // 모드 변경
  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode)
    setSearchText('')
    setSelectedRecipe(null)
    setShowDropdown(false)
    setRawExpanded(false)
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

  const getModeLabel = () => {
    switch (mode) {
      case '1star': return '1성 연금품'
      case '2star': return '2성 연금품'
      case '3star': return '3성 연금품'
      case 'craft': return '공예품'
    }
  }

  return (
    <section className="ocean-area">
      <h2 className="content-title">역계산기</h2>

      <div className="stamina-container">
        {/* 모드 토글 */}
        <div className="mode-toggle-container ocean-mode-toggle">
          <button
            className={`mode-toggle-btn ${mode === '1star' ? 'active' : ''}`}
            onClick={() => handleModeChange('1star')}
          >
            1성
          </button>
          <button
            className={`mode-toggle-btn ${mode === '2star' ? 'active' : ''}`}
            onClick={() => handleModeChange('2star')}
          >
            2성
          </button>
          <button
            className={`mode-toggle-btn ${mode === '3star' ? 'active' : ''}`}
            onClick={() => handleModeChange('3star')}
          >
            3성
          </button>
          <button
            className={`mode-toggle-btn ${mode === 'craft' ? 'active' : ''}`}
            onClick={() => handleModeChange('craft')}
          >
            공예품
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="expert-info-text">
              만들고 싶은 {getModeLabel()}과 수량을 입력하면 필요한 재료를 계산합니다
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
                            <Image 
                              src={recipe.img} 
                              alt={recipe.name} 
                              width={24} 
                              height={24}
                              className="autocomplete-img"
                            />
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
                <Image 
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
              {/* 직접 재료 섹션 */}
              <div className="result-section-label">직접 재료</div>
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
              
              {/* 원재료 합산 (접이식) */}
              {rawMaterials.length > 0 && (
                <>
                  <div 
                    className="raw-materials-header"
                    onClick={() => setRawExpanded(!rawExpanded)}
                  >
                    <span>원재료 합산</span>
                    <span className="raw-toggle">{rawExpanded ? '▲' : '▼ 펼치기'}</span>
                  </div>
                  <div className={`raw-materials-content ${rawExpanded ? 'open' : ''}`}>
                    <div className="raw-badges">
                      {rawMaterials.map((mat, i) => (
                        <span key={i} className="raw-badge">
                          {mat.img && (
                            <Image src={mat.img} alt={mat.name} width={14} height={14} className="raw-badge-icon" />
                          )}
                          <span className="raw-badge-name">{mat.name}</span>
                          <span className="raw-badge-amount">{fmt(mat.amount)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {OUTPUT_MULTIPLIER[selectedRecipe.name] && (
                <div className="bonus-summary">
                  <div className="bonus-summary-title">💡 참고</div>
                  {selectedRecipe.name}은(는) 1회 제작 시 {OUTPUT_MULTIPLIER[selectedRecipe.name]}개가 생성됩니다.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
