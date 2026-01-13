import { UPDATE_HISTORY } from '@/data/updates';

export default function HomePage() {
  const latestUpdate = UPDATE_HISTORY.find(u => u.isLatest);
  const pastUpdates = UPDATE_HISTORY.filter(u => !u.isLatest);

  return (
    <>
      {/* 사용법 */}
      <section className="content-block usage-warning">
        정보 탭에 본인 스펙 입력 후, 계산기 활용
      </section>

      {/* 최신 업데이트 */}
      {latestUpdate && (
        <section className="content-block">
          <div className="update-banner">
            <div className="update-banner-badge">최신 업데이트</div>
            <div className="update-banner-title">{latestUpdate.title}</div>

            {latestUpdate.desc && (
              <div className="update-banner-desc">{latestUpdate.desc}</div>
            )}

            <div className="update-banner-date">{latestUpdate.date}</div>
          </div>
        </section>
      )}

      {/* 업데이트 내역 */}
      <section className="content-block">
        <h3 className="content-title">업데이트 내역</h3>

        <div className="update-list">
          {pastUpdates.map((item, idx) => (
            <div key={idx} className="update-item">
              <div className="update-title">{item.title}</div>
              <div className="update-meta">{item.date}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
