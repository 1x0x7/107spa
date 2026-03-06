export interface UpdateItem {
  title: string
  desc?: string
  date: string
  isLatest?: boolean
  details?: {
    changes?: string[]    // 변경사항
    fixes?: string[]      // 버그 수정
    notes?: string[]      // 참고사항
  }
}

export const UPDATE_HISTORY: UpdateItem[] = [
  { 
    title: "요리 업데이트", 
    desc: "달콤 시리얼 > 로스트 치킨 파이 > 삼색 아이스크림", 
    date: "2025.03.06", 
    isLatest: true,
    details: {
    }
  },

  { 
    title: "요리가격 업데이트", 
    date: "2025.03.03",
    details: {
      changes: ["로스트 치킨 파이 > 스윗 치킨 햄버거 > 허브 삼겹살 찜"],
      fixes: ["각인 옵션 블록이 페이지를 벗어나는 오류 개선"],
    }
  },
  { 
    title: "요리가격 업데이트", 
    date: "2025.03.01",
    details: {
      changes: ["트리플 소갈비 꼬치 > 딥 크림 빠네 > 허브 삼겹살 찜", "강화, 계약서 가격 변경"],
    }
  },
  { 
    title: "요리가격 업데이트", 
    date: "2025.02.27",
    details: {
      changes: ["토마토 라자냐 > 트리플 소갈비 꼬치 > 달콤 시리얼 "],
    }
  },

]