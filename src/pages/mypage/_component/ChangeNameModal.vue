<script setup lang="ts">
import { ref, computed } from "vue";
import ModalForm from "@/components/common/ModalForm.vue";
import DefaultInput from "@/components/common/DefaultInput.vue";
import { Api } from "@/api/autoLoad/Api";
import { authStore } from "@/stores/authStore";
import { isEmpty, isValidName } from "@/utils/validate";

// 상태
const oldName = computed(() => props.oldName); // readonly
const newName = ref("");

// Props & Emit
const props = defineProps<{
  oldName: string;
}>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "nameChanged", newName: string): void;
}>();

// API
const api = new Api();

const auth = authStore();

async function handleConfirm(): Promise<{ success: boolean; message: string }> {
  const nameToChange = newName.value.trim();
  if (isEmpty(newName.value)) {
    return { success: false, message: "변경할 이름을 입력하세요" };
  }
  if (!isValidName(newName.value)) {
    return { success: false, message: "올바른 형식의 이름을 입력하세요" };
  }
  if (nameToChange === oldName.value) {
    return { success: false, message: "기존 이름과 동일합니다" };
  }

  const changeRequestDto: ChangeRequestDTO = {
    name: nameToChange,
    pwd: "",
    changeType: 1, // 1: name, 2: pwd
  };
  console.log("changeRequestDto: ", changeRequestDto);

  try {
    const { data } = await api.changeMemberInfoUsingPut(changeRequestDto);
    console.log("data: ", data);
    auth.member.name = newName.value;
    console.log("auth.member: ", auth.member);
    emit("nameChanged", newName.value); // 부모에게 변경된 이름 전달
    emit("close");
    return { success: true, message: "이름이 변경되었습니다" };
  } catch (error: unknown) {
    console.error("이름 변경 실패: ", error);
    return { success: false, message: "이름 변경에 실패했습니다" };
  }
}
</script>

<template>
  <ModalForm
    :title="'이름 변경'"
    :handle-confirm="handleConfirm"
    @close="emit('close')"
    hasConfirmBtn
  >
    <DefaultInput label="기존 이름" :model-value="oldName" type="text" disabled />
    <DefaultInput
      class="mt-5"
      label="변경 이름"
      placeholder="변경할 이름을 입력하세요"
      v-model="newName"
      type="text"
    ></DefaultInput>
  </ModalForm>
</template>
