'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleTheme = () => {
    const newDark = !isDark
    
    document.documentElement.classList.add('theme-transition')
    
    setIsDark(newDark)
    document.documentElement.setAttribute(
      'data-theme',
      newDark ? 'dark' : 'light'
    )
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transition')
      })
    })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/mining/info', label: '채광', activePrefix: '/mining' },
    { href: '/farming/info', label: '재배', activePrefix: '/farming' },
    { href: '/ocean/info', label: '해양', activePrefix: '/ocean' },
    { href: '/hunting/info', label: '사냥', activePrefix: '/hunting' },
    { href: '/system/enchant', label: '시스템', activePrefix: '/system' },
  ]

  return (
    <>
      <div className="unofficial-notice">
        <p>
          본 문서는 띵타이쿤 온라인의 공식 문서가 아닙니다.
          본 문서의 내용은 일부 실제 내용과 다를 수 있습니다.
        </p>
      </div>

      <header className="top-header">
        <div className="header-inner">
          <div className="logo" onClick={toggleTheme}>
            <Image
              src={isDark ? '/img/1x0x7_2.png' : '/img/1x0x7_.png'}
              alt="로고"
              width={40}
              height={40}
              priority
            />
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="main-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.activePrefix || link.href) ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* 모바일 오버레이 */}
      <div 
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'show' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* 모바일 네비게이션 드로어 */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">메뉴</span>
          <button 
            className="mobile-nav-close"
            onClick={closeMobileMenu}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.activePrefix || link.href) ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
