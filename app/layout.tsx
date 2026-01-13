import Header from '@/components/Header';
import SubHeader from '@/components/SubHeader';
import Footer from '@/components/Footer';
import './styles/globals.css';
import './styles/layout.css';
import './styles/dark.css';

export const metadata = {
  title: '띵타이쿤 계산기',
  description: '채광 · 재배 · 해양 효율 계산기',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="layout-root">
        {/* 공통 헤더 */}
        <Header />
        <SubHeader />

        {/* 페이지 콘텐츠 */}
        <main className="layout-main">
          <div className="content-area">{children}</div>
        </main>

        {/* 공통 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
