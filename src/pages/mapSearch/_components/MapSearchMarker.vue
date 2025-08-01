<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  jibunAddress: string;
  roadAddress: string;
  latlng: naver.maps.LatLng;
}>();

//도로명 주소 우선
const address = computed(() => {
  return props.roadAddress || props.jibunAddress;
});

const data = {
  address: "00아파트",
  price: "14억원",
  width: "30평",
};
</script>

<template>
  <div
    class="custom-marker relative flex flex-col bg-purple-500 br-2 border-2 border-purple-500 rounded-md w-[5rem] bt-0"
  >
    <div class="flex bg-white">
      <div class="text-sm p-1">{{ address }}</div>
    </div>

    <div class="flex">
      <div class="text-xl text-white p-1">
        {{ data.price }}
      </div>
    </div>

    <div class="text-sm">{{ data.width }}</div>
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
