import { EstateDTO, EstateSalesDTO } from "@/api/autoLoad/data-contracts";
import { estateTradeOptionsFinal, estateBuildingOptions } from "@/types/estateType";
import type { estateTradeFinalType, estateBuildingType } from "@/types/estateType";

const estateUtils = {
  checkFinaltype(estateSalesDTO: EstateSalesDTO): estateTradeFinalType[number] | undefined {
    const { tradeType, dealAmount, deposit, monthlyRent } = estateSalesDTO;

    // 매매
    if (tradeType === 1 && dealAmount && dealAmount > 0) {
      return estateTradeOptionsFinal.find((option) => option.value === 1);
    }

    // 월세
    else if (tradeType === 2 && monthlyRent && monthlyRent > 0) {
      const result = estateTradeOptionsFinal.find((option) => option.value === 3);
      return result;
    }

    // 전세
    else if (tradeType === 2 && deposit && deposit > 0) {
      return estateTradeOptionsFinal.find((option) => option.value === 2);
    }

    return undefined;
  },
  formatBuildingName(estateDTO: EstateDTO): string | null {
    if (estateDTO.buildingName) {
      // 한글이나 영문이 포함되어 있고, 숫자, 괄호, 하이픈도 허용
      if (
        /[가-힣a-zA-Z]/.test(estateDTO.buildingName) &&
        /^[가-힣a-zA-Z0-9\s\(\)\-]+$/.test(estateDTO.buildingName)
      ) {
        return estateDTO.buildingName;
      } else {
        return estateDTO.jibunAddr || null;
      }
    }

    return null;
  },
};

export default estateUtils;
