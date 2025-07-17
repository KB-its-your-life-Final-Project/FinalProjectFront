<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const localName = ref(props.formData.buildingName)
watch(localName, val => {
  emit('update', { buildingName: val })
})
function search() {
  emit('next')
}
</script>

<template>
  <div class="flex-1 flex items-center px-4">
    <input
      v-model="localName"
      type="text"
      placeholder="건물명 입력"
      class="flex-1 border rounded-l-full px-4 py-2 focus:outline-none"
    />
    <button
      @click="search"
      :disabled="!localName.trim()"
      class="bg-yellow-500 px-4 rounded-r-full text-white"
    >
      🔍
    </button>
  </div>
</template>

<style scoped>

</style>
