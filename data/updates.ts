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
    desc: "토마토 라자냐 > 삼겹살 토마토 찌개 > 로스트 치킨 파이", 
    date: "2025.02.12", 
    isLatest: true,
    details: {
      changes: [
        "요리 가격 변동",
        "사냥꾼 스태미나 페이지 추가",
      ],
      fixes: [


      ],
      notes: [
        "다음 업데이트 : 02.15 예정(요리 가격 변경)"
      ]
    }
  },
  { title: "사냥 전문가, 각인 시스템 추가", date: "2025.02.05" },
  { title: "강화 / 수수료 계산 추가", date: "2025.02.03" },
  { title: "재배/해양 업데이트", date: "2025.02.03" },
]