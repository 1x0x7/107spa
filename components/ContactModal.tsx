'use client';
import { useState } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [type, setType] = useState('버그/오류')
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ⚠️ 여기에 Discord Webhook URL을 입력하세요
  const WEBHOOK_URL = 'https://discord.com/api/webhooks/1465340719630782668/8vJye3EKduHVRF8TKPI2739e7LP1rMxR0jjjmeD2CSki-bZVKbBEDNftIvJ3haGn-vWl'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '새로운 문의',
            color: 0x5865F2,
            fields: [
              { name: '유형', value: type, inline: true },
              { name: '작성자', value: nickname || '익명', inline: true },
              { name: '내용', value: content }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      })
      alert('전송 완료 감사합니다!')
      setType('버그/오류')
      setNickname('')
      setContent('')
      onClose()
    } catch (error) {
      alert('전송 실패. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>문의하기</h2>
        <p className="modal-desc">버그 및 건의 등 의견을 자유롭게 남겨주세요!</p>
        
        <form onSubmit={handleSubmit}>
          <label>
            문의 유형
            <select value={type} onChange={e => setType(e.target.value)}>
              <option>버그/오류</option>
              <option>기능 건의</option>
              <option>질문</option>
              <option>기타 문의</option>
            </select>
          </label>

          <label>
            작성자 (선택)
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
            />
          </label>

          <label>
            내용
            <textarea
              placeholder=""
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '전송 중...' : '전송'}
          </button>
        </form>
      </div>
    </div>
  )
}