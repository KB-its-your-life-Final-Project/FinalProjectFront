<script setup lang="ts">
import { ref } from "vue";
import ModalForm from "@/components/common/ModalForm.vue";
const props = defineProps<{
  profile: string;
  name: string;
}>();
const emit = defineEmits(["close"]);

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>("");
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}
function handleConfirm(): { success: boolean; message: string } {
  if (!selectedFile.value) {
    return { success: false, message: "이미지를 선택해주세요." };
  }
  /** todo: 실제 프로필 화면 변경 로직이 구성되어야 함. */
  const tmpRepository = "/Users/cheonkio/upload/avatar";
  const newFileName = `${props.name}_profile.jpg`;
  const renamedFile = new File([selectedFile.value], newFileName, {
    type: selectedFile.value.type,
  });
  console.log(renamedFile.name, "이 ", tmpRepository, "에 저장되었습니다");
  return { success: true, message: "프로필이 변경되었습니다" };
}
</script>
<template>
  <ModalForm :title="'프로필 이미지 변경'" :handle-confirm="handleConfirm" @close="emit('close')">
    <div class="flex flex-col items-center gap-2">
      <img class="rounded-full max-w-1/2 aspect-1/1" :src="previewUrl || profile" />
      <p v-if="selectedFile" class="text-sm text-gray-600">선택한 파일: {{ selectedFile?.name }}</p>
      <label for="profileFile" class="cursor-pointer px-3 py-1 border rounded-xl"
        >이미지 가져오기</label
      >
      <input
        id="profileFile"
        class="hidden"
        type="file"
        accept="image/*"
        @change="handleFileChange"
      />
    </div>
  </ModalForm>
</template>
