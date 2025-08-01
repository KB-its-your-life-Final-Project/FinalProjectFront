<script setup lang="ts">
import { ref } from "vue";
import ModalForm from "@/components/common/ModalForm.vue";
import DefaultInput from "@/components/common/DefaultInput.vue";
import { isEmpty } from "@/utils/validate";
const props = defineProps<{
  oldName: string;
}>();

const emit = defineEmits(["close"]);
const oldNameRef = ref(props.oldName);
const newName = ref("");
function handleConfirm(): { success: boolean; message: string } {
  if (isEmpty(newName.value)) {
    return { success: false, message: "변경할 이름을 입력해 주세요" };
  }
  /** todo: 변경 요청 api 호출 */
  return { success: true, message: "이름이 변경되었습니다" };
}
</script>
<template>
  <ModalForm
    :title="'이름 변경'"
    :handle-confirm="handleConfirm"
    @close="emit('close')"
    hasConfirmBtn
  >
    <DefaultInput label="기존 이름" v-model="oldNameRef" type="text" disabled />
    <DefaultInput
      class="mt-5"
      label="변경 이름"
      placeholder="변경할 이름을 입력해주세요"
      v-model="newName"
      type="text"
    ></DefaultInput>
  </ModalForm>
</template>
