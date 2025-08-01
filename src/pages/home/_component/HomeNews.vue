<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NewsDTO } from "@/api/autoLoad/data-contracts";
import { Api } from "@/api/autoLoad/Api";

const api = new Api();
const newsList = ref<NewsDTO[]>([]);

const fetchNews = async (): Promise<void> => {
  try {
    const { data } = await api.getNewsUsingGet();
    newsList.value = data.data;
    console.log("data: ", data);
  } catch (error) {
    console.error("뉴스 데이터를 가져오는 중 오류 발생:", error);
  }
};

onMounted(() => {
  fetchNews();
});
</script>
<template>
  <div
    class="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center mt-6 min-h-[15.625rem]"
  >
    <div class="flex justify-center mb-4">
      <div class="flex flex-row items-center text-base gap-3">
        <h1 class="w-15">
          <img class="w-full" src="@/assets/imgs/youth_logo.svg" alt="온통청년 로고" />
        </h1>
        <h2 class="flex items-center text-base font-semibold gap-x-3">
          <span class="text-kb-ui-06 text-sm">제공</span>
          <span>청년 프로그램</span>
        </h2>
      </div>
    </div>
    <div>
      <ul
        v-if="newsList.length > 0"
        class="space-y-4 text-left overflow-y-auto max-h-[20rem] news-scroll pr-2"
      >
        <li
          v-for="(news, index) in newsList"
          :key="index"
          class="news-item flex item-start h-[7rem] justify-between gap-2 break-words overflow-hidden"
        >
          <!-- 텍스트 -->
          <div class="flex-1 pr-4 min-w-0">
            <h3 class="text-small text-base break-words">{{ news.pstTtl }}</h3>
            <div
              v-if="news.pstWholCn"
              class="text-sm text-gray-600 break-words"
              v-html="news.pstWholCn"
            ></div>
            <a :href="news.pstUrlAddr" target="_blank" class="text-blue-500 underline text-sm">
              링크로 이동
            </a>
          </div>

          <!-- 이미지 -->
          <div v-if="news.atchFile" class="w-25 h-25 flex-shrink-0">
            <img
              :src="news.atchFile"
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
/* Chrome */
.news-scroll::-webkit-scrollbar {
  @apply w-[0.5rem];
}
.news-scroll::-webkit-scrollbar-thumb {
  @apply bg-kb-ui-08 rounded-lg;
}
</style>