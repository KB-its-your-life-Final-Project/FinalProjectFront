<script setup lang="ts">
import { computed } from "vue";
import { MarkerDataType } from "@/types/markerDataType";
import { EstateDTO, EstateSalesDTO } from "@/api/autoLoad/data-contracts";
import { formatAmount } from "@/utils/numberUtils";
import estateUtils from "@/utils/estateUtils";

const props = defineProps<{
  markerData: MarkerDataType;
  estateDTO?: EstateDTO;
  estateSalesDTO?: EstateSalesDTO[];
}>();

//표기
const address = computed(() => {
  if (props.markerData.buildingName) {
    if (props.estateDTO) {
      return estateUtils.formatBuildingName(props.estateDTO);
    } else {
      return props.markerData.buildingName;
    }
  } else if (props.estateDTO?.buildingName) {
    return props.estateDTO.buildingName;
  } else if (props.markerData?.jibunAddress) {
    return props.markerData.jibunAddress;
  } else {
    return props.markerData?.roadAddress;
  }
});

//금액 - 매매/전월세 구분 + 억원 단위 변환
const estateSales = computed(() => {
  const saleData = props.estateSalesDTO?.[0];
  if (!saleData) return "거래정보 없음";

  const tradeOption = estateUtils.checkFinaltype(saleData);
  if (!tradeOption) return "거래정보 없음";

  const { dealAmount, deposit, monthlyRent } = saleData;

  const estateFinalType = estateUtils.checkFinaltype(saleData);

  if (estateFinalType?.value == 1) {
    return `${estateFinalType?.label}: ${formatAmount(dealAmount)}`;
  } else if (estateFinalType?.value == 2) {
    return `${estateFinalType?.label}: ${formatAmount(deposit)}`;
  } else if (estateFinalType?.value == 3) {
    return `보증금: ${formatAmount(deposit)} \n ${estateFinalType?.label}: ${formatAmount(monthlyRent)}`;
  }

  return "거래정보 없음";
});
</script>

<template>
  <div
    class="custom-marker relative flex flex-col bg-purple-400 br-2 border-2 border-purple-500 rounded-md w-[9rem] shadow-sm"
  >
    <div class="flex bg-white">
      <div class="text-xs p-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[6rem]">
        {{ address }}
      </div>
    </div>

    <div class="flex">
      <div class="text-sm text-white p-1 deal-amount">{{ estateSales }}</div>
    </div>
  </div>
</template>

<style scoped>
.deal-amount {
  white-space: pre-line;
}

/* 위치조정 */
.custom-marker {
  bottom: 60px;
  right: 30px;
}

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
