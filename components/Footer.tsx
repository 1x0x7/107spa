import { useState } from 'react'
import ContactModal from './ContactModal'

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <footer className="footer">
      <div>
        © 1x0x7 | 
        <span> 이미지 출처 · </span>
        <a href="https://wiki.ddingtycoon.kr/ko" target="_blank" rel="noopener noreferrer">
          띵타이쿤 온라인 공식 위키
        </a>
      </div>
      <div className="disclaimer">
        본 사이트는 비공식 사이트로, 계산 결과는 참고용이며 실제 게임 내 수치와 차이가 발생할 수 있습니다.
      </div>
      <button className="contact-btn" onClick={() => setIsModalOpen(true)}>
        문의하기
      </button>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  )
}