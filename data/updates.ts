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
    title: "정기 점검 업데이트", 
    desc: "프리미엄 한정가, 연금 2/3성 재료 너프", 
    date: "2025.01.28", 
    isLatest: true,
    details: {
      changes: [
        "프리미엄 한정가  5-7-10-15-20-30-40-50 -> 5-7-9-12-15-20-25-30 변경",
        "2성 에센스 해초 4개 -> 6개 변경",
        "2성 결정 켈프 4개 -> 8개 변경",
        "3성 영약 말린 켈프 6개 -> 12개 변경",
        "연금품 출력 결과에 기존 보유량이 포함되어 출력 -> 기존 보유량이 포함되지 않게 변경",

      ],
      fixes: [
        "불우렁쉥이, 유리병 수량 수정",
      ],
      notes: [
        "다음 업데이트 : 01.30 예정"
      ]
    }
  },
  { title: "요리 가격 업데이트", date: "2025.01.27" },
  { title: "해양 수정 및 사이트 리뉴얼", date: "2025.01.25" },
  { title: "요리 가격 수정 01.24 ~ 01.27", date: "2025.01.24" },
]