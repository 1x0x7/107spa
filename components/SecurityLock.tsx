'use client'

import { useSecurityLock } from '@/hooks/useSecurityLock'

/**
 * 보안 잠금 컴포넌트
 * layout.tsx에 추가하면 전체 사이트에 적용됨
 */
export function SecurityLock() {
  useSecurityLock()
  return null
}