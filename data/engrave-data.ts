// 각인 레벨별 데이터
export const ENGRAVING_DATA = [
  { level: 1, contracts: 3, gold: 200000, ruby: 10 },
  { level: 2, contracts: 6, gold: 400000, ruby: 20 },
  { level: 3, contracts: 9, gold: 600000, ruby: 30 },
  { level: 4, contracts: 12, gold: 600000, ruby: 30 },
]

// 각인석 종류
export const STONE_TYPES = {
  rough: { name: '투박한 각인석', probability: 5, goldCost: 200000, rubyCost: 10 },
  neat: { name: '단정한 각인석', probability: 10, goldCost: 400000, rubyCost: 20 },
  precise: { name: '정교한 각인석', probability: 15, goldCost: 600000, rubyCost: 30 },
}

// 영혼 계약서 종류
export const CONTRACT_TYPES = {
  prosperity: { name: '번영의 영혼 계약서', tool: '세이지 괭이' },
  crushing: { name: '파쇄의 영혼 계약서', tool: '세이지 곡괭이' },
  tide: { name: '만조의 영혼 계약서', tool: '세이지 낚싯대' },
  conquest: { name: '정복의 영혼 계약서', tool: '세이지 대검' },
}

// 기본 시세
export const DEFAULT_PRICES = {
  prosperity: 34417, //번영
  crushing: 26183, //파쇄
  tide: 38245, //만조
  conquest: 37087, //정복
  rough: 0, //투박한
  neat: 0, //단정한
  precise: 0, //정교한
}

// 각인 상세 옵션 데이터
export const ENGRAVE_OPTIONS = {
  prosperity: {
    tool: '세이지 괭이',
    options: [
      {
        name: '채집 강화',
        levels: [
          'I레벨, 채집력 5% 증가',
          'II레벨, 채집력 7% 증가',
          'III레벨, 채집력 10% 증가',
        ],
      },
      {
        name: '채집 가속',
        levels: [
          'I레벨, 채집 속도 8% 증가',
          'II레벨, 채집 속도 15% 증가',
          'III레벨, 채집 속도 25% 증가',
        ],
      },
      {
        name: '씨앗 행운',
        levels: [
          'I레벨, 25% 확률로 씨앗 +1',
          'II레벨, 50% 확률로 씨앗 +1',
          'III레벨, 75% 확률로 씨앗 +1',
          'IV레벨, 100% 확률로 씨앗 +1',
        ],
      },
      {
        name: '과일 행운',
        levels: [
          'I레벨, 25% 확률로 과일 +1',
          'II레벨, 50% 확률로 과일 +1',
          'III레벨, 75% 확률로 과일 +1',
          'IV레벨, 100% 확률로 과일 +1',
        ],
      },
      {
        name: '과일 가속',
        levels: [
          'I레벨, 과일 채집 시간 10% 감소',
          'II레벨, 과일 채집 시간 30% 감소',
          'III레벨, 과일 채집 시간 50% 감소',
        ],
      },
      {
        name: '빠른 농부',
        levels: [
          'I레벨, 신속 I 부여',
          'II레벨, 신속 II 부여',
          'III레벨, 신속 III 부여',
        ],
      },
    ],
  },
  crushing: {
    tool: '세이지 곡괭이',
    options: [
      {
        name: '채광 강화',
        levels: [
          'I레벨, 채광력 5% 증가',
          'II레벨, 채광력 7% 증가',
          'III레벨, 채광력 10% 증가',
        ],
      },
      {
        name: '채광 가속',
        levels: [
          'I레벨, 채광 속도 8% 증가',
          'II레벨, 채광 속도 15% 증가',
          'III레벨, 채광 속도 25% 증가',
        ],
      },
      {
        name: '광물 행운',
        levels: [
          'I레벨, 25% 확률로 광물 +1',
          'II레벨, 50% 확률로 광물 +1',
          'III레벨, 75% 확률로 광물 +1',
          'IV레벨, 100% 확률로 광물 +1',
        ],
      },
      {
        name: '유물 행운',
        levels: [
          'I레벨, 유물 획득 확률 1% 증가',
          'II레벨, 유물 획득 확률 3% 증가',
          'III레벨, 유물 획득 확률 5% 증가',
        ],
      },
      {
        name: '코비 탐색',
        levels: [
          'I레벨, 코비 소환 확률 1% 증가',
          'II레벨, 코비 소환 확률 3% 증가',
          'III레벨, 코비 소환 확률 5% 증가',
        ],
      },
      {
        name: '빠른 광부',
        levels: [
          'I레벨, 신속 I 부여',
          'II레벨, 신속 II 부여',
          'III레벨, 신속 III 부여',
        ],
      },
    ],
  },
  tide: {
    tool: '세이지 낚싯대',
    options: [
      {
        name: '물고기 행운',
        levels: [
          'I레벨, 25% 확률로 물고기 +1',
          'II레벨, 50% 확률로 물고기 +1',
          'III레벨, 75% 확률로 물고기 +1',
          'IV레벨, 100% 확률로 물고기 +1',
        ],
      },
      {
        name: '어획 강화',
        levels: [
          'I레벨, 수중 어획력 5% 증가',
          'II레벨, 수중 어획력 7% 증가',
          'III레벨, 수중 어획력 10% 증가',
        ],
      },
      {
        name: '조개 탐색',
        levels: [
          'I레벨, 조개 등장 확률 1% 증가',
          'II레벨, 조개 등장 확률 3% 증가',
          'III레벨, 조개 등장 확률 5% 증가',
        ],
      },
      {
        name: '어패 행운',
        levels: [
          'I레벨, 25% 확률로 어패류 +1',
          'II레벨, 50% 확률로 어패류 +1',
          'III레벨, 75% 확률로 어패류 +1',
          'IV레벨, 100% 확률로 어패류 +1',
        ],
      },
      {
        name: '수중 호흡',
        levels: ['수중 호흡 부여'],
      },
      {
        name: '빠른 어부',
        levels: [
          'I레벨, 신속 I 부여',
          'II레벨, 신속 II 부여',
          'III레벨, 신속 III 부여',
        ],
      },
    ],
  },
  conquest: {
    tool: '세이지 대검',
    options: [
      {
        name: '공격 강화',
        levels: [
          'I레벨, 공격력 5% 증가',
          'II레벨, 공격력 7% 증가',
          'III레벨, 공격력 10% 증가',
        ],
      },
      {
        name: '공격 가속',
        levels: [
          'I레벨, 공격 속도 8% 증가',
          'II레벨, 공격 속도 15% 증가',
          'III레벨, 공격 속도 25% 증가',
        ],
      },
      {
        name: '전리품 행운',
        levels: [
          'I레벨, 25% 확률로 전리품 +1',
          'II레벨, 50% 확률로 전리품 +1',
          'III레벨, 75% 확률로 전리품 +1',
          'IV레벨, 100% 확률로 전리품 +1',
        ],
      },
      {
        name: '조각 행운',
        levels: [
          'I레벨, 수상한 조각 획득 확률 1% 증가',
          'II레벨, 수상한 조각 획득 확률 3% 증가',
          'III레벨, 수상한 조각 획득 확률 5% 증가',
        ],
      },
      {
        name: '빠른 사냥꾼',
        levels: [
          'I레벨, 신속 I 부여',
          'II레벨, 신속 II 부여',
          'III레벨, 신속 III 부여',
        ],
      },
    ],
  },
}