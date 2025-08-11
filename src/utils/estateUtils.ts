import { EstateSalesDTO } from "@/api/autoLoad/data-contracts"


const estateUtils = {
  checkFinaltype (estateSalesDTO: EstateSalesDTO): {
    if()

      if (tradeType === 1 && dealAmount && dealAmount > 0) {
        return `${estateTradeOptionsFinal[1].label}: ${formatAmount(dealAmount)}`;
      }

      else if (tradeType === 2 && deposit && deposit > 0) {
        return `전세: ${formatAmount(deposit)}`;
      }

      // 월세 (tradeType: 3)
      if (tradeType === 3 && deposit && deposit > 0) {
        const rentText = monthlyRent && monthlyRent > 0 ? `/${formatAmount(monthlyRent)}` : "";
        return `월세: ${formatAmount(deposit)}${rentText}`;
      }
  }
}
