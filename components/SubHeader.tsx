'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

const tabs: Record<string, { href: string; label: string }[]> = {
  mining: [
    { href: '/mining/info', label: '정보' },
    { href: '/mining/stamina', label: '스태미나' },
    // { href: '/mining/convert', label: '변환' },
  ],
  farming: [
    { href: '/farming/info', label: '정보' },
    { href: '/farming/stamina', label: '스태미나' },
    /*{ href: '/farming/efficiency', label: '요리 효율' },
    { href: '/farming/harvest', label: '수확' },*/
  ],
  ocean: [
    { href: '/ocean/info', label: '정보' },
    { href: '/ocean/stamina', label: '스태미나' },
    { href: '/ocean/gold', label: '연금품' },
  ],
}

function SubHeader() {
  const pathname = usePathname()
  const section = pathname.split('/')[1]
  const currentTabs = tabs[section]

  if (!currentTabs) return null

  return (
    <div className="sub-header">
      <nav className="main-nav sub-nav">
        {currentTabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={pathname === tab.href ? 'active' : ''}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default memo(SubHeader)
