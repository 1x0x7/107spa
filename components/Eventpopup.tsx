'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'event_popup_hide_until';

function isHiddenToday(): boolean {
  if (typeof window === 'undefined') return true;
  const hideUntil = localStorage.getItem(STORAGE_KEY);
  if (!hideUntil) return false;
  return new Date().getTime() < Number(hideUntil);
}

function hideUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  localStorage.setItem(STORAGE_KEY, midnight.getTime().toString());
}

interface EventPopupProps {
  onOpenContact?: () => void;
}

export default function EventPopup({ onOpenContact }: EventPopupProps) {
  const [visible, setVisible] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isHiddenToday()) {
      const timer = setTimeout(() => setVisible(true), 350);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    if (hideToday) hideUntilMidnight();
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 250);
  };

  const handleGoContact = () => {
    handleClose();
    setTimeout(() => {
      onOpenContact?.();
    }, 300);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`


        .ep-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.35);
          animation: ep-fadeIn 0.25s ease;
        }
        .ep-overlay.ep-closing {
          animation: ep-fadeOut 0.25s ease forwards;
        }
        @keyframes ep-fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ep-fadeOut { from { opacity: 1 } to { opacity: 0 } }

        .ep-card {
          width: 320px;
          max-width: 88vw;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          animation: ep-up 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .ep-closing .ep-card {
          animation: ep-down 0.25s ease forwards;
        }
        @keyframes ep-up {
          from { opacity: 0; transform: translateY(16px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes ep-down {
          from { opacity: 1; transform: translateY(0) }
          to { opacity: 0; transform: translateY(10px) }
        }

        .ep-top {
          display: flex;
          justify-content: flex-end;
          padding: 12px 14px 0;
        }
        .ep-close {
          background: none;
          border: none;
          font-size: 16px;
          color: #ccc;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .ep-close:hover { color: #999; }

        .ep-body {
          padding: 4px 24px 22px;
          text-align: center;
        }
        .ep-title {
          font-size: 16px;
          font-weight: 800;
          color: #333;
          margin: 0 0 14px;
        }
        .ep-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.65;
          margin: 0 0 12px;
        }
        .ep-gold {
          font-size: 14px;
          font-weight: 700;
          color: #ebab0a;
          margin: 0 0 10px;
        }
        .ep-note {
          font-size: 11px;
          color: #aaa;
          line-height: 1.5;
          margin: 0 0 18px;
        }

        .ep-cta {
          display: block;
          width: 100%;
          padding: 10px 0;
          border: none;
          border-radius: 8px;
          background: #ffe082;
          color: #5a4a00;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ep-cta:hover { background: #ffd54f; }
        .ep-cta:active { background: #ffca28; }

        .ep-footer {
          padding: 10px 20px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-top: 1px solid #f5f0d0;
        }
        .ep-footer label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #bbb;
          cursor: pointer;
        }
        .ep-footer label:hover { color: #888; }
        .ep-cb {
        appearance: none;
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        background: #ffffff !important;  /* ← 이거 추가 */
        border: 1.5px solid #d5d0b8;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        }
        .ep-cb:checked {
          border-color: #ffe082;
          background: #ffe082;
        }
        .ep-cb:checked::after {
          content: '\\2713';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          color: #5a4a00;
          font-size: 9px;
          font-weight: 700;
        }
        .ep-footer-close {
          font-size: 11px;
          color: #ccc;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
        }
        .ep-footer-close:hover { color: #999; }
      `}</style>

      <div
        className={`ep-overlay${closing ? ' ep-closing' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <div className="ep-card">
          <div className="ep-top">
            <button className="ep-close" onClick={handleClose}>&#x2715;</button>
          </div>

          <div className="ep-body">
            <p className="ep-title">사이트 이름을 지어주세요!</p>
            <p className="ep-desc">
              문의하기 &gt; 이름 제안하기를 통해<br />
              사이트 이름을 제안해주세요.
            </p>
            <p className="ep-gold">채택 상금 : 1,000,000 골드</p>
            <p className="ep-note">
              *상금 지급을 위해 닉네임을 함께 남겨주세요.<br />
              (채택자는 서버 내 귓속말로 연락 예정)
            </p>
            <button className="ep-cta" onClick={handleGoContact}>
              제안하러 가기
            </button>
          </div>

          <div className="ep-footer">
            <label>
              <input
                type="checkbox"
                className="ep-cb"
                checked={hideToday}
                onChange={(e) => setHideToday(e.target.checked)}
              />
              오늘 하루 보지 않기
            </label>
            <button className="ep-footer-close" onClick={handleClose}>닫기</button>
          </div>
        </div>
      </div>
    </>
  );
}