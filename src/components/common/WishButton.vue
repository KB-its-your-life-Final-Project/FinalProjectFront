<script lang="ts" setup>
/**
 * 관심 목록 Star 컴포넌트
 * 1. targetType: "region" | "building" – 관심 목록 대상 지정
 * 2. regionCd / jibunAddr: 관심 대상 ID 지정 (필수)
 * 3. liked: 초기 상태 지정 (선택, 없으면 API 호출로 가져옴)
 * 4. 클릭 시 로그인 여부 확인 후 관심 목록 등록/해제, toast 알림 표시
 * 5. font-awesome star 아이콘 사용, 색상은 liked 상태에 따라 변경
 */
import { ref, onMounted } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type {
  RegionWishlistRequestDTO,
  EstateWishlistRequestDTO,
} from "@/api/autoLoad/data-contracts";
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
  { liked: undefined },
);

const api = new Api();
const isLoading = ref(false);
const liked = ref<boolean | undefined>(props.liked);
const toast = useToast();
const auth = authStore();

/** API 호출 통합 함수 */
const toggleWishlist = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    // 로그인 체크
    try {
      await auth.checkLoginStatus();
    } catch {
      toast.addToast(toast.createToast("로그인 시에만 사용할 수 있습니다", "info"));
      return;
    }

    if (props.targetType === "region" && props.regionCd) {
      await handleRegionWishlist(props.regionCd, props.name || "지역");
    } else if (props.targetType === "building" && props.jibunAddr) {
      await handleBuildingWishlist(props.jibunAddr, props.name || "매물");
    } else {
      console.error("잘못된 요청입니다. 필수 데이터가 없습니다.");
    }
  } catch (e) {
    console.error("API 요청 실패:", e);
  } finally {
    isLoading.value = false;
  }
};

/** 지역 관심 등록/해제 */
const handleRegionWishlist = async (regionCd: string, targetName: string) => {
  const payload: RegionWishlistRequestDTO = { regionCd };
  if (!liked.value) {
    await api.addWishlistUsingPost1(payload);
    toast.addToast(toast.createToast(`${targetName}: 관심 목록 등록`, "success"));
  } else {
    await api.removeWishlistUsingDelete1(regionCd);
    toast.addToast(toast.createToast(`${targetName}: 관심 목록 해제`, "success"));
  }
  liked.value = !liked.value;
};

/** 건물 관심 등록/해제 */
const handleBuildingWishlist = async (jibunAddr: string, targetName: string) => {
  const payload: EstateWishlistRequestDTO = { jibunAddr };
  if (!liked.value) {
    await api.addWishlistUsingPost(payload);
    toast.addToast(toast.createToast(`${targetName}: 관심 목록 등록`, "success"));
  } else {
    await api.removeWishlistUsingDelete({ jibunAddr });
    toast.addToast(toast.createToast(`${targetName}: 관심 목록 해제`, "success"));
  }
  liked.value = !liked.value;
};

/** 초기 liked 조회 */
onMounted(async () => {
  if (liked.value === undefined) {
    try {
      if (props.targetType === "region" && props.regionCd) {
        const res = await api.existWishlistByRegionCdUsingGet(props.regionCd);
        liked.value = res.data.data;
      } else if (props.targetType === "building" && props.jibunAddr) {
        const res = await api.existWishlistByJibunAddrUsingGet({ jibunAddr: props.jibunAddr });
        liked.value = res.data.data;
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
    @click.stop="toggleWishlist"
  />
</template>
