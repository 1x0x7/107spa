'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.setAttribute(
      'data-theme',
      newDark ? 'dark' : 'light'
    )
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

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

          <nav className="main-nav">
            <Link href="/" className={isActive('/') ? 'active' : ''}>
              홈
            </Link>
            <Link href="/mining" className={isActive('/mining') ? 'active' : ''}>
              채광
            </Link>
            <Link href="/farming" className={isActive('/farming') ? 'active' : ''}>
              재배
            </Link>
            <Link href="/ocean" className={isActive('/ocean') ? 'active' : ''}>
              해양
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
