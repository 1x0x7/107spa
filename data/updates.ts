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
    desc: "01.27~01.30 요리 가격 변경", 
    date: "2025.01.27", 
    isLatest: true,
    details: {
      changes: [
        "재배-정보 조합법 이미지 추가",
        "재배-스태미나 결과창 이미지 추가",
        "요리 시세 변동",
        "페이지 하단 문의하기 추가",
        "최신 업데이트 상세 정보 표시 "
      ],
      fixes: [
        "정보탭 드래그 삭제 불가 -> 가능",
        "연금 보유량 입력 시 천장값 존재 -> 천장값 삭제",
        "연금 3성 필요 재료 수량 수정"
      ],
      notes: [
        "다음 업데이트 : 01.28 예정"
      ]
    }
  },
  { title: "해양 수정 및 사이트 리뉴얼", date: "2025.01.25" },
  { title: "요리 가격 수정 01.24 ~ 01.27", date: "2025.01.24" },
  { title: "해양 가격 수정", date: "2025.01.21" },
]