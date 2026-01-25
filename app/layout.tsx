'use client'

import Header from '@/components/Header'
import SubHeader from '@/components/SubHeader'
import Footer from '@/components/Footer'
import { ExpertProvider } from '@/hooks/useExpert'
import './styles/globals.css'
import './styles/layout.css'
import './styles/dark.css'
import './styles/info.css'
import './styles/stamina.css'
import { SecurityLock } from '@/components/SecurityLock'
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>띵타이쿤 계산기</title>
        <meta name="description" content="채광 · 재배 · 해양 효율 계산기" />
        <link rel="icon" href="/img/1x0x7_.png" />
      </head>
      <body className="layout-root">
        <SecurityLock />
        <ExpertProvider>
          {/* 공통 헤더 */}
          <Header />
          <SubHeader />

          {/* 페이지 콘텐츠 */}
          <main className="layout-main">
            <div className="content-area">{children}</div>
          </main>

          {/* 공통 푸터 */}
          <Footer />
        </ExpertProvider>
        <Analytics />
      </body>
    </html>
  )
}