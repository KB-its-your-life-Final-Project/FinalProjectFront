<script setup lang="ts">
import { computed } from "vue";
import { MarkerDataType } from "@/types/markerDataType";
import { EstateDTO, EstateSalesDTO } from "@/api/autoLoad/data-contracts";
import { formatAmount } from "@/utils/numberUtils";

const props = defineProps<{
  markerData: MarkerDataType;
  estateData?: EstateDTO;
  estateSalesData?: EstateSalesDTO[];
}>();

//표기
const address = computed(() => {
  if (props.markerData.buildingName) {
    return props.markerData.buildingName;
  } else if (props.estateData?.buildingName) {
    return props.estateData.buildingName;
  } else if (props.markerData?.jibunAddress) {
    return props.markerData.jibunAddress;
  } else {
    return props.markerData?.roadAddress;
  }
});

//금액 - 매매/전월세 구분 + 억원 단위 변환
const dealAmount = computed(() => {
  const saleData = props.estateSalesData?.[0];
  if (!saleData) return "거래정보 없음";

  const { dealAmount, deposit, monthlyRent, tradeType } = saleData;

  // 매매 (tradeType: 1)
  if (tradeType === 1 && dealAmount && dealAmount > 0) {
    return `매매: ${formatAmount(dealAmount)}`;
  }

  // 전세 (tradeType: 2)
  if (tradeType === 2 && deposit && deposit > 0) {
    return `전세: ${formatAmount(deposit)}`;
  }

  // 월세 (tradeType: 3)
  if (tradeType === 3 && deposit && deposit > 0) {
    const rentText = monthlyRent && monthlyRent > 0 ? `/${formatAmount(monthlyRent)}` : "";
    return `월세: ${formatAmount(deposit)}${rentText}`;
  }

  return "거래정보 없음";
});
</script>

<template>
  <div
    class="custom-marker relative flex flex-col bg-purple-400 br-2 border-2 border-purple-500 rounded-md w-[8rem] top-0 shadow-sm"
  >
    <div class="flex bg-white">
      <div class="text-xs p-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[6rem]">
        {{ address }}
      </div>
    </div>

    <div class="flex">
      <div class="text-sm text-white p-1 deal-amount">{{ dealAmount }}</div>
    </div>
  </div>
</template>

<style scoped>
.custom-marker::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 20%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid var(--color-purple-500);
}
</style>
