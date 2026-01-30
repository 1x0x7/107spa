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
    title: "재배 업데이트", 
    desc: "요리가격 변동", 
    date: "2025.01.30", 
    isLatest: true,
    details: {
      changes: [
        "요리 가격 변경",
      ],
      fixes: [
      ],
      notes: [
        "다음 업데이트 : 02.01 예정"
      ]
    }
  },
  { title: "정기 점검 업데이트", date: "2025.01.28" },
  { title: "요리 가격 업데이트", date: "2025.01.27" },
  { title: "해양 수정 및 사이트 리뉴얼", date: "2025.01.25" },
]