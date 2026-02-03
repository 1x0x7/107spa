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
    title: "재배/해양 업데이트", 
    desc: "요리가격 변동, 해양 스태미나 계산기 추가", 
    date: "2025.02.03", 
    isLatest: true,
    details: {
      changes: [
        "요리 가격 변경",
        "해양 스태미나 계산기 추가 - 연금품의 보유량을 토대로 어떤 어패류를 채집해야 하는지 알려줍니다",
      ],
      fixes: [
      ],
      notes: [
        "다음 업데이트 : 02.04 예정"
      ]
    }
  },
  { title: "재배 업데이트", date: "2025.02.01" },
  { title: "재배 업데이트", date: "2025.01.30" },
  { title: "정기 점검 업데이트", date: "2025.01.28" },
]