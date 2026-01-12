import './styles/globals.css'
import Header from '@/components/Header'
import SubHeader from '@/components/SubHeader'
import Footer from '@/components/Footer'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  title: '띵타이쿤 계산기 - 채광 · 재배 · 해양 효율 계산기',
  description: '띵타이쿤 채광, 재배, 해양 콘텐츠 수익을 계산하는 효율 계산기',
  icons: { icon: '/img/1x0x7_.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <SubHeader />
        <main className="page">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  )
}
