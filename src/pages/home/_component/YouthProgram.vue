<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { YouthContentDTO } from "@/api/autoLoad/data-contracts";
import { Api } from "@/api/autoLoad/Api";

const api = new Api();
const youthProgramList = ref<YouthContentDTO[]>([]);
const allowedPstSeNm = ["취업지원", "직업훈련", "대외활동"]; // 프로그램 관련 게시물 유형

const getYouthPrograms = async (): Promise<void> => {
  try {
    const { data } = await api.getNewsUsingGet();

    youthProgramList.value = data.data
      .filter((item: YouthContentDTO) => {
        const isAllowedType = allowedPstSeNm.includes(item.pstSeNm);
        const hrefMatch = item.pstWholCn?.match(/href="([^"]+)"/);
        const hasHref = hrefMatch !== null;
        return isAllowedType && hasHref;
      })
      .map((item: YouthContentDTO) => {
        const hrefMatch = item.pstWholCn?.match(/href="([^"]+)"/);
        const hrefUrl = hrefMatch ? hrefMatch[1] : "";

        return {
          ...item,
          hrefUrl, // 하나의 링크만 추출해서 할당
        };
      });
    console.log("data: ", youthProgramList.value);
  } catch (error) {
    console.error("청년 프로그램을 가져오는 중 오류 발생:", error);
  }
};

onMounted(() => {
  getYouthPrograms();
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center mt-6 h-[17rem]">
    <div class="flex justify-center mb-4">
      <div class="flex flex-row items-center text-base gap-2">
        <h1 class="w-13">
          <img class="w-full" src="@/assets/imgs/youth_logo.svg" alt="온통청년 로고" />
        </h1>
        <h2 class="flex items-center text-base font-semibold gap-x-2">
          <span class="text-kb-ui-06 text-sm">제공</span>
          <span>청년 프로그램</span>
        </h2>
      </div>
    </div>
    <div>
      <ul
        v-if="youthProgramList.length > 0"
        class="space-y-4 text-left max-h-[12.5rem] overflow-scroll"
      >
        <li
          v-for="(program, index) in youthProgramList"
          :key="index"
          class="flex item-start h-[5rem] justify-between gap-2 break-words overflow-hidden"
        >
          <!-- 텍스트: 제목 클릭 시 새창 이동 -->
          <div class="flex-1 pr-4 min-w-0">
            <h3 class="text-small text-base break-words underline">
              <a
                v-if="program.hrefUrl"
                :href="program.hrefUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ program.pstTtl }}
              </a>
              <span v-else>{{ program.pstTtl }}</span>
            </h3>
          </div>

          <!-- 이미지 클릭 시 새창 이동 -->
          <div v-if="program.atchFile" class="w-16 h-16 flex-shrink-0">
            <a
              v-if="program.hrefUrl"
              :href="program.hrefUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                :src="program.atchFile"
                alt="프로그램 이미지"
                class="w-full h-full object-cover rounded-lg"
              />
            </a>
            <img
              v-else
              :src="program.atchFile"
              alt="뉴스 이미지"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
        </li>
      </ul>
      <p v-else class="text-gray-500">로딩중입니다</p>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";
/* 스크롤바 전체 너비 */
ul::-webkit-scrollbar {
  @apply w-[0.5rem]
}

/* 스크롤바 막대(thumb) 스타일 */
ul::-webkit-scrollbar-thumb {
  @apply bg-kb-ui-07 rounded-sm;
}

/* 스크롤바 막대 hover 효과 (선택사항) */
ul::-webkit-scrollbar-thumb:hover {
  @apply bg-kb-gray-light
}

/* 스크롤바 트랙(배경) */
ul::-webkit-scrollbar-track {
  @apply bg-transparent;
}
</style>