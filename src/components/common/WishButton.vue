<script lang="ts" setup>
import { Api } from "@/api/autoLoad/Api"; // 실제 경로에 맞게 수정
import type {
  RegionWishlistRequestDTO,
  EstateWishlistRequestDTO,
} from "@/api/autoLoad/data-contracts";
import { ref } from "vue";
const props = defineProps<{
  liked: boolean;
  targetType: "region" | "building";
  regionCd?: string;
  buildingId?: number;
}>();

const emit = defineEmits<{
  (e: "toggle", payload: { success: boolean; liked: boolean }): void;
}>();

const api = new Api();
const isLoading = ref(false);

const handleClick = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    if (props.targetType === "region" && props.regionCd) {
      const payload: RegionWishlistRequestDTO = { regionCd: props.regionCd };
      if (!props.liked) {
        await api.addWishlistUsingPost1(payload); // 지역 추가
      } else {
        await api.removeWishlistUsingDelete1(props.regionCd); // 지역 제거
      }
    } else if (props.targetType === "building" && props.buildingId != null) {
      const payload: EstateWishlistRequestDTO = { estateId: props.buildingId };
      if (!props.liked) {
        // await api.addWishlistUsingPost(payload); // 건물 추가
      } else {
        // await api.removeWishlistUsingDelete(props.buildingId); // 건물 제거
      }
    } else {
      throw new Error("잘못된 요청입니다. 필수 데이터가 없습니다.");
    }
    emit("toggle", { success: true, liked: !props.liked });
  } catch (e) {
    console.error("API 요청 실패:", e);
    emit("toggle", { success: false, liked: props.liked });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <font-awesome-icon
    :icon="[liked ? 'fas' : 'far', 'star']"
    class="cursor-pointer w-full h-full"
    :class="liked ? 'text-kb-yellow' : 'text-kb-ui-05'"
    @click.stop="handleClick"
  />
</template>
