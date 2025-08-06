<script setup lang="ts">
import { ref } from "vue";
import ModalForm from "@/components/common/ModalForm.vue";
import { Api } from "@/api/autoLoad/Api";
import type { ChangeRequestDTO } from "@/api/autoLoad/data-contracts";
import { useToast } from "@/utils/useToast";
import { authStore } from "@/stores/authStore";

// 상태
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>("");

// Props & Emit
const props = defineProps<{
  profile: string;
  name: string;
}>();
const emit = defineEmits(["close"]);

// API
const api = new Api();

const auth = authStore();

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

async function handleConfirm(): Promise<{ success: boolean; message: string }> {
  if (!selectedFile.value) {
    return { success: false, message: "이미지를 선택하세요" };
  }
  const formData = new FormData();
  formData.append("file", selectedFile.value);
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  try {
    const { data } = await api.uploadProfileImageUsingPost(formData);
    console.log("data: ", data);
    return { success: true, message: "프로필이 변경되었습니다" };
  } catch (error: unknown) {
    console.error("업로드 실패", error);
    return { success: false, message: "업로드 중 오류가 발생했습니다" };
  }
}
</script>
<template>
  <ModalForm
    :title="'프로필 이미지 변경'"
    :handle-confirm="handleConfirm"
    @close="emit('close')"
    hasConfirmBtn
  >
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
