'use client'

import { ExpertProvider } from '@/hooks/useExpert'

export default function FarmingLayout({ children }: { children: React.ReactNode }) {
  return <ExpertProvider>{children}</ExpertProvider>
}
