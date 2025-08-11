<script lang="ts" setup>
import { Api } from "@/api/autoLoad/Api";
import type {
  RegionWishlistRequestDTO,
  EstateWishlistRequestDTO,
} from "@/api/autoLoad/data-contracts";
import { ref, onMounted } from "vue";
import { useToast } from "@/utils/useToast";
import { authStore } from "@/stores/authStore";
const props = withDefaults(
  defineProps<{
    name?: string;
    liked?: boolean;
    targetType: "region" | "building";
    regionCd?: string;
    jibunAddr?: string;
  }>(),
  {
    liked: undefined, // 기본값을 undefined로 설정
  },
);

const api = new Api();
const isLoading = ref(false);
const liked = ref<boolean | undefined>(props.liked);
const toast = useToast();
const auth = authStore();
const handleClick = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    try {
      await auth.checkLoginStatus();
    } catch {
      toast.addToast(toast.createToast("로그인 시에만 사용할 수 있습니다", "info"));
      return;
    }
    if (props.targetType === "region" && props.regionCd) {
      const payload: RegionWishlistRequestDTO = { regionCd: props.regionCd };
      if (!liked.value) {
        await api.addWishlistUsingPost1(payload); // 지역 추가
        toast.addToast(toast.createToast(`${props.name || "지역"}: 관심 목록 등록`, "success"));
      } else {
        await api.removeWishlistUsingDelete1(props.regionCd); // 지역 제거
        toast.addToast(toast.createToast(`${props.name || "지역"} : 관심 목록 해제`, "success"));
      }
      liked.value = !liked.value;
    } else if (props.targetType === "building" && props.jibunAddr != null) {
      const payload: EstateWishlistRequestDTO = {
        jibunAddr: props.jibunAddr,
      };
      if (!liked.value) {
        await api.addWishlistUsingPost(payload); // 건물 추가
        toast.addToast(toast.createToast(`${props.name || "매물"}: 관심 목록 등록`, "success"));
      } else {
        await api.removeWishlistUsingDelete({ jibunAddr: props.jibunAddr }); // 건물 제거
        toast.addToast(toast.createToast(`${props.name || "매물"}: 관심 목록 해제`, "success"));
      }
      liked.value = !liked.value;
    } else {
      console.error("잘못된 요청입니다. 필수 데이터가 없습니다.");
    }
  } catch (e) {
    console.error("API 요청 실패:", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  // props로 liked가 넘어오지 않았을 때만 API 호출
  if (liked.value === undefined) {
    try {
      if (props.targetType === "region" && props.regionCd) {
        const response = await api.existWishlistByRegionCdUsingGet(props.regionCd);
        const data = response.data.data;
        liked.value = data;
      } else if (props.targetType === "building" && props.jibunAddr) {
        const response = await api.existWishlistByJibunAddrUsingGet({
          jibunAddr: props.jibunAddr,
        });
        const data = response.data.data;
        liked.value = data;
      }
    } catch (e) {
      console.error("초기 liked 상태를 가져오는 데 실패:", e);
      liked.value = false;
    }
  }
});
</script>

<template>
  <font-awesome-icon
    :icon="[liked ? 'fas' : 'far', 'star']"
    class="cursor-pointer w-full h-full"
    :class="liked ? 'text-kb-yellow' : 'text-kb-ui-05'"
    @click.stop="handleClick"
  />
</template>
