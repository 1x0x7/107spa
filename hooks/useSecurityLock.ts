'use client'

import { useEffect } from 'react'

/**
 * 스크롤 및 복사 방지 훅
 * 전체 사이트에 적용하려면 layout.tsx에서 사용
 */
export function useSecurityLock() {
  useEffect(() => {
    // localhost 여부 확인
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1'
    
    // 스크롤 방지
    document.body.style.overflow = 'hidden'
    
    // 복사 방지 (input/textarea 제외)
    const preventCopy = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault()
      }
    }
    
    // 우클릭 방지
    const preventContextMenu = (e: Event) => e.preventDefault()
    
    // 텍스트 선택 방지 (input/textarea 제외)
    const preventSelect = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault()
      }
    }
    
    // 키보드 단축키 방지
    const preventKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      // input/textarea에서는 허용
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      
      // Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+S, Ctrl+U 차단
      if ((e.ctrlKey || e.metaKey) && ['c', 'a', 'x', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
      
      // localhost에서는 개발자 도구 허용
      if (!isLocalhost) {
        // F12 (개발자도구) 차단
        if (e.key === 'F12') {
          e.preventDefault()
        }
        // Ctrl+Shift+I (개발자도구) 차단
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
          e.preventDefault()
        }
      }
    }
    
    // 드래그 방지 (input/textarea 제외)
    const preventDrag = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault()
      }
    }
    
    document.addEventListener('copy', preventCopy)
    document.addEventListener('cut', preventCopy)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('selectstart', preventSelect)
    document.addEventListener('keydown', preventKeydown)
    document.addEventListener('dragstart', preventDrag)
    
    // CSS로 텍스트 선택 방지
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.removeEventListener('copy', preventCopy)
      document.removeEventListener('cut', preventCopy)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('selectstart', preventSelect)
      document.removeEventListener('keydown', preventKeydown)
      document.removeEventListener('dragstart', preventDrag)
    }
  }, [])
}