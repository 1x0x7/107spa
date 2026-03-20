// =========================
// 통합 포맷 유틸리티
// =========================

/**
 * 숫자를 천 단위 콤마가 있는 문자열로 변환
 * @example fmt(12345) // "12,345"
 */
export const fmt = (n: number): string => n.toLocaleString()

/**
 * 숫자를 골드 단위로 포맷
 * @example formatGold(12345) // "12,345G"
 */
export const formatGold = (n: number): string => `${fmt(n)}G`

/**
 * 숫자를 골드 단위로 포맷 (공백 포함)
 * @example formatGoldWithSpace(12345) // "12,345 G"
 */
export const formatGoldWithSpace = (n: number): string => `${fmt(n)} G`

/**
 * 소수를 퍼센트로 변환 (0.15 → "15%")
 * @example formatPercent(0.15) // "15%"
 */
export const formatPercent = (n: number): string => `${Math.round(n * 100)}%`

/**
 * 소수를 퍼센트로 변환 (소수점 1자리)
 * @example formatPercentDecimal(0.155) // "15.5%"
 */
export const formatPercentDecimal = (n: number, decimals = 1): string => 
  `${(n * 100).toFixed(decimals)}%`

/**
 * 숫자를 "개" 단위로 포맷
 * @example formatCount(100) // "100개"
 */
export const formatCount = (n: number): string => `${fmt(n)}개`

/**
 * 숫자를 부호와 함께 포맷 (+100, -50)
 * @example formatSigned(100) // "+100"
 * @example formatSigned(-50) // "-50"
 */
export const formatSigned = (n: number): string => 
  n >= 0 ? `+${fmt(n)}` : fmt(n)

/**
 * 숫자를 부호가 있는 퍼센트로 포맷
 * @example formatSignedPercent(0.15) // "+15%"
 */
export const formatSignedPercent = (n: number): string => 
  n >= 0 ? `+${formatPercent(n)}` : formatPercent(n)

/**
 * 큰 숫자를 축약해서 표시 (1.2K, 3.5M 등)
 * @example formatCompact(1234) // "1.2K"
 * @example formatCompact(1234567) // "1.2M"
 */
export const formatCompact = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

/**
 * 숫자를 소수점 자릿수로 포맷
 * @example formatDecimal(3.14159, 2) // "3.14"
 */
export const formatDecimal = (n: number, decimals = 2): string => 
  n.toFixed(decimals)

/**
 * 범위를 포맷 (최소~최대)
 * @example formatRange(100, 500) // "100 ~ 500"
 */
export const formatRange = (min: number, max: number): string => 
  `${fmt(min)} ~ ${fmt(max)}`

/**
 * 골드 범위를 포맷
 * @example formatGoldRange(100, 500) // "100G ~ 500G"
 */
export const formatGoldRange = (min: number, max: number): string => 
  `${formatGold(min)} ~ ${formatGold(max)}`
