'use client'

import { useState } from 'react'
import { useExpert } from '@/hooks/useExpert'
import { GOLD_PRICES, PREMIUM_RATE } from '@/data/ocean'

type StarLevel = '1' | '2' | '3'

export default function OceanGoldPage() {
  const { ocean } = useExpert()
  const [starLevel, setStarLevel] = useState<StarLevel>('1')
  const [advancedMode, setAdvancedMode] = useState(false)
  const [result, setResult] = useState<{ gold: number; products: { A: number; K: number; L: number } } | null>(null)

  const [input, setInput] = useState({
    oyster: 0, conch: 0, octopus: 0, seaweed: 0, urchin: 0,
    essGuard: 0, essWave: 0, essChaos: 0, essLife: 0, essDecay: 0,
    coreWG: 0, coreWP: 0, coreOD: 0, coreVD: 0, coreED: 0
  })

  const fmt = (n: number) => n.toLocaleString()
  const getPremiumRate = () => PREMIUM_RATE[ocean.premiumPrice] || 0
  const floorToTwo = (n: number) => Math.floor(n / 2) * 2

  const calculate1Star = () => {
    // 어패류 → 정수 (2개씩 묶음)
    const essFromShellfish = {
      guard: floorToTwo(input.oyster), wave: floorToTwo(input.conch),
      chaos: floorToTwo(input.octopus), life: floorToTwo(input.seaweed), decay: floorToTwo(input.urchin)
    }

    const availableEss = {
      guard: (advancedMode ? input.essGuard : 0) + essFromShellfish.guard,
      wave: (advancedMode ? input.essWave : 0) + essFromShellfish.wave,
      chaos: (advancedMode ? input.essChaos : 0) + essFromShellfish.chaos,
      life: (advancedMode ? input.essLife : 0) + essFromShellfish.life,
      decay: (advancedMode ? input.essDecay : 0) + essFromShellfish.decay
    }

    const totalCore = advancedMode
      ? { WG: input.coreWG, WP: input.coreWP, OD: input.coreOD, VD: input.coreVD, ED: input.coreED }
      : { WG: 0, WP: 0, OD: 0, VD: 0, ED: 0 }

    let best = { gold: -1, A: 0, K: 0, L: 0 }
    const maxProducts = Math.floor((Object.values(availableEss).reduce((a, b) => a + b, 0) + Object.values(totalCore).reduce((a, b) => a + b, 0)) / 3) + 1

    for (let A = 0; A <= maxProducts; A++) {
      for (let K = 0; K <= maxProducts; K++) {
        for (let L = 0; L <= maxProducts; L++) {
          const needCore = { WG: A + L, WP: K + L, OD: A + K, VD: A + K, ED: L }
          const makeCore = {
            WG: Math.max(0, needCore.WG - totalCore.WG), WP: Math.max(0, needCore.WP - totalCore.WP),
            OD: Math.max(0, needCore.OD - totalCore.OD), VD: Math.max(0, needCore.VD - totalCore.VD),
            ED: Math.max(0, needCore.ED - totalCore.ED)
          }
          const needEss = {
            guard: makeCore.WG + makeCore.ED, wave: makeCore.WG + makeCore.WP,
            chaos: makeCore.WP + makeCore.OD, life: makeCore.OD + makeCore.VD, decay: makeCore.VD + makeCore.ED
          }
          if (needEss.guard > availableEss.guard || needEss.wave > availableEss.wave ||
            needEss.chaos > availableEss.chaos || needEss.life > availableEss.life || needEss.decay > availableEss.decay) continue

          const gold = A * GOLD_PRICES['1star'].A + K * GOLD_PRICES['1star'].K + L * GOLD_PRICES['1star'].L
          if (gold > best.gold) best = { gold, A, K, L }
        }
      }
    }

    if (best.gold < 0) { alert('재료가 부족합니다.'); return }
    setResult({ gold: best.gold, products: { A: best.A, K: best.K, L: best.L } })
  }

  const productNames: Record<StarLevel, { A: string; K: string; L: string }> = {
    '1': { A: '영생의 아쿠티스', K: '크라켄의 광란체', L: '리바이던의 깃털' },
    '2': { A: '해구의 파동 코어', K: '침묵의 심해 비약', L: '청해룡의 날개' },
    '3': { A: '아쿠아 펄스 파편', K: '나우틸러스의 손', L: '무저의 척추' }
  }

  const stars = starLevel === '1' ? '★' : starLevel === '2' ? '★★' : '★★★'

  return (
    <section className="content-area">
      <h2 className="content-title">골드 수익 최적화</h2>

      {/* 성급 선택 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {(['1', '2', '3'] as StarLevel[]).map(s => (
          <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="radio" name="star" checked={starLevel === s} onChange={() => setStarLevel(s)} />
            <span>{s}성</span>
          </label>
        ))}
        <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>고급 모드</span>
          <input type="checkbox" checked={advancedMode} onChange={(e) => setAdvancedMode(e.target.checked)} />
        </label>
      </div>

      {/* 입력 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 className="card-title">{starLevel}성 계산기</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { key: 'oyster', name: `굴 ${stars}` },
              { key: 'conch', name: `소라 ${stars}` },
              { key: 'octopus', name: `문어 ${stars}` },
              { key: 'seaweed', name: `미역 ${stars}` },
              { key: 'urchin', name: `성게 ${stars}` }
            ].map(item => (
              <label key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.8rem' }}>
                {item.name}
                <input
                  type="number"
                  min={0}
                  value={input[item.key as keyof typeof input] || ''}
                  onChange={(e) => setInput({ ...input, [item.key]: parseInt(e.target.value) || 0 })}
                  style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 6, textAlign: 'center' }}
                />
              </label>
            ))}
          </div>

          {advancedMode && (
            <>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--color-primary)' }}>보유 정수</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12, marginBottom: 16 }}>
                {[
                  { key: 'essGuard', name: '수호' }, { key: 'essWave', name: '파동' },
                  { key: 'essChaos', name: '혼란' }, { key: 'essLife', name: '생명' }, { key: 'essDecay', name: '부식' }
                ].map(item => (
                  <label key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.8rem' }}>
                    {item.name}
                    <input
                      type="number"
                      min={0}
                      value={input[item.key as keyof typeof input] || ''}
                      onChange={(e) => setInput({ ...input, [item.key]: parseInt(e.target.value) || 0 })}
                      style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 6, textAlign: 'center' }}
                    />
                  </label>
                ))}
              </div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--color-primary)' }}>보유 핵</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12, marginBottom: 16 }}>
                {[
                  { key: 'coreWG', name: '물결수호' }, { key: 'coreWP', name: '파동오염' },
                  { key: 'coreOD', name: '질서파괴' }, { key: 'coreVD', name: '활력붕괴' }, { key: 'coreED', name: '침식방어' }
                ].map(item => (
                  <label key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.8rem' }}>
                    {item.name}
                    <input
                      type="number"
                      min={0}
                      value={input[item.key as keyof typeof input] || ''}
                      onChange={(e) => setInput({ ...input, [item.key]: parseInt(e.target.value) || 0 })}
                      style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 6, textAlign: 'center' }}
                    />
                  </label>
                ))}
              </div>
            </>
          )}

          <button
            onClick={starLevel === '1' ? calculate1Star : () => alert('2성/3성 계산기는 준비 중입니다.')}
            style={{ padding: '12px 24px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
          >
            최대 골드 계산
          </button>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="result-card">
          <div className="result-section-title">
            <span>📊 최적 조합 결과</span>
            <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '1.2rem' }}>
              💰 {fmt(Math.floor(result.gold * (1 + getPremiumRate())))} G
              {getPremiumRate() > 0 && <span style={{ fontSize: '0.8rem', marginLeft: 8 }}>+{Math.round(getPremiumRate() * 100)}%</span>}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ background: 'var(--color-bg)', padding: 16, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>{productNames[starLevel].A}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{result.products.A}</div>
            </div>
            <div style={{ background: 'var(--color-bg)', padding: 16, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>{productNames[starLevel].K}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{result.products.K}</div>
            </div>
            <div style={{ background: 'var(--color-bg)', padding: 16, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>{productNames[starLevel].L}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{result.products.L}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
