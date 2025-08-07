<script lang="ts" setup>
import { computed } from "vue";
import AmountDesc from "./AmountDesc.vue";
import movePage from "@/utils/movePage";
const props = defineProps<{
  building: {
    name?: string | undefined;
    type: number;
    jibunAddr: string;
    liked: boolean;
    estateId?: number;
    amount?: number;
    deposit?: number;
    monthlyRent?: number;
  };
}>();
const buildingImage = computed(() => {
  switch (props.building.type) {
    case 1:
      return "/src/assets/imgs/apartment.png";
    case 2:
      return "/src/assets/imgs/officetel.png";
    case 3:
      return "/src/assets/imgs/multihouse.png";
    case 4:
      return "/src/assets/imgs/singlehouse.png";
    default:
      return "/src/assets/imgs/anonymous_building.png";
  }
});
const isEmpty = computed(() => {
  return !props.building.amount && !props.building.deposit && !props.building.monthlyRent;
});

const handleClick = () => {
  if (props.building.jibunAddr) {
    movePage.transactionDetail({ jibunAddr: props.building.jibunAddr });
  } else {
    console.warn("확인할 주소값이 비어있습니다");
  }
};
</script>
<template>
  <div
    class="max-w-[180px] rounded-lg border border-gray-300 shadow-md cursor-pointer h-65"
    @click="handleClick"
  >
    <div class="relative bg-kb-ui-10 pb-1 rounded-t-lg">
      <img :src="buildingImage" class="pt-5 w-full h-35 object-contain" />
      <div class="absolute top-0 left-0 text-sm bg-kb-yellow p-1 rounded-tl-lg rounded-br-lg">
        {{ building.name || "건물명 없음" }}
      </div>
    </div>
    <div class="p-3">
      <div class="text-xs text-kb-ui-05 pb-1 h-8">{{ building.jibunAddr }}</div>
      <div class="mt-2 h-15">
        <div v-if="building.amount" class="w-full">
          <AmountDesc title="매매" :amount="building.amount"></AmountDesc>
        </div>
        <div v-if="building.monthlyRent" class="w-full">
          <AmountDesc
            title="월세"
            :amount="building.deposit"
            :rent="building.monthlyRent"
          ></AmountDesc>
        </div>
        <div v-if="!building.monthlyRent && building.deposit" class="w-full">
          <AmountDesc title="전세" :amount="building.deposit"></AmountDesc>
        </div>
        <div v-if="isEmpty">
          <div class="text-sm text-kb-ui-05">실거래 정보가 없습니다.</div>
        </div>
      </div>
    </div>
  </div>
</template>
