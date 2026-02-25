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
    title: "정기 업데이트", 
    desc: "채광 럭키 히트 수정, 연금 레시피 수정", 
    date: "2025.02.25", 
    isLatest: true,
    details: {
      changes: [
        "사이트 이름 변경",
        "럭키히트 스킬 상향",
      ],
      fixes: [

      ],
      notes: [
        "다음 업데이트 : 02.27 예정(요리 가격변동)"
      ]
    }
  },
  { title: "요리가격 업데이트", date: "2025.02.24" },
  { title: "요리가격 업데이트", date: "2025.02.21" },
  { title: "요리가격 업데이트", date: "2025.02.15" },
]