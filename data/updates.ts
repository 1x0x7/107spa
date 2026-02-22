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
    title: "요리 가격 업데이트", 
    desc: "삼색 아이스크림 > 로스트 치킨 파이 > 딥 크림 빠네", 
    date: "2025.02.21", 
    isLatest: true,
    details: {
      changes: [
        "요리 가격 변동",
        "해양 재료 가격 입력 가능",
      ],
      fixes: [
        "다크모드 수정",

      ],
      notes: [
        "다음 업데이트 : 02.24 예정(요리 가격변동)"
      ]
    }
  },
  { title: "요리가격 업데이트", date: "2025.02.21" },
  { title: "요리가격 업데이트", date: "2025.02.15" },
  { title: "사냥 전문가, 각인 시스템 추가", date: "2025.02.05" },
]