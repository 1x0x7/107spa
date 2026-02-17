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
    desc: "소갈비 꼬치 > 로스트 치킨 파이 > 달콤 시리얼", 
    date: "2025.02.18", 
    isLatest: true,
    details: {
      changes: [
        "요리 가격 변동",
      ],
      fixes: [


      ],
      notes: [
        "다음 업데이트 : 02.21 예정(정기 업데이트)"
      ]
    }
  },
  { title: "요리가격 업데이트", date: "2025.02.15" },
  { title: "사냥 전문가, 각인 시스템 추가", date: "2025.02.05" },
  { title: "강화 / 수수료 계산 추가", date: "2025.02.03" },
]