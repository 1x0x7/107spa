export type FeeType = 'shop' | 'transfer' | 'bank';

export interface FeeResult {
  inputAmount: number;
  feeRate: number;
  feeAmount: number;
  resultAmount: number;
}

export const FEE_INFO: Record<FeeType, { name: string; rate: number; description: string; useCase: string }> = {
  shop: {
    name: '유저상점/플리마켓',
    rate: 5,
    description: '판매자가 수수료 부담',
    useCase: '판매자가 실제 수익을 확인할 때',
  },
  transfer: {
    name: '송금',
    rate: 5,
    description: '송금자가 수수료 부담',
    useCase: '구매자가 실제 지불 금액을 확인할 때',
  },
  bank: {
    name: '은행',
    rate: 5,
    description: '입금자가 수수료 부담',
    useCase: '입금 후 실제 저장되는 금액을 확인할 때',
  },
};

export const calculateFee = (amount: number, type: FeeType): FeeResult => {
  const info = FEE_INFO[type];
  const feeRate = info.rate;
  const feeAmount = Math.floor(amount * (feeRate / 100));
  
  if (type === 'transfer') {
    // 송금: 추가 부담
    return {
      inputAmount: amount,
      feeRate,
      feeAmount,
      resultAmount: amount + feeAmount,
    };
  } else {
    // 나머지: 차감
    return {
      inputAmount: amount,
      feeRate,
      feeAmount,
      resultAmount: amount - feeAmount,
    };
  }
};