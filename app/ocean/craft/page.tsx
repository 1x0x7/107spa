'use client'

import { CRAFT_PRICES, PRICE_DATES } from '@/data/updates'
import './craft.css'

// 공예품 데이터 (재활용품 타입 포함)
const CRAFT_ITEMS = [
  { 
    key: 'brooch',
    name: '조개껍데기 브로치', 
    ingredients: '깨진 조개껍데기 1 + 노란빛 진주 1 + 금속 재활용품 1 + 거미줄 4',
    maxPrice: 50000,
    img: 'yellow_clam.png',
    recycleImgs: ['metal.png']  // 금속
  },
  { 
    key: 'perfume',
    name: '푸른 향수병', 
    ingredients: '깨진 조개껍데기 2 + 푸른빛 진주 1 + 합성수지 1 + 플라스틱 1 + 양동이 8',
    maxPrice: 150000,
    img: 'blue_perfume.png',
    recycleImgs: ['resin.png', 'pt.png']  // 합성수지, 플라스틱
  },
  { 
    key: 'mirror',
    name: '자개 손거울', 
    ingredients: '깨진 조개껍데기 3 + 청록빛 진주 1 + 합금 2 + 플라스틱 2 + 유리판 16',
    maxPrice: 300000,
    img: 'mirror.png',
    recycleImgs: ['alloy.png', 'pt.png']  // 합금, 플라스틱
  },
  { 
    key: 'hairpin',
    name: '분홍 헤어핀', 
    ingredients: '깨진 조개껍데기 4 + 분홍빛 진주 1 + 합성수지 3 + 섬유 3 + 대나무 64 + 분홍 꽃잎 16',
    maxPrice: 500000,
    img: 'hairpin.png',
    recycleImgs: ['resin.png', 'fiber.png']  // 합성수지, 섬유
  },
  { 
    key: 'fan',
    name: '자개 부채', 
    ingredients: '깨진 조개껍데기 5 + 보라빛 진주 1 + 합금 5 + 합성수지 5 + 막대기 64 + 자수정 조각 16',
    maxPrice: 700000,
    img: 'fan.png',
    recycleImgs: ['alloy.png', 'resin.png']  // 합금, 합성수지
  },
  { 
    key: 'watch',
    name: '흑진주 시계', 
    ingredients: '깨진 조개껍데기 7 + 흑진주 1 + 금속 7 + 합금 7 + 섬유 7 + 흑요석 16 + 시계 8',
    maxPrice: 1000000,
    img: 'black_pearl.png',
    recycleImgs: ['metal.png', 'alloy.png', 'fiber.png']  // 금속, 합금, 섬유
  },
]

// 숫자 포맷
const formatGold = (n: number) => n.toLocaleString()

export default function OceanCraftPage() {
  return (
    <section className="craft-page">
      
      <div className="craft-card">
        <div className="craft-card-header">
          <span className="craft-card-title">공예품 시세</span>
          <span className="craft-date-badge">{PRICE_DATES.craft}</span>
        </div>
        
        <div className="craft-grid">
          {CRAFT_ITEMS.map((item) => {
            const currentPrice = CRAFT_PRICES[item.key] || 0
            const percent = Math.round((currentPrice / item.maxPrice) * 100)
            
            return (
              <div key={item.key} className="craft-item">
                <img 
                  src={`/img/ocean/${item.img}`} 
                  alt={item.name}
                  className="craft-icon"
                />
                <div className="craft-info">
                  <div className="craft-name-row">
                    <span className="craft-name">{item.name}</span>
                    <div className="craft-recycle-icons">
                      {item.recycleImgs.map((img, idx) => (
                        <img 
                          key={idx}
                          src={`/img/ocean/${img}`} 
                          alt="재활용품"
                          className="craft-recycle-icon"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="craft-ingredients">{item.ingredients}</div>
                  <div className="craft-price-row">
                    <span className="craft-current-price">
                      {formatGold(currentPrice)}G
                    </span>
                    <span className={`craft-percent ${percent >= 90 ? 'high' : ''}`}>{percent}%</span>
                    <span className="craft-price-range">
                      (최고 {formatGold(item.maxPrice)}G)
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
      </div>
    </section>
  )
}
