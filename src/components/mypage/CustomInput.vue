<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  label: string;
  oldData?: string;
  modelValue?: string;
  disabled?: boolean;
  type: string;
}>();
const inputValue = computed(() => {
  return props.disabled ? props.oldData : props.modelValue;
});
</script>

<template>
  <div class="relative input-block">
    <input
      class="w-full border-2 border-gray box-border rounded-xl px-3 py-2"
      :type="type"
      :disabled="disabled"
      :value="inputValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      required
    />
    <label
      class="absolute left-4 flex items-center top-1/2 -translate-y-1/2 transition-all duration-200 origin-top-left"
    >
      {{ label }}
    </label>
  </div>
</template>

<style scoped>
.input-block input:disabled + label,
.input-block input:valid + label,
.input-block input:focus + label {
  transform: scale(0.8) translateY(-20px);
  background: #fff;
}
</style>
