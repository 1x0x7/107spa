'use client'

import { useExpert } from '@/hooks/useExpert'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import InfoPage from '@/components/InfoPage'
import { 
  HUNTING_EXPERT_DESC,
  SOUL_PROCESSING,
  SOUL_CONTRACTS
} from '@/data/hunting'

export default function HuntingInfoPage() {
  const { hunting, updateHunting } = useExpert()

  useImagePreloader([
    ...SOUL_PROCESSING.map(r => `/img/hunting/${r.img}`),
    ...SOUL_CONTRACTS.map(r => `/img/hunting/${r.img}`),
  ])
  const skills = [
    { key: 'allTheWay', name: '끝까지 간다!', max: 5, desc: HUNTING_EXPERT_DESC.allTheWay },
    { key: 'worthProof', name: '값어치 증명', max: 6, desc: HUNTING_EXPERT_DESC.worthProof },
    { key: 'extraProcessing', name: '추가 손질', max: 7, desc: HUNTING_EXPERT_DESC.extraProcessing },
    { key: 'differentFromOthers', name: '남들과는 다르게', max: 7, desc: HUNTING_EXPERT_DESC.differentFromOthers },
    { key: 'mutantSpecies', name: '변종 개체', max: 10, desc: HUNTING_EXPERT_DESC.mutantSpecies },
  ]

  const recipeTabs = [
    {
      id: 'soul-processing',
      label: '영혼 가공',
      columns: ['항목', '재료', '가격'],
      data: SOUL_PROCESSING.map(s => ({ 
        '항목': (
          <span className="recipe-name-cell">
            <img src={`/img/hunting/${s.img}`} alt={s.name} />
            {s.name}
          </span>
        ),
        '재료': s.ingredients,
        '가격': s.price
      }))
    },
    {
      id: 'soul-contracts',
      label: '계약서',
      columns: ['항목', '재료'],
      data: SOUL_CONTRACTS.map(s => ({ 
        '항목': (
          <span className="recipe-name-cell">
            <img src={`/img/hunting/${s.img}`} alt={s.name} />
            {s.name}
          </span>
        ),
        '재료': s.ingredients
      }))
    }
  ]

  const skillValues: Record<string, number> = {
    allTheWay: hunting.allTheWay,
    worthProof: hunting.worthProof,
    extraProcessing: hunting.extraProcessing,
    differentFromOthers: hunting.differentFromOthers,
    mutantSpecies: hunting.mutantSpecies,
  }

  return (
    <InfoPage
      toolName="대검"
      toolKey="swordLevel"
      toolMin={1}
      toolMax={15}
      toolValue={hunting.swordLevel}
      onToolChange={(v) => updateHunting('swordLevel', v)}
      skills={skills}
      skillValues={skillValues}
      onSkillChange={(key, value) => updateHunting(key as keyof typeof hunting, value)}
      recipeTabs={recipeTabs}
    />
  )
}