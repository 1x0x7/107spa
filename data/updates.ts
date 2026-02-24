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
    desc: "달콤 시리얼 > 토마토 라자냐 > 허브 삼겹살 찜", 
    date: "2025.02.24", 
    isLatest: true,
    details: {
      changes: [
        "요리 가격 변동",
      ],
      fixes: [
        "해양 스태미나 15 단위로 계산 보정"

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