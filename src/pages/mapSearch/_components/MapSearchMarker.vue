<script setup lang="ts">
defineProps<{
  title?: string;
}>();

const data = {
  address: "00아파트",
  price: "14억원",
  width: "30평",
};
</script>

<template>
  <div class="relative flex flex-col bg-purple-500 br-2 border-2 border-purple-500 rounded-md">
    <div class="flex bg-white">
      <div class="text-sm p-1">{{ data.address }}</div>
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
.custom-marker {
  background: #4a90e2;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  cursor: pointer;
  position: relative;
}

.custom-marker::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #4a90e2;
}
</style>
