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
    title: "사냥 전문가 업데이트", 
    desc: "사냥 - 정보 추가 / 시스템 - 각인 추가", 
    date: "2025.02.05", 
    isLatest: true,
    details: {
      changes: [
        "시스템 - 각인 추가",
        "신규 사냥 탭 추가",
      ],
      fixes: [

      ],
      notes: [
        "모든 전문가 정보 탭 이미지 추가 예정",
        "해양 제작 아이템에 마우스를 올리면 조합법이 표시 될 예정",
        "다음 업데이트 : 02.06 예정(내용 수정)"
      ]
    }
  },
  { title: "강화 / 수수료 계산 추가", date: "2025.02.03" },
  { title: "재배/해양 업데이트", date: "2025.02.03" },
  { title: "재배 업데이트", date: "2025.02.01" },
]