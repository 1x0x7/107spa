import { UPDATE_HISTORY } from '@/data/updates'

export default function HomePage() {
  const latestUpdate = UPDATE_HISTORY.find(u => u.isLatest)

  return (
    <section className="content-area">
      {/* 사용법 카드 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 className="card-title">사용법</h3>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            정보 탭에 본인 스펙 입력 후, 계산기 활용
          </p>
        </div>
      </div>

      {/* 최신 업데이트 배너 */}
      {latestUpdate && (
        <div className="update-banner">
          <div className="update-banner-badge">최신 업데이트</div>
          <div className="update-banner-title">{latestUpdate.title}</div>
          {latestUpdate.desc && <div className="update-banner-desc">{latestUpdate.desc}</div>}
          <div className="update-banner-date">{latestUpdate.date}</div>
        </div>
      )}

      {/* 업데이트 내역 */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">업데이트 내역</h3>
        </div>
        <div className="card-body">
          <div className="update-list">
            {UPDATE_HISTORY.filter(u => !u.isLatest).map((item, idx) => (
              <div key={idx} className="update-item">
                <div className="update-content">
                  <div className="update-title">{item.title}</div>
                  <div className="update-meta">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
