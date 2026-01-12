'use client'

import { ExpertProvider } from '@/hooks/useExpert'

export default function OceanLayout({ children }: { children: React.ReactNode }) {
  return <ExpertProvider>{children}</ExpertProvider>
}
