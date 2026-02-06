'use client'

import { useExpert } from '@/hooks/useExpert'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import InfoPage from '@/components/InfoPage'
import { 
  MINING_EXPERT_DESC, 
  MINING_PROCESS_RECIPES, 
  MINING_CRAFT_RECIPES,
  PICKAXE_CONFIG
} from '@/data/mining'

export default function MiningInfoPage() {
  const { mining, updateMining } = useExpert()


  useImagePreloader([
    ...MINING_PROCESS_RECIPES.filter(r => r.img).map(r => `/img/mining/${r.img}`),
    ...MINING_CRAFT_RECIPES.filter(r => r.img).map(r => `/img/mining/${r.img}`),
  ])
  const skills = [
    { key: 'cobi', name: '코비타임', max: 7, desc: MINING_EXPERT_DESC.cobi },
    { key: 'ingot', name: '주괴 좀 사주괴', max: 6, desc: MINING_EXPERT_DESC.ingot },
    { key: 'gemStart', name: ' 반짝임의 시작', max: 3, desc: MINING_EXPERT_DESC.gemStart },
    { key: 'gemShine', name: '반짝반짝 눈이 부셔', max: 6, desc: MINING_EXPERT_DESC.gemShine },
    { key: 'lucky', name: '럭키 히트', max: 10, desc: MINING_EXPERT_DESC.lucky },
    { key: 'firePick', name: '불붙은 곡괭이', max: 10, desc: MINING_EXPERT_DESC.firePick },
  ]

  const recipeTabs = [
    {
      id: 'process',
      label: '가공',
      columns: ['결과물', '재료'],
      data: MINING_PROCESS_RECIPES.map(r => ({ 
        '결과물': (
          <span className="recipe-name-cell">
            <img src={`/img/mining/${r.img}`} alt={r.name} />
            {r.name}
          </span>
        ),
        '재료': r.ingredients
      }))
    },
    {
      id: 'craft',
      label: '제작',
      columns: ['결과물', '재료'],
      data: MINING_CRAFT_RECIPES.map(r => ({ 
        '결과물': (
          <span className="recipe-name-cell">
            <img src={`/img/mining/${r.img}`} alt={r.name} />
            {r.name}
          </span>
        ),
        '재료': r.ingredients
      }))
    }
  ]

  const skillValues: Record<string, number> = {
    cobi: mining.cobi,
    ingot: mining.ingot,
    gemStart: mining.gemStart,
    gemShine: mining.gemShine,
    lucky: mining.lucky,
    firePick: mining.firePick,
  }

  return (
    <InfoPage
      toolName="곡괭이"
      toolKey="pickaxeLevel"
      toolMin={PICKAXE_CONFIG.min}
      toolMax={PICKAXE_CONFIG.max}
      toolValue={mining.pickaxeLevel}
      onToolChange={(v) => updateMining('pickaxeLevel', v)}
      skills={skills}
      skillValues={skillValues}
      onSkillChange={(key, value) => updateMining(key as keyof typeof mining, value)}
      recipeTabs={recipeTabs}
    />
  )
}