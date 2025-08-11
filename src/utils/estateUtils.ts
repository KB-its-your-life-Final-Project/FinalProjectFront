import { EstateSalesDTO } from "@/api/autoLoad/data-contracts";
import { estateTradeOptionsFinal } from "@/types/estateType";
import type { estateTradeFinalType } from "@/types/estateType";

const estateUtils = {
  checkFinaltype(estateSalesDTO: EstateSalesDTO): estateTradeFinalType[number] | undefined {
    const { tradeType, dealAmount, deposit, monthlyRent } = estateSalesDTO;

    // 매매
    if (tradeType === 1 && dealAmount && dealAmount > 0) {
      return estateTradeOptionsFinal.find((option) => option.value === tradeType);
    }

    // 월세
    else if (tradeType === 3 && deposit && deposit > 0) {
      return estateTradeOptionsFinal.find((option) => option.value === tradeType);
    }

    // 전세
    else if (tradeType === 2 && deposit && deposit > 0) {
      return estateTradeOptionsFinal.find((option) => option.value === tradeType);
    }
    return undefined;
  },

  formatAmount(amount: number): string {
    return amount.toLocaleString();
  },
};

export default estateUtils;
