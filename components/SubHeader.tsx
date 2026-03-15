'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

const tabs: Record<string, { href: string; label: string }[]> = {
  mining: [
    { href: '/mining/info', label: '정보' },
    { href: '/mining/stamina', label: '스태미나' },
    { href: '/mining/calculator', label: '역계산' },
    // { href: '/mining/convert', label: '변환' },
  ],
  farming: [
    { href: '/farming/info', label: '정보' },
    { href: '/farming/stamina', label: '스태미나' },
    { href: '/farming/efficiency', label: '요리 효율' },
    { href: '/farming/calculator', label: '역계산' },
    /*{ href: '/farming/harvest', label: '수확' },*/
  ],
  ocean: [
    { href: '/ocean/info', label: '정보' },
    { href: '/ocean/stamina', label: '스태미나' },
    { href: '/ocean/gold', label: '연금품' },
    //{ href: '/ocean/craft', label: '공예품' },
    //{ href: '/ocean/calculator', label: '역계산' },
  ],
  hunting: [
    { href: '/hunting/info', label: '정보' },
    { href: '/hunting/stamina', label: '스태미나' },
    //{ href: '/hunting/calculator', label: '역계산' },
  ],
  system: [
    { href: '/system/enchant', label: '강화' },
    { href: '/system/engrave', label: '각인' },
    { href: '/system/fee', label: '수수료' },
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