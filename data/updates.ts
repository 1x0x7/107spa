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
    title: "시스템 업데이트", 
    desc: "강화 / 수수료 계산 추가", 
    date: "2025.02.03", 
    isLatest: true,
    details: {
      changes: [
        "시스템 - 강화 , 수수료 추가",
      ],
      fixes: [

      ],
      notes: [
        "다음 업데이트 : 02.05 예정(정기 점검)"
      ]
    }
  },
  { title: "재배/해양 업데이트", date: "2025.02.05" },
  { title: "재배 업데이트", date: "2025.02.01" },
  { title: "재배 업데이트", date: "2025.01.30" },
]