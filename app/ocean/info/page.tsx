'use client'

import { useExpert } from '@/hooks/useExpert'
import InfoPage from '@/components/InfoPage'
import { 
  OCEAN_EXPERT_DESC, 
  RECIPES_1STAR,
  RECIPES_2STAR,
  RECIPES_3STAR,
  RECIPES_CRAFT
} from '@/data/ocean'

export default function OceanInfoPage() {
  const { ocean, updateOcean } = useExpert()

  const skills = [
    { key: 'clamSell', name: '조개 좀 사조개', max: 8, desc: OCEAN_EXPERT_DESC.clamSell },
    { key: 'premiumPrice', name: '프리미엄 한정가', max: 8, desc: OCEAN_EXPERT_DESC.premium },
    { key: 'deepSea', name: '심해 채집꾼', max: 5, desc: OCEAN_EXPERT_DESC.deepSea },
    { key: 'star', name: '별별별!', max: 6, desc: OCEAN_EXPERT_DESC.star },
    { key: 'clamRefill', name: '조개 무한리필', max: 10, desc: OCEAN_EXPERT_DESC.clamRefill },
  ]

  const recipeTabs = [
    {
      id: '1star',
      label: '1성',
      columns: ['결과물', '재료', '가격'],
      data: RECIPES_1STAR.map(r => ({ '결과물': r.name, '재료': r.ingredients, '가격': r.price }))
    },
    {
      id: '2star',
      label: '2성',
      columns: ['결과물', '재료', '가격'],
      data: RECIPES_2STAR.map(r => ({ '결과물': r.name, '재료': r.ingredients, '가격': r.price }))
    },
    {
      id: '3star',
      label: '3성',
      columns: ['결과물', '재료', '가격'],
      data: RECIPES_3STAR.map(r => ({ '결과물': r.name, '재료': r.ingredients, '가격': r.price }))
    },
    {
      id: 'craft',
      label: '공예',
      columns: ['결과물', '재료'],
      data: RECIPES_CRAFT.map(r => ({ '결과물': r.name, '재료': r.ingredients }))
    }
  ]

  const skillValues: Record<string, number> = {
    clamSell: ocean.clamSell,
    premiumPrice: ocean.premiumPrice,
    deepSea: ocean.deepSea,
    star: ocean.star,
    clamRefill: ocean.clamRefill,
  }

  return (
    <InfoPage
      toolName="낚싯대"
      toolKey="rodLevel"
      toolMin={1}
      toolMax={15}
      toolValue={ocean.rodLevel}
      onToolChange={(v) => updateOcean('rodLevel', v)}
      skills={skills}
      skillValues={skillValues}
      onSkillChange={(key, value) => updateOcean(key as keyof typeof ocean, value)}
      recipeTabs={recipeTabs}
    />
  )
}