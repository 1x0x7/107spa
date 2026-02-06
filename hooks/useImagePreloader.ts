import { useEffect } from 'react'

/**
 * 이미지 프리로딩 훅
 * 앱 마운트 시 이미지를 미리 브라우저 캐시에 로드하여 탭 전환 시 깜빡임 방지
 */
export function useImagePreloader(imagePaths: string[]) {
  useEffect(() => {
    imagePaths.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, []) // 마운트 시 1회만 실행
}
