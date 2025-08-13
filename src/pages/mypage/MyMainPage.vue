<script setup lang="ts">
// layout 컴포넌트
import Header from "@/components/layout/header/Header.vue";
import Section from "@/components/nav/BottomNav.vue";

// 프로필 컴포넌트
import ProfileImage from "@/components/common/ProfileImage.vue";
import ProfileInfo from "@/components/common/ProfileInfo.vue";
import defaultProfile from "@/assets/imgs/profile.jpg";

// 마이 페이지 컴포넌트
import EditItem from "./_component/EditItem.vue";
import InfoCard from "./_component/InfoCard.vue";
import ChangeNameModal from "./_component/ChangeNameModal.vue";
import ChangePasswordModal from "./_component/ChangePasswordModal.vue";
import ChangeProfileModal from "./_component/ChangeProfileModal.vue";
import ChangeHouseModal from "./_component/ChangeHouseModal.vue";
import DeleteAcoountModal from "./_component/DeleteAcoountModal.vue";

import { markRaw, ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import movePage from "@/utils/movePage";
import { authStore } from "@/stores/authStore";
import { useHomeStore } from "@/stores/homeStore";

import { Api } from "@/api/autoLoad/Api";
import type { HomeRegisterResponseDTO } from "@/api/autoLoad/data-contracts";
import { formatAmount } from "@/utils/numberUtils";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

const api = new Api();
const auth = authStore();
const homeStore = useHomeStore();

const modalMap = {
  name: markRaw(ChangeNameModal),
  editHouse: markRaw(ChangeHouseModal),
  newHouse: markRaw(ChangeHouseModal),
  profile: markRaw(ChangeProfileModal),
  password: markRaw(ChangePasswordModal),
  delete: markRaw(DeleteAcoountModal),
};

type ModalMap = typeof modalMap;
type ModalNames = keyof ModalMap;

type ModalPropsMap = {
  name: {
    oldName: string;
  };
  editHouse: {
    type: "edit";
    address: string;
    contractDate: string;
    homeData: HomeRegisterResponseDTO;
  };
  profile: {
    profile: string;
    name: string;
  };
  // 빈 객체만 허용한다는 의미
  password: Record<string, never>;
  delete: Record<string, never>;
  newHouse: {
    type: "regist";
    address?: never;
    contractDate?: never;
  };
};

const drawerRef = ref<HTMLElement | null>(null);
const isOpenDrawer = ref(false);
const currentModalName = ref<null | ModalNames>(null);
const modalProps = ref<ModalPropsMap[ModalNames] | null>(null);
const fileBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const user = computed(() => ({
  name: auth.member.name ?? "사용자",
  email: auth.member.email ?? "이메일 없음",
  isRegistered: false,
  imagePath: auth.member.profileImg ? `${fileBaseUrl}${auth.member.profileImg}` : defaultProfile,
}));
const isPwdChangeable = computed(() => auth.member.createdType === 1); // 1: 이메일 계정
const isLoading = ref(false);
const homeData = ref<HomeRegisterResponseDTO | null>(null);
const isRegistered = ref(false);

function handleClickOutside(event: MouseEvent) {
  if (drawerRef.value && !drawerRef.value.contains(event.target as Node)) {
    isOpenDrawer.value = false;
  }
}

function openDrawer() {
  isOpenDrawer.value = !isOpenDrawer.value;
}
function openModal<T extends ModalNames>(type: T, props: ModalPropsMap[T]) {
  currentModalName.value = type;
  modalProps.value = props;

  // editHouse 모달을 열 때 homeStore에 기존 집 정보 미리 설정
  if (type === "editHouse" && "homeData" in props) {
    const homeData = props.homeData as HomeRegisterResponseDTO;

    // homeStore에 기존 집 정보 설정
    homeStore.loadHomeInfo(homeData);

    // 주소 정보도 함께 설정
    const addressInfo = {
      roadAddress: homeData.roadAddress || "",
      jibunAddress: homeData.jibunAddr || "",
      buildingName: homeData.buildingName || "",
      dongName: homeData.umdNm || "",
      buildingNumber: homeData.buildingNumber || "",
      umdNm: homeData.umdNm || "",
      jibunAddr: homeData.jibunAddr || "",
    };

    homeStore.updateAddressInfo(addressInfo);
  }
}
const handleModalClose = () => {
  const modalType = currentModalName.value;
  closeModal();
  // editHouse 모달이 닫힐 때는 서버에서 데이터를 다시 가져오지 않음
  // homeStore에 이미 업데이트된 정보가 있기 때문
  if (modalType === "newHouse") {
    fetchHomeData();
  }
  // editHouse의 경우 homeStore의 정보를 사용하므로 fetchHomeData 호출하지 않음
};

// 집 정보가 업데이트되었을 때 처리
const handleHomeUpdated = (updatedHomeData: HomeRegisterResponseDTO) => {
  // homeData를 새 객체로 교체하여 반응성 보장
  homeData.value = { ...updatedHomeData };
};
function closeModal() {
  currentModalName.value = null;
  modalProps.value = null;
}
function handleNameChanged(newName: string) {
  auth.member.name = newName;
}

const fetchHomeData = async () => {
  try {
    isLoading.value = true;
    const response = await api.getHomeInfoUsingGet();

    if (response.data?.data) {
      homeData.value = response.data.data;
      isRegistered.value = true;
    } else {
      homeData.value = null;
      isRegistered.value = false;
    }
  } catch (error: unknown) {
    console.error("로그인 여부 확인 중 오류: ", error);
    homeData.value = null;
    isRegistered.value = false;
  } finally {
    isLoading.value = false;
  }
};
// 기존 함수들 아래에 추가
const calculateRemainingDays = (contractEnd?: string) => {
  if (!contractEnd) return "종료일 정보 없음";

  const today = new Date();
  const endDate = new Date(contractEnd);
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays}일 남음`;
  } else if (diffDays === 0) {
    return "오늘 만료";
  } else {
    return `${Math.abs(diffDays)}일 지남`;
  }
};

const getRentTypeText = (rentType?: number) => {
  switch (rentType) {
    case 1:
      return "전세";
    case 2:
      return "월세";
    case 3:
      return "반전세";
    default:
      return "임대 유형";
  }
};

const formatRentAmount = (homeData: HomeRegisterResponseDTO) => {
  if (homeData.rentType === 1) {
    // jeonseAmount가 만원 단위로 저장되어 있다면 그대로 사용
    return `${formatAmount(homeData.jeonseAmount || 0) || "0만원"}`;
  } else if (homeData.rentType === 2) {
    // monthlyRent가 만원 단위로 저장되어 있다면 그대로 사용
    return `${formatAmount(homeData.monthlyRent || 0) || "0만원"}`;
  } else {
    return "금액 정보 없음";
  }
};

const getRentSubContent = (homeData: HomeRegisterResponseDTO) => {
  if (homeData.rentType === 1) {
    return "전세 계약";
  } else if (homeData.rentType === 2) {
    // monthlyDeposit이 만원 단위로 저장되어 있다면 그대로 사용
    return `보증금: ${formatAmount(homeData.monthlyDeposit || 0) || "0만원"}`;
  } else {
    return "계약 정보 없음";
  }
};

// homeStore의 정보를 사용하는 computed 속성 추가
const displayHomeData = computed(() => {
  // homeStore에 정보가 있으면 그것을 우선 사용, 없으면 서버 데이터 사용
  if (homeStore.hasHomeInfo && homeData.value) {
    return {
      ...homeData.value,
      buildingName: homeStore.homeInfo.addressInfo.buildingName || homeData.value.buildingName,
      buildingNumber:
        homeStore.homeInfo.addressInfo.buildingNumber || homeData.value.buildingNumber,
      umdNm: homeStore.homeInfo.addressInfo.umdNm || homeData.value.umdNm,
      jibunAddr: homeStore.homeInfo.addressInfo.jibunAddr || homeData.value.jibunAddr,
    };
  }
  return homeData.value;
});

// homeStore의 addressInfo 변경을 감지하여 UI 즉시 업데이트
watch(
  () => homeStore.homeInfo.addressInfo,
  () => {
    // computed 속성이 자동으로 재계산되어 UI가 업데이트됨
  },
  { deep: true },
);

// lifeCycle 훅
onMounted(() => {
  fetchHomeData();
  document.addEventListener("click", handleClickOutside); // 회원 수정 영역 밖 클릭 시 드로어 숨김을 위한 설정
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside); // 메모리 누수 방지
});
</script>

<template>
  <Header :headerShowtype="mainRouteName.myPage" class="h-25" />
  <div class="relative">
    <div class="absolute w-full h-2/5 bg-kb-yellow"></div>
    <div
      class="relative bg-white mx-4 p-4 rounded-xl shadow-md items-center space-x-4 flex flex-col gap-[1vh] z-2"
    >
      <div class="relative">
        <div class="w-25">
          <ProfileImage :src="user.imagePath" />
        </div>
        <button
          class="absolute bottom-0 right-0 cursor-pointer py-1 px-2 bg-kb-ui-08 rounded-full"
          @click="openModal('profile', { profile: user.imagePath, name: user.name })"
        >
          <font-awesome-icon :icon="['fas', 'camera']"></font-awesome-icon>
        </button>
      </div>
      <ProfileInfo :name="user.name" :email="user.email" />

      <div class="w-4/5 relative h-10 mt-3" ref="drawerRef">
        <div class="absolute w-full border border-kb-ui-07 rounded-lg">
          <button
            class="text-md font-pretendard-medium py-2 w-full font-bold cursor-pointer text-kb-ui-04 flex justify-center items-center gap-2"
            @click="openDrawer"
          >
            회원정보 수정
            <font-awesome-icon
              :icon="['fas', isOpenDrawer ? 'chevron-up' : 'chevron-down']"
              class="w-3 h-3"
            />
          </button>
          <!-- 드로어 영역 -->
          <div
            class="w-full overflow-hidden transition-[max-height] duration-300 ease-in-out"
            :style="{ maxHeight: isOpenDrawer ? '100vh' : '0' }"
          >
            <div class="px-7 pt-5 pb-8 bg-white rounded-md">
              <EditItem
                :title="'이름 변경'"
                :icon="['fas', 'user-pen']"
                @click="openModal('name', { oldName: user.name })"
              />
              <EditItem
                v-if="isPwdChangeable"
                :title="'비밀번호 변경'"
                :icon="['fas', 'key']"
                @click="openModal('password', {})"
              />
              <EditItem
                :title="'회원 탈퇴'"
                :icon="['fas', 'delete-left']"
                @click="openModal('delete', {})"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading" class="h-100 flex items-center justify-center">
    <LoadingSpinner
      size="h-8 w-8"
      borderColor="border-blue-600"
      marginBottom="mb-2"
      borderBottomOnly
    />
  </div>
  <div v-else-if="displayHomeData" class="overflow-y-auto pb-20">
    <!-- 등록된 집 정보 -->
    <h2 class="text-lg mx-4 mt-4">나의 집 정보</h2>
    <div class="mx-4 text-xs text-gray-400">
      {{ displayHomeData?.buildingName || "등록된 아파트" }}
    </div>
    <InfoCard
      :key="`building-${displayHomeData?.buildingName}-${displayHomeData?.buildingNumber}`"
      :title="'등록된 아파트'"
      :content="displayHomeData?.buildingName || '정보 없음'"
      :sub-content="
        displayHomeData?.buildingNumber ? `${displayHomeData.buildingNumber}` : '동 정보 없음'
      "
    />

    <!-- 계약 정보 -->
    <h2 class="text-lg mx-4 mt-4">계약 정보</h2>
    <div class="mx-4 text-xs text-gray-400">계약 기간</div>
    <InfoCard
      :key="`contract-${displayHomeData?.contractStart}-${displayHomeData?.contractEnd}`"
      :title="'계약 기간'"
      :content="`${displayHomeData?.contractStart || '시작일 없음'} ~ ${displayHomeData?.contractEnd || '종료일 없음'}`"
      :sub-content="calculateRemainingDays(displayHomeData?.contractEnd)"
    />

    <!-- 임대료 정보 -->
    <h2 class="text-lg mx-4 mt-4">임대료 정보</h2>
    <div class="mx-4 text-xs text-gray-400">계약 조건</div>
    <InfoCard
      :key="`rent-${displayHomeData?.rentType}-${displayHomeData?.jeonseAmount}-${displayHomeData?.monthlyRent}`"
      :title="getRentTypeText(displayHomeData?.rentType)"
      :content="displayHomeData ? formatRentAmount(displayHomeData) : '정보 없음'"
      :sub-content="displayHomeData ? getRentSubContent(displayHomeData) : '정보 없음'"
    />

    <!-- 나의 집 정보 수정하기 버튼 -->
    <div class="mx-4 mt-4">
      <button
        class="w-full py-3 bg-kb-yellow-positive text-white text-sm rounded-md shadow-inner cursor-pointer"
        @click="
          openModal('editHouse', {
            type: 'edit',
            address: displayHomeData?.buildingName || '',
            contractDate: displayHomeData?.contractStart || '',
            homeData: displayHomeData || homeData,
          })
        "
      >
        나의 집 정보 수정하기
      </button>
    </div>

    <!-- 알림 설정 버튼 -->
    <div class="mx-4 mt-4">
      <button
        class="w-full py-3 bg-gray-200 text-sm rounded-md shadow-inner cursor-pointer"
        @click="movePage.mypageStetting()"
      >
        알림 설정
      </button>
    </div>
  </div>
  <div v-else class="h-100 flex flex-col items-center justify-center">
    <div class="font-pretendard-bold text-xl">나의 집을 등록하고 정보를 받아보세요!</div>
    <button
      class="mt-10 text-md cursor-pointer bg-kb-yellow-positive text-white px-10 py-3 rounded-md"
      @click="openModal('newHouse', { type: 'regist' })"
    >
      나의 집 등록하기
    </button>
  </div>

  <!-- 알림 설정 버튼 (하단 고정) - 집 정보가 없을 때만 표시 -->
  <div v-if="!homeData" class="fixed bottom-20 left-4 right-4 z-10">
    <button
      class="w-full py-3 bg-kb-ui-09 text-md rounded-md shadow-inner cursor-pointer"
      @click="movePage.mypageStetting()"
    >
      알림 설정
    </button>
  </div>
  <Section />

  <component
    :is="currentModalName ? modalMap[currentModalName] : null"
    v-bind="modalProps"
    @nameChanged="handleNameChanged"
    @home-updated="handleHomeUpdated"
    @close="handleModalClose"
  ></component>
</template>
