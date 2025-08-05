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

import ToastList from "@/components/common/ToastList.vue";

import { markRaw, ref, computed, onMounted } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import movePage from "@/utils/movePage";
import { authStore } from "@/stores/authStore";

import defaultProfile from "@/assets/imgs/profile.jpg";
import ProfileImage from "@/components/common/ProfileImage.vue";
import ProfileInfo from "@/components/common/ProfileInfo.vue";

import { Api } from "@/api/autoLoad/Api";

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
const isOpenDrawer = ref(false);
const currentModalName = ref<null | ModalNames>(null);
const modalProps = ref<ModalPropsMap[ModalNames] | null>(null);
const isPwdChangeable = computed(() => auth.member.createdType === 1); // 1: 이메일 계정

const auth = authStore();
const user = computed(() => ({
  name: auth.member.name ?? "사용자",
  email: auth.member.email ?? "이메일 없음",
  isRegistered: false,
  imagePath: auth.member.profileImg || defaultProfile,
}));

function openDrawer() {
  isOpenDrawer.value = !isOpenDrawer.value;
}
function openModal<T extends ModalNames>(type: T, props: ModalPropsMap[T]) {
  currentModalName.value = type;
  modalProps.value = props;
}
function closeModal() {
  currentModalName.value = null;
  modalProps.value = null;
}
function handleNameChanged(newName: string) {
  auth.member.name = newName;
}

onMounted(async () => {
  try {
    const { data } = await api.checkLoginStatusUsingGet();
    if (data.success && data.data) {
      console.log("member: ", data);
      auth.setMember(data.data);
    }
  } catch (error: unknown) {
    console.error("로그인 여부 확인 중 오류: ", error);
  }
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
          <ProfileImage :src="auth.member.profileImg || defaultProfile" />
        </div>
        <button
          class="absolute bottom-0 right-0 cursor-pointer p-1 bg-gray-300 rounded-full"
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
                :title="'나의 집 정보 수정'"
                :icon="['fas', 'house']"
                @click="
                  openModal('editHouse', {
                    type: 'edit',
                    address: '테스트용 주소',
                    contractDate: '2025-01-01',
                  })
                "
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

  <div v-if="user.isRegistered" class="h-100">
    <h2 class="text-lg mx-4 mt-4">계약 만료 정보</h2>
    <div class="mx-4 text-xs text-gray-400">다음 만료일까지</div>
    <InfoCard :title="'계약 만료일'" :content="'2024-08-15'" :sub-content="'5일 남음'" />
    <h2 class="text-lg mx-4 mt-4">시세 변화</h2>
    <div class="mx-4 text-xs text-gray-400">시장 시세 업데이트</div>
    <InfoCard :title="'시세 변화'" :content="'₩300,000,000'" :sub-content="'+5% (지난주 대비)'" />
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
  <div class="mx-4 mt-4">
    <button
      class="w-full py-3 bg-kb-ui-09 text-md rounded-md shadow-inner cursor-pointer"
      @click="movePage.mypageStetting()"
    >
      알림 설정
    </button>
  </div>
  <ToastList />
  <Section />

  <component
    :is="currentModalName ? modalMap[currentModalName] : null"
    v-bind="modalProps"
    @close="closeModal"
    @nameChanged="handleNameChanged"
  ></component>
</template>
