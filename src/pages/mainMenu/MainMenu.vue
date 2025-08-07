<script setup lang="ts">
// 필요 시 기능 추가
import Header from "@/components/layout/header/Header.vue";
import MenuItem from "@/pages/mainMenu/_component/MenuItems.vue";
import MenuSection from "@/pages/mainMenu/_component/MenuSection.vue";
import Footer from "@/components/layout/Footer.vue";
import { authStore } from "@/stores/authStore";
import defaultProfile from "@/assets/imgs/profile.jpg";
import logo from "@/assets/imgs/logo.svg";

import { computed } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import ProfileInfo from "@/components/common/ProfileInfo.vue";
import ProfileImage from "@/components/common/ProfileImage.vue";
import movePage from "@/utils/movePage";

const auth = authStore();

const fileBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const profileImgUrl = computed(() => {
  const path = auth.member.profileImg;
  if (!path) return logo;
  return `${fileBaseUrl}${path}`;
});
console.log("profileImgUrl: ", profileImgUrl);



// 로그아웃
const logout = async () => {
  if (auth.logout) {
    await auth.logout();
  } else {
    console.error("logoutUser is undefined");
  }
};

function openInquiry() {
  alert("lighthouse@gmail.com 로 문의 주세요!");
}
</script>

<!-- MenuPage.vue 레이아웃 -->
<template>
  <Header :headerShowtype="mainRouteName.mainMenu">
    <!--Header 부분에 회원 정보가 크게 띄게 수정-->
    <div class="pl-3 pr-8 pt-8 pb-8">
      <div class="mt-[1.5rem] flex items-center justify-center text-center">
        <div class="flex-[1]">
          <ProfileImage
            :src="profileImgUrl || defaultProfile"
          />
        </div>
        <div class="flex-[3]">
          <ProfileInfo
            :name="auth.member.name || '안전한 거래의 시작,'"
            :email="auth.member.createdType === 0 ? 'Light House' : auth.member.email || ''"
          ></ProfileInfo>
        </div>
      </div>
    </div>
  </Header>

  <div class="p-4 space-y-6">
    <MenuSection title="계정">
      <MenuItem :icon="['far', 'user']" label="마이페이지" to="/mypage" />
      <MenuItem :icon="['fas', 'house']" label="실거래가 조회" to="/mapSearch" />
      <MenuItem :icon="['fas', 'shield-alt']" label="안심 정보" to="/safereport" />
      <MenuItem :icon="['far', 'heart']" label="관심 목록" to="/wishlist" />
      <MenuItem :icon="['far', 'file-lines']" label="최근 본 리포트" to="/recentSafeReport" />
    </MenuSection>

    <MenuSection title="설정">
      <MenuItem :icon="['fas', 'bell']" label="알림 설정" to="/mypage/setting" />
    </MenuSection>

    <MenuSection title="고객지원 및 안내">
      <div @click="openInquiry">
        <MenuItem :icon="['far', 'envelope']" label="서비스 문의하기" />
      </div>
    </MenuSection>
  </div>

  <div class="mt-8 flex justify-center gap-40 text-kb-gray-dark underline pb-6">
    <button
    class="underline cursor-pointer"
    @click="auth.isLoggedIn ? logout() : movePage.login()"
  >
    {{ auth.isLoggedIn ? '로그아웃' : '로그인' }}
  </button>
  </div>
  <Footer />
  <div class="h-15"></div>
</template>
