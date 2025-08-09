<script setup lang="ts">
// layout 컴포넌트
import Header from "@/components/layout/header/Header.vue";
import Section from "@/components/nav/BottomNav.vue";

// 마이 페이지 컴포넌트
import EditItem from "./_component/EditItem.vue";
import InfoCard from "./_component/InfoCard.vue";
import ChangeNameModal from "./_component/ChangeNameModal.vue";
import ChangePasswordModal from "./_component/ChangePasswordModal.vue";
import ChangeProfileModal from "./_component/ChangeProfileModal.vue";
import ChangeHouseModal from "./_component/ChangeHouseModal.vue";
import DeleteAcoountModal from "./_component/DeleteAcoountModal.vue";

import { markRaw, ref, computed, onMounted } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import movePage from "@/utils/movePage";
import { authStore } from "@/stores/authStore";

import defaultProfile from "@/assets/imgs/profile.jpg";
import ProfileImage from "@/components/common/ProfileImage.vue";
import ProfileInfo from "@/components/common/ProfileInfo.vue";
import { Api } from "@/api/autoLoad/Api";
import type { HomeRegisterResponseDTO } from "@/api/autoLoad/data-contracts";

const api = new Api();
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

const fileBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const isOpenDrawer = ref(false);
const currentModalName = ref<null | ModalNames>(null);
const modalProps = ref<ModalPropsMap[ModalNames] | null>(null);
const isPwdChangeable = computed(() => auth.member.createdType === 1); // 1: 이메일 계정

const auth = authStore();
const user = computed(() => ({
  name: auth.member.name ?? "사용자",
  email: auth.member.email ?? "이메일 없음",
  isRegistered: false,
  imagePath: auth.member.profileImg ? `${fileBaseUrl}${auth.member.profileImg}` : defaultProfile,
}));

const isLoading = ref(false);
const homeData = ref<HomeRegisterResponseDTO | null>(null);
const isRegistered = ref(false);

function openDrawer() {
  isOpenDrawer.value = !isOpenDrawer.value;
}
function openModal<T extends ModalNames>(type: T, props: ModalPropsMap[T]) {
  currentModalName.value = type;
  modalProps.value = props;
}
const handleModalClose = () => {
  const modalType = currentModalName.value;
  closeModal();
  if (modalType === "newHouse" || modalType === "editHouse") {
    fetchHomeData();
  }
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
    const response = await api.getHomeInfoUsingGet("");

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
    return `${homeData.jeonseAmount || 0}만원`;
  } else if (homeData.rentType === 2) {
    return `${homeData.monthlyRent || 0}만원`;
  } else {
    return "금액 정보 없음";
  }
};

const getRentSubContent = (homeData: HomeRegisterResponseDTO) => {
  if (homeData.rentType === 1) {
    return "전세 계약";
  } else if (homeData.rentType === 2) {
    return `보증금: ${homeData.monthlyDeposit || 0}만원`;
  } else {
    return "계약 정보 없음";
  }
};

onMounted(() => {
  fetchHomeData();
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

      <div class="w-4/5 relative h-10 mt-3">
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
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
  <div v-else-if="homeData" class="overflow-y-auto pb-20">
    <!-- 등록된 집 정보 -->
    <h2 class="text-lg mx-4 mt-4">나의 집 정보</h2>
    <div class="mx-4 text-xs text-gray-400">{{ homeData.buildingName || "등록된 아파트" }}</div>
    <InfoCard
      :title="'등록된 아파트'"
      :content="homeData.buildingName || '정보 없음'"
      :sub-content="homeData.buildingNumber ? `${homeData.buildingNumber}` : '동 정보 없음'"
    />

    <!-- 계약 정보 -->
    <h2 class="text-lg mx-4 mt-4">계약 정보</h2>
    <div class="mx-4 text-xs text-gray-400">계약 기간</div>
    <InfoCard
      :title="'계약 기간'"
      :content="`${homeData.contractStart || '시작일 없음'} ~ ${homeData.contractEnd || '종료일 없음'}`"
      :sub-content="calculateRemainingDays(homeData.contractEnd)"
    />

    <!-- 임대료 정보 -->
    <h2 class="text-lg mx-4 mt-4">임대료 정보</h2>
    <div class="mx-4 text-xs text-gray-400">계약 조건</div>
    <InfoCard
      :title="getRentTypeText(homeData.rentType)"
      :content="formatRentAmount(homeData)"
      :sub-content="getRentSubContent(homeData)"
    />

    <!-- 나의 집 정보 수정하기 버튼 -->
    <div class="mx-4 mt-4">
      <button
        class="w-full py-3 bg-kb-yellow-positive text-white text-sm rounded-md shadow-inner cursor-pointer"
        @click="
          openModal('editHouse', {
            type: 'edit',
            address: homeData.buildingName || '',
            contractDate: homeData.contractStart || '',
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
    @close="handleModalClose"
  ></component>
</template>
