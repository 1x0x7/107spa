'use client'

import { ExpertProvider } from '@/hooks/useExpert'

export default function MiningLayout({ children }: { children: React.ReactNode }) {
  return <ExpertProvider>{children}</ExpertProvider>
}
