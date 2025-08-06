<script setup lang="ts">
import { computed } from "vue";
import { MarkerDataType } from "@/types/markerDataType";
import { EstateDTO, EstateSalesDTO } from "@/api/autoLoad/data-contracts";

const props = defineProps<{
  markerData: MarkerDataType;
  estateData: EstateDTO;
  estateSalesData: EstateSalesDTO[];
}>();

//표기
const address = computed(() => {
  if (props.estateData?.buildingName) {
    return props.estateData.buildingName;
  } else if (props.markerData?.jibunAddress) {
    return props.markerData.jibunAddress;
  } else {
    return props.markerData?.roadAddress;
  }
});

//금액
const dealAmount = computed(() => {
  // 배열의 첫 번째 요소에서 dealAmount 가져오기
  const amount = props.estateSalesData[0]?.dealAmount;

  if (amount == null) return "거래정보 없음";
  return `${amount}만원`;
});
</script>

<template>
  <div
    class="custom-marker relative flex flex-col bg-purple-500 br-2 border-2 border-purple-500 rounded-md w-[8rem] top-0"
  >
    <div class="flex bg-white">
      <div class="text-sm p-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[6rem]">
        {{ address }}
      </div>
    </div>

    <div class="flex">
      <div class="text-xl text-white p-1 deal-amount">{{ dealAmount }}</div>
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
