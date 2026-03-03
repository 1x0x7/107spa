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
            <div className="update-banner-header">
              <div className="update-banner-badge">최신 업데이트</div>
              {latestUpdate.details && (
                <div className="update-banner-hint">자세히 보기 ▼</div>
              )}
            </div>

            <div className="update-banner-title">{latestUpdate.title}</div>

            {latestUpdate.desc && (
              <div className="update-banner-desc">{latestUpdate.desc}</div>
            )}

            <div className="update-banner-date">{latestUpdate.date}</div>

            {latestUpdate.details && (
              <div className="update-banner-details">
                {latestUpdate.details.changes && latestUpdate.details.changes.length > 0 && (
                  <div className="update-detail-section">
                    <div className="update-detail-title">변경사항</div>
                    <ul className="update-detail-list">
                      {latestUpdate.details.changes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {latestUpdate.details.fixes && latestUpdate.details.fixes.length > 0 && (
                  <div className="update-detail-section">
                    <div className="update-detail-title">버그 수정</div>
                    <ul className="update-detail-list">
                      {latestUpdate.details.fixes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {latestUpdate.details.notes && latestUpdate.details.notes.length > 0 && (
                  <div className="update-detail-section">
                    <div className="update-detail-title">예정</div>
                    <ul className="update-detail-list">
                      {latestUpdate.details.notes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 업데이트 내역 */}
      <section className="content-block">
        <h3 className="content-title">업데이트 내역</h3>

        <div className="update-list">
          {pastUpdates.map((item, idx) => (
            <div key={idx} className={`update-item ${item.details ? 'has-details' : ''}`}>
              <div className="update-title">{item.title}</div>
              <div className="update-meta">{item.date}</div>
              
              {item.desc && (
                <div className="update-item-desc">{item.desc}</div>
              )}

              {/* 호버 시 보이는 상세 내용 */}
              {item.details && (
                <div className="update-item-details">
                  {item.details.changes && item.details.changes.length > 0 && (
                    <div className="update-detail-section">
                      <div className="update-detail-title">변경사항</div>
                      <ul className="update-detail-list">
                        {item.details.changes.map((change, i) => (
                          <li key={i}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.details.fixes && item.details.fixes.length > 0 && (
                    <div className="update-detail-section">
                      <div className="update-detail-title">버그 수정</div>
                      <ul className="update-detail-list">
                        {item.details.fixes.map((fix, i) => (
                          <li key={i}>{fix}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.details.notes && item.details.notes.length > 0 && (
                    <div className="update-detail-section">
                      <div className="update-detail-title">예정</div>
                      <ul className="update-detail-list">
                        {item.details.notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}