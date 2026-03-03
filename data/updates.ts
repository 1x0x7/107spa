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
    desc: "로스트 치킨 파이 > 스윗 치킨 햄버거 > 허브 삼겹살 찜 ", 
    date: "2025.03.03", 
    isLatest: true,
    details: {
      changes: [
      ],
      fixes: [

      ],
      notes: [
        "다음 업데이트 : 03.3 예정(요리 가격변동)"
      ]
    }
  },
  { title: "요리가격 업데이트", date: "2025.03.01" },
  { title: "요리가격 업데이트", date: "2025.02.27" },
  { title: "정기 업데이트", date: "2025.02.25" },

]