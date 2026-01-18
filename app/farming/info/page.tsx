'use client'

import { useExpert } from '@/hooks/useExpert'
import InfoPage from '@/components/InfoPage'
import { 
  FARMING_EXPERT_DESC, 
  COOKING_RECIPES, 
  PROCESSING_RECIPES 
} from '@/data/farming'

export default function FarmingInfoPage() {
  const { farming, updateFarming } = useExpert()

  const skills = [
    { key: 'gift', name: '자연이 주는 선물', max: 10, desc: FARMING_EXPERT_DESC.gift },
    { key: 'harvest', name: '오늘도 풍년이다!', max: 7, desc: FARMING_EXPERT_DESC.harvest },
    { key: 'pot', name: '한 솥 가득', max: 5, desc: FARMING_EXPERT_DESC.pot },
    { key: 'money', name: '돈 좀 벌어볼까?', max: 10, desc: FARMING_EXPERT_DESC.money },
    { key: 'king', name: '왕 크니까 왕 좋아', max: 4, desc: FARMING_EXPERT_DESC.king },
    { key: 'seedBonus', name: '씨앗은 덤이야', max: 10, desc: FARMING_EXPERT_DESC.seedBonus },
    { key: 'fire', name: '불붙은 괭이', max: 10, desc: FARMING_EXPERT_DESC.fire },
  ]

  const recipeTabs = [
    {
      id: 'cooking',
      label: '요리',
      columns: ['요리명', '재료', '최저가', '최고가'],
      data: COOKING_RECIPES.map(r => ({
        '요리명': r.name,
        '재료': r.ingredients,
        '최저가': r.minPrice,
        '최고가': r.maxPrice
      }))
    },
    {
      id: 'processing',
      label: '가공',
      columns: ['결과물', '재료'],
      data: PROCESSING_RECIPES.map(r => ({ '결과물': r.name, '재료': r.materials }))
    }
  ]

  const skillValues: Record<string, number> = {
    gift: farming.gift,
    harvest: farming.harvest,
    pot: farming.pot,
    money: farming.money,
    king: farming.king,
    seedBonus: farming.seedBonus,
    fire: farming.fire,
  }

  const sortOptions = [
    { value: 'name', label: '이름순' },
    { value: '최저가', label: '최저가↑' },
    { value: '최고가', label: '최고가↓' }
  ]

  return (
    <InfoPage
      toolName="괭이"
      toolKey="hoeLevel"
      toolMin={1}
      toolMax={15}
      toolValue={farming.hoeLevel}
      onToolChange={(v) => updateFarming('hoeLevel', v)}
      skills={skills}
      skillValues={skillValues}
      onSkillChange={(key, value) => updateFarming(key as keyof typeof farming, value)}
      recipeTabs={recipeTabs}
      showSearch={true}
      searchPlaceholder="요리 검색..."
      sortOptions={sortOptions}
    />
  )
}