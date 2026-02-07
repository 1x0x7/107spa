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
    desc: "삼겹살 토마토 찌개 > 마늘 양갈비 핫도그 > 스윗 치킨 햄버거", 
    date: "2025.02.05", 
    isLatest: true,
    details: {
      changes: [
        "요리 가격 변동",
        "모든 전문가 정보 탭 이미지 추가",
        "강화 재료 맟 계약서 시세 변경 (02.07 기준)",
        "해양 제작 아이템에 마우스를 올리면 조합법이 표시",
      ],
      fixes: [
        "각인 이미지 출력 오류 수정",
        "1성 2성 3성 이름 출력 오류 수정",


      ],
      notes: [
        "해양 제작 아이템에 마우스를 올리면 조합법이 표시 예정",
        "다음 업데이트 : 02.09 예정(요리 가격 변경)"
      ]
    }
  },
  { title: "사냥 전문가, 각인 시스템 추가", date: "2025.02.05" },
  { title: "강화 / 수수료 계산 추가", date: "2025.02.03" },
  { title: "재배/해양 업데이트", date: "2025.02.03" },
]