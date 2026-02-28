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
    desc: "트리플 소갈비 꼬치 > 딥 크림 빠네 > 허브 삼겹살 찜 ", 
    date: "2025.03.01", 
    isLatest: true,
    details: {
      changes: [
        "강화, 계약서 가격 변경"
      ],
      fixes: [

      ],
      notes: [
        "다음 업데이트 : 03.3 예정(요리 가격변동)"
      ]
    }
  },
  { title: "요리가격 업데이트", date: "2025.02.27" },
  { title: "정기 업데이트", date: "2025.02.25" },
  { title: "요리가격 업데이트", date: "2025.02.24" },

]