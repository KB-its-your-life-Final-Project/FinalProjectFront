<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const BuildingName = ref(props.formData.buildingName)

watch(BuildingName, val => {
  emit('update', { buildingName: val })
})
function search() {

}
function next(){
  emit('next')
}
</script>

<template>
  <div class="relative flex flex-col flex-1 px-6 gap-6">
    <div>
      <h1 class="text-2xl font-pretendard-bold mb-1">
        진단받고자 하는 곳이 어디인가요?
      </h1>
      <p class="text-kb-ui-05">
        건물명을 입력해주세요.
      </p>
    </div>

    <div class="relative w-full max-w-lg mx-auto">
      <!--  search bar -->
      <input
        v-model="BuildingName"
        type="text"
        placeholder="건물명 입력"
        class="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 focus:outline-none"
      />
      <button
        @click="search"
        :disabled="!BuildingName.trim()"
        class="absolute inset-y-0 right-3 flex items-center justify-center text-gray-600 disabled:opacity-50"
      >
        🔍
      </button>
    </div>

    <dib class="fixed z-10 inset-x-0 bottom-6 flex justify-end px-6 pb-24">
      <button
        @click="next"
        :disabled="!BuildingName.trim()"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 disabled:opacity-50"
      >
        다음
      </button>
    </dib>

  </div>

</template>

<style scoped>

</style>
